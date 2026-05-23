import { AdminTopBar } from "@/components/admin/top-bar";
import { PageForm } from "@/components/admin/page-form";

export default function NewCmsPage() {
  return (
    <>
      <AdminTopBar title="New Page" />
      <div className="p-6">
        <PageForm mode="create" />
      </div>
    </>
  );
}
