import { AdminTopBar } from "@/components/admin/top-bar";
import { UserForm } from "@/components/admin/user-form";

export default function NewUserPage() {
  return (
    <>
      <AdminTopBar title="Add User" />
      <div className="p-6">
        <UserForm mode="create" />
      </div>
    </>
  );
}
