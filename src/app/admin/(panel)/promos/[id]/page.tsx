import { notFound } from "next/navigation";
import { AdminTopBar } from "@/components/admin/top-bar";
import { PromoForm } from "@/components/admin/promo-form";
import { db } from "@/lib/db";

const toDateInput = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");

export default async function EditPromoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const promo = await db.promoCode.findUnique({ where: { id } });
  if (!promo) notFound();

  return (
    <>
      <AdminTopBar title="Edit Promo Code" />
      <div className="p-6">
        <PromoForm
          mode="edit"
          promoId={promo.id}
          initial={{
            code: promo.code,
            description: promo.description ?? "",
            type: promo.type,
            value: promo.value,
            minOrder: promo.minOrder?.toString() ?? "",
            maxUses: promo.maxUses?.toString() ?? "",
            validFrom: toDateInput(promo.validFrom),
            validUntil: toDateInput(promo.validUntil),
            active: promo.active,
          }}
        />
      </div>
    </>
  );
}
