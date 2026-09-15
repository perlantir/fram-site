import { EvidenceForm } from "../EvidenceForm";

export default function NewEvidence() {
  return (
    <div>
      <p className="kicker kicker-muted">New citation.</p>
      <h1 className="mt-4 mb-10 font-serif-display" style={{ fontSize: "2.5rem" }}>
        Add evidence.
      </h1>
      <EvidenceForm />
    </div>
  );
}
