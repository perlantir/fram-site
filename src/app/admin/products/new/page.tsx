import { ProductForm } from "../ProductForm";

export default function NewProduct() {
  return (
    <div>
      <p className="kicker kicker-muted">Create.</p>
      <h1 className="mt-4 mb-10 font-serif-display" style={{ fontSize: "2.5rem" }}>
        New product.
      </h1>
      <ProductForm />
    </div>
  );
}
