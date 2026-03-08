import { AdminTopBar } from "@/components/admin/top-bar";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <>
      <AdminTopBar title="New Product" />
      <div className="p-6">
        <ProductForm />
      </div>
    </>
  );
}
