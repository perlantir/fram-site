import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries, products } from "@/db/schema";
import { replyToInquiry, updateInquiry } from "../actions";

export default async function InquiryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiryId = Number(id);
  if (!inquiryId) notFound();
  const i = await db.query.inquiries.findFirst({ where: eq(inquiries.id, inquiryId) });
  if (!i) notFound();
  const p = i.productId
    ? await db.query.products.findFirst({ where: eq(products.id, i.productId) })
    : null;

  return (
    <div>
      <p className="kicker kicker-muted">Inquiry #{i.id}</p>
      <h1 className="mt-4 mb-8 font-serif-display" style={{ fontSize: "2.5rem" }}>
        {i.name}
      </h1>

      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <dl className="grid grid-cols-[8rem_1fr] gap-y-3 text-sm">
            <dt className="kicker kicker-muted">Email</dt>
            <dd>
              <a href={`mailto:${i.email}`} className="underline">
                {i.email}
              </a>
            </dd>
            <dt className="kicker kicker-muted">Phone</dt>
            <dd>{i.phone ?? "—"}</dd>
            <dt className="kicker kicker-muted">Product</dt>
            <dd>{p?.name ?? "—"}</dd>
            <dt className="kicker kicker-muted">Location</dt>
            <dd>{i.location ?? "—"}</dd>
            <dt className="kicker kicker-muted">Timeline</dt>
            <dd>{i.timeline ?? "—"}</dd>
            <dt className="kicker kicker-muted">Received</dt>
            <dd>{i.createdAt.toISOString()}</dd>
            <dt className="kicker kicker-muted">IP</dt>
            <dd className="font-mono text-xs">{i.ip ?? "—"}</dd>
          </dl>

          <div className="border-t rule-soft pt-6">
            <p className="kicker kicker-muted mb-3">Message</p>
            <p className="whitespace-pre-wrap text-base leading-relaxed">{i.message}</p>
          </div>

          <div className="border-t rule-soft pt-6">
            <p className="kicker kicker-muted mb-3">Reply</p>
            <form action={replyToInquiry} className="space-y-4">
              <input type="hidden" name="id" value={i.id} />
              <div>
                <label>Subject</label>
                <input
                  name="subject"
                  required
                  defaultValue={`Re: your FRAM inquiry`}
                />
              </div>
              <div>
                <label>Message</label>
                <textarea name="body" required rows={8} className="min-h-40" />
              </div>
              <button className="btn-primary" type="submit">
                Send reply
              </button>
            </form>
          </div>
        </div>

        <div>
          <form action={updateInquiry} className="space-y-4 border rule p-6">
            <input type="hidden" name="id" value={i.id} />
            <div>
              <label>Status</label>
              <select name="status" defaultValue={i.status}>
                <option value="new">New</option>
                <option value="in_review">In review</option>
                <option value="quoted">Quoted</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label>Internal notes</label>
              <textarea name="notes" rows={8} defaultValue={i.notes ?? ""} />
            </div>
            <button className="btn-primary w-full" type="submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
