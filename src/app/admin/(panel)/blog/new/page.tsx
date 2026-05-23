import { AdminTopBar } from "@/components/admin/top-bar";
import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPostPage() {
  return (
    <>
      <AdminTopBar title="New Blog Post" />
      <div className="p-6">
        <BlogForm mode="create" />
      </div>
    </>
  );
}
