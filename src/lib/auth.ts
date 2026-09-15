import { hash, verify } from "@node-rs/argon2";
import { eq, sql as dsql } from "drizzle-orm";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as OTPAuth from "otpauth";
import { z } from "zod";
import { db } from "@/db";
import { auditLog, loginAttempts, users } from "@/db/schema";

const argonOptions = { memoryCost: 19456, timeCost: 2, parallelism: 1 } as const;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, argonOptions);
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  try {
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
}

export function newTotp(email: string): OTPAuth.TOTP {
  return new OTPAuth.TOTP({
    issuer: "FRAM",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: new OTPAuth.Secret({ size: 20 }),
  });
}

export function verifyTotp(secret: string, token: string): boolean {
  try {
    const totp = new OTPAuth.TOTP({
      issuer: "FRAM",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });
    const delta = totp.validate({ token: token.replace(/\s/g, ""), window: 1 });
    return delta !== null;
  } catch {
    return false;
  }
}

const credentialsSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
  totp: z.string().optional(),
});

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

async function recordAttempt(email: string | null, ip: string | null, success: boolean) {
  await db.insert(loginAttempts).values({ email, ip, success });
}

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  cookies: {
    sessionToken: {
      name: "__Host-fram.session",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        totp: {},
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password, totp } = parsed.data;
        const emailNorm = email.toLowerCase().trim();

        const user = await db.query.users.findFirst({
          where: eq(users.email, emailNorm),
        });

        if (!user || user.disabledAt) {
          await recordAttempt(emailNorm, null, false);
          return null;
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          await recordAttempt(emailNorm, null, false);
          return null;
        }

        const ok = await verifyPassword(user.passwordHash, password);
        if (!ok) {
          const attempts = user.failedAttempts + 1;
          const shouldLock = attempts >= MAX_ATTEMPTS;
          await db
            .update(users)
            .set({
              failedAttempts: attempts,
              lockedUntil: shouldLock
                ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000)
                : user.lockedUntil,
            })
            .where(eq(users.id, user.id));
          await recordAttempt(emailNorm, null, false);
          return null;
        }

        if (user.role === "admin" || user.totpEnabled) {
          if (!user.totpSecret) return null;
          const token = (totp ?? "").trim();
          if (!token || !verifyTotp(user.totpSecret, token)) {
            await recordAttempt(emailNorm, null, false);
            return null;
          }
        }

        await db
          .update(users)
          .set({
            failedAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          })
          .where(eq(users.id, user.id));

        await recordAttempt(emailNorm, null, true);
        await db.insert(auditLog).values({
          userId: user.id,
          userEmail: user.email,
          action: "auth.login",
          entity: "user",
          entityId: user.id,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.uid = (user as { id: string }).id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.uid as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export type Role = "admin" | "editor" | "viewer";

export async function requireRole(min: Role): Promise<{
  id: string;
  email: string;
  role: Role;
}> {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string; role?: Role } | undefined;
  if (!user?.id || !user.role) {
    throw new Error("UNAUTHENTICATED");
  }
  const ranks = { viewer: 1, editor: 2, admin: 3 } as const;
  if (ranks[user.role] < ranks[min]) {
    throw new Error("FORBIDDEN");
  }
  return { id: user.id, email: user.email!, role: user.role };
}

// touch dsql to satisfy tree-shaker for potential future raw queries
export const _dsql = dsql;
