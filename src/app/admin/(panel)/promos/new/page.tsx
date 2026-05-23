import { AdminTopBar } from "@/components/admin/top-bar";
import { PromoForm } from "@/components/admin/promo-form";

export default function NewPromoPage() {
  return (
    <>
      <AdminTopBar title="New Promo Code" />
      <div className="p-6">
        <PromoForm mode="create" />
      </div>
    </>
  );
}
