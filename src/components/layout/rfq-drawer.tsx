"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Minus, Plus, ShoppingCart, Send, Package, Ticket, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { useRFQStore } from "@/stores/rfq-store";
import { rfqFormSchema, type RFQFormValues } from "@/lib/validations";

type PromoState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "valid"; type: "PERCENT" | "AMOUNT"; value: number; description: string | null }
  | { status: "invalid"; error: string };

export function RFQDrawer() {
  const t = useTranslations("rfqDrawer");
  const store = useRFQStore();
  const [promo, setPromo] = useState<PromoState>({ status: "idle" });

  const form = useForm<RFQFormValues>({
    resolver: zodResolver(rfqFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      country: "",
      buyerType: "distributor",
      categories: [],
      containerEstimate: "not_sure",
      targetPrice: "",
      notes: "",
      source: "home",
      promoCode: "",
    },
  });

  const validatePromo = async () => {
    const code = form.getValues("promoCode")?.trim();
    if (!code) {
      setPromo({ status: "idle" });
      return;
    }
    setPromo({ status: "checking" });
    const res = await fetch("/api/promos/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      const data = await res.json();
      setPromo({
        status: "valid",
        type: data.type,
        value: data.value,
        description: data.description,
      });
    } else {
      const data = await res.json().catch(() => ({}));
      setPromo({ status: "invalid", error: data.error || "Invalid code" });
    }
  };

  const onSubmit = async (data: RFQFormValues) => {
    try {
      const payload = {
        ...data,
        items: store.items,
      };
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(t("form.success"));
        form.reset();
        setPromo({ status: "idle" });
        store.clearItems();
        store.closeDrawer();
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Sheet open={store.isDrawerOpen} onOpenChange={(open) => !open && store.closeDrawer()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="border-b bg-muted/30 px-6 py-5">
          <SheetHeader className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-lg">{t("title")}</SheetTitle>
                  <SheetDescription className="text-xs">
                    Get a quote for your order
                  </SheetDescription>
                </div>
              </div>
              <button
                onClick={() => store.closeDrawer()}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </SheetHeader>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <Tabs
            value={store.activeTab}
            onValueChange={(v) => store.setActiveTab(v as "quick" | "list")}
            className="flex flex-col h-full"
          >
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-2 h-11">
                <TabsTrigger value="quick" className="text-sm">
                  {t("quickRfq")}
                </TabsTrigger>
                <TabsTrigger value="list" className="relative text-sm">
                  {t("rfqList")}
                  {store.items.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-2 h-5 min-w-5 px-1.5 text-[11px] font-semibold"
                    >
                      {store.items.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Quick RFQ Tab */}
            <TabsContent value="quick" className="flex-1 px-6 pb-6 mt-0 pt-5">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Interest Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t("steps.interest")}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">{t("form.country")}</Label>
                    <Input
                      {...form.register("country")}
                      placeholder="e.g. Saudi Arabia"
                      className="h-10"
                    />
                    {form.formState.errors.country && (
                      <p className="text-xs text-destructive">{form.formState.errors.country.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">{t("form.containerEstimate")}</Label>
                    <Select
                      defaultValue="not_sure"
                      onValueChange={(v) => form.setValue("containerEstimate", v as "20ft" | "40ft" | "not_sure")}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20ft">{t("form.20ft")}</SelectItem>
                        <SelectItem value="40ft">{t("form.40ft")}</SelectItem>
                        <SelectItem value="not_sure">{t("form.notSure")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">{t("form.notes")}</Label>
                    <Textarea
                      {...form.register("notes")}
                      rows={2}
                      placeholder="Product interests, target price..."
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm flex items-center gap-1.5">
                      <Ticket className="h-3.5 w-3.5" />
                      Promo code (optional)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        {...form.register("promoCode")}
                        placeholder="SUMMER25"
                        className="h-10 font-mono uppercase"
                        onChange={(e) => {
                          form.setValue("promoCode", e.target.value.toUpperCase());
                          if (promo.status !== "idle") setPromo({ status: "idle" });
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={validatePromo}
                        disabled={promo.status === "checking"}
                        className="h-10 shrink-0"
                      >
                        {promo.status === "checking" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : promo.status === "valid" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                    {promo.status === "valid" && (
                      <p className="text-xs text-green-700">
                        Applied: {promo.type === "PERCENT" ? `${promo.value}% off` : `$${promo.value.toFixed(2)} off`}
                        {promo.description ? ` — ${promo.description}` : ""}
                      </p>
                    )}
                    {promo.status === "invalid" && (
                      <p className="text-xs text-destructive">{promo.error}</p>
                    )}
                  </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t("steps.contact")}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("form.name")}</Label>
                      <Input {...form.register("name")} className="h-10" />
                      {form.formState.errors.name && (
                        <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("form.company")}</Label>
                      <Input {...form.register("company")} className="h-10" />
                      {form.formState.errors.company && (
                        <p className="text-xs text-destructive">{form.formState.errors.company.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">{t("form.email")}</Label>
                    <Input type="email" {...form.register("email")} className="h-10" />
                    {form.formState.errors.email && (
                      <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">{t("form.phone")}</Label>
                    <Input {...form.register("phone")} placeholder="+90 ..." className="h-10" />
                    {form.formState.errors.phone && (
                      <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">{t("form.buyerType")}</Label>
                    <Select
                      defaultValue="distributor"
                      onValueChange={(v) => form.setValue("buyerType", v as RFQFormValues["buyerType"])}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distributor">{t("form.distributor")}</SelectItem>
                        <SelectItem value="retail">{t("form.retail")}</SelectItem>
                        <SelectItem value="small_business">{t("form.smallBusiness")}</SelectItem>
                        <SelectItem value="brand_owner">{t("form.brandOwner")}</SelectItem>
                        <SelectItem value="partner">{t("form.partner")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-sm font-semibold"
                  disabled={form.formState.isSubmitting}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting ? t("form.submitting") : t("form.submit")}
                </Button>
              </form>
            </TabsContent>

            {/* RFQ List Tab */}
            <TabsContent value="list" className="flex-1 px-6 pb-6 mt-0 pt-5">
              {store.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <ShoppingCart className="h-7 w-7 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("emptyList")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    Browse products and add items to your list
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {t("items.total", { count: store.items.length })}
                    </p>
                    <button
                      onClick={() => store.clearItems()}
                      className="text-xs text-destructive hover:underline"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="space-y-3">
                    {store.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3 rounded-xl border bg-card p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.productName}
                          </p>
                          <div className="mt-2 flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={() =>
                                store.updateQuantity(
                                  item.productId,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={() =>
                                store.updateQuantity(item.productId, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => store.removeItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    className="w-full h-12 text-sm font-semibold"
                    onClick={() => store.setActiveTab("quick")}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {t("form.submit")}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
