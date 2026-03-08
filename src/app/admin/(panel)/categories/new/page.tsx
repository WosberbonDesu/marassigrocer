import { AdminTopBar } from "@/components/admin/top-bar";
import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <>
      <AdminTopBar title="New Category" />
      <div className="p-6">
        <CategoryForm />
      </div>
    </>
  );
}
