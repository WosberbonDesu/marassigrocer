import { AdminTopBar } from "@/components/admin/top-bar";
import { BrandForm } from "@/components/admin/brand-form";

export default function NewBrandPage() {
  return (
    <>
      <AdminTopBar title="New Brand" />
      <div className="p-6">
        <BrandForm />
      </div>
    </>
  );
}
