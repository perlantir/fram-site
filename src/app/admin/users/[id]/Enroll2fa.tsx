"use client";

import { useState } from "react";
import { begin2fa, confirm2fa } from "../actions";

export function Enroll2fa({ userId, enabled }: { userId: string; enabled: boolean }) {
  const [qr, setQr] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        className="btn-primary"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setErr(null);
          try {
            const res = await begin2fa(userId);
            setQr(res.qr);
            setUrl(res.url);
            setSecret(res.secret);
          } catch (e) {
            setErr((e as Error).message);
          } finally {
            setPending(false);
          }
        }}
      >
        {enabled ? "Rotate 2FA secret" : "Generate 2FA secret"}
      </button>

      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

      {qr && (
        <div className="mt-8 grid gap-6 md:grid-cols-[280px_1fr] md:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="2FA QR code" width={280} height={280} className="border rule" />
          <div>
            <p className="kicker kicker-muted">Manual key</p>
            <p className="mt-3 break-all font-mono text-xs">{secret}</p>
            <p className="kicker kicker-muted mt-6">otpauth URL</p>
            <p className="mt-3 break-all font-mono text-xs">{url}</p>
            <form
              action={confirm2fa}
              className="mt-8 flex items-end gap-4"
            >
              <input type="hidden" name="id" value={userId} />
              <div className="flex-1">
                <label>Enter 6-digit code to confirm</label>
                <input
                  name="token"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  required
                />
              </div>
              <button className="btn-primary" type="submit">
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
