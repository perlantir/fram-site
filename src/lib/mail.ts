import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.FROM_EMAIL ?? "FRAM <no-reply@fram.example>";

const client = apiKey ? new Resend(apiKey) : null;

export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  if (!client) {
    console.log("[mail] (dev, not sent):", { to, subject, text });
    return { skipped: true };
  }
  const res = await client.emails.send({
    from,
    to,
    subject,
    text,
    html: html ?? text,
  });
  return res;
}
