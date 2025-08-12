import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/state/cart";
import { products } from "@/data/products";
import { toast } from "@/components/ui/use-toast";
import { track } from "@/lib/analytics";
import { Minus, Plus, X } from "lucide-react";

// i18n minimal setup
const locales = ["en", "fr", "ar"] as const;
export type Lang = typeof locales[number];
const tDict: Record<Lang, Record<string, string>> = {
  en: {
    cart: "Cart",
    empty: "Your cart is empty",
    goShop: "Go to Shop",
    bestsellers: "Bestsellers",
    qty: "Qty",
    remove: "Remove",
    subtotal: "Subtotal",
    discount: "Discount",
    shipping: "Shipping",
    vatIncluded: "VAT (included)",
    total: "Total",
    promoPlaceholder: "Promo code",
    apply: "Apply",
    removeCode: "Remove",
    deliverySla: "48–72h nationwide; 72–96h for remote zones.",
    codTitle: "Cash on Delivery",
    fullName: "Full name",
    phone: "Phone (+212)",
    city: "City",
    address: "Address",
    notes: "Notes",
    preferredTime: "Preferred time window",
    consent: "I agree to the Privacy Policy and Terms.",
    checkout: "Checkout (COD)",
    orderWhatsapp: "Order via WhatsApp",
    freeOver: "Free over 399 MAD",
    toFree: "to free shipping",
    incVatNote: "All prices include 20% VAT",
    success: "Order placed",
    trackOrder: "Track Order",
    continue: "Continue shopping",
  },
  fr: {
    cart: "Panier",
    empty: "Votre panier est vide",
    goShop: "Aller à la boutique",
    bestsellers: "Meilleures ventes",
    qty: "Qté",
    remove: "Retirer",
    subtotal: "Sous-total",
    discount: "Remise",
    shipping: "Livraison",
    vatIncluded: "TVA (incluse)",
    total: "Total",
    promoPlaceholder: "Code promo",
    apply: "Appliquer",
    removeCode: "Supprimer",
    deliverySla: "48–72h national; 72–96h zones éloignées.",
    codTitle: "Paiement à la livraison",
    fullName: "Nom complet",
    phone: "Téléphone (+212)",
    city: "Ville",
    address: "Adresse",
    notes: "Notes",
    preferredTime: "Créneau préféré",
    consent: "J'accepte la Politique de confidentialité et les Conditions.",
    checkout: "Valider (COD)",
    orderWhatsapp: "Commander via WhatsApp",
    freeOver: "Gratuit dès 399 MAD",
    toFree: "pour la livraison gratuite",
    incVatNote: "Tous les prix incluent 20% de TVA",
    success: "Commande passée",
    trackOrder: "Suivre la commande",
    continue: "Continuer vos achats",
  },
  ar: {
    cart: "السلة",
    empty: "سلتك فارغة",
    goShop: "اذهب إلى المتجر",
    bestsellers: "الأكثر مبيعًا",
    qty: "الكمية",
    remove: "إزالة",
    subtotal: "الإجمالي الفرعي",
    discount: "الخصم",
    shipping: "الشحن",
    vatIncluded: "الضريبة (مشمولة)",
    total: "الإجمالي",
    promoPlaceholder: "رمز التخفيض",
    apply: "تطبيق",
    removeCode: "حذف",
    deliverySla: "48–72 ساعة محليًا؛ 72–96 ساعة للمناطق البعيدة.",
    codTitle: "الدفع عند الاستلام",
    fullName: "الاسم الكامل",
    phone: "الهاتف (+212)",
    city: "المدينة",
    address: "العنوان",
    notes: "ملاحظات",
    preferredTime: "الوقت المفضل",
    consent: "أوافق على سياسة الخصوصية والشروط.",
    checkout: "الدفع (COD)",
    orderWhatsapp: "الطلب عبر واتساب",
    freeOver: "مجاني فوق 399 درهم",
    toFree: "للحصول على شحن مجاني",
    incVatNote: "جميع الأسعار تشمل 20% ضريبة",
    success: "تم تقديم الطلب",
    trackOrder: "تتبع الطلب",
    continue: "متابعة التسوق",
  },
};

function useI18n() {
  const [lang, setLang] = useState<Lang>("fr");
  const t = (k: string) => tDict[lang][k] ?? k;
  return { lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr", locale: lang === "fr" ? "fr-MA" : lang === "ar" ? "ar-MA" : "en" };
}

function formatMAD(n: number, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "MAD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

// Promo codes
const PROMOS = [
  { code: "WELCOME10", type: "percent" as const, value: 10, minSubtotal: 299 },
  { code: "TUSSNA50", type: "fixed" as const, value: 50, minSubtotal: 399 },
  { code: "FREESHIP", type: "freeship" as const, value: 0, minSubtotal: 399 },
];

const CITIES = ["Casablanca","Rabat","Marrakech","Fes","Tangier","Agadir","Oujda","Meknes","Kenitra","Tetouan"];

const phoneRegex = /^(?:\+212|0)([ \-]?)\d{9}$/;
const CodSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(phoneRegex),
  city: z.string().min(2),
  address: z.string().min(6),
  notes: z.string().optional(),
  preferredTime: z.string().optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent required" }) }),
});

type CodForm = z.infer<typeof CodSchema>;

function normalizePhone(p: string) {
  const digits = p.replace(/[^\\d]/g, "");
  if (digits.startsWith("212")) return "+" + digits;
  if (digits.startsWith("0")) return "+212" + digits.slice(1);
  if (digits.startsWith("+212")) return "+212" + digits.slice(4);
  return "+212" + digits;
}

export default function Cart() {
  const { lang, setLang, t, dir, locale } = useI18n();
  const { items, itemsCount, subtotal, setQty, remove, clear } = useCart();

  // Enrich items with product data
  const enriched = useMemo(() => items.map(it => {
    const p = products.find(pp => pp.id === it.productId);
    return {
      ...it,
      name: p?.name || it.productId,
      slug: p?.slug || "",
      image: p?.images?.[0] || "/placeholder.svg",
      inStock: p?.inStock ?? true,
    };
  }), [items]);

  useEffect(() => {
    document.title = `${t("cart")} — Coco Bloom`;
    // Meta description
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    if (meta) meta.content = "Review your items and checkout with Cash on Delivery.";
    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    if (link) link.href = window.location.href;
    track({ name: "cart_view", payload: {} });
  }, [t]);

  // Promo state
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<null | { code: string; type: "percent"|"fixed"|"freeship"; value: number; minSubtotal: number }>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const subtotalMAD = subtotal; // prices are already MAD (spec)

  const { discount, shipping, vatIncluded, total } = useMemo(() => {
    const sub = subtotalMAD;
    let discount = 0;
    const code = appliedPromo?.code;
    if (appliedPromo) {
      if (sub < appliedPromo.minSubtotal) {
        // if subtotal dropped below minimum, remove promo automatically
        discount = 0;
      } else if (appliedPromo.type === "percent") {
        discount = Math.floor((sub * appliedPromo.value) / 100);
      } else if (appliedPromo.type === "fixed") {
        discount = Math.min(appliedPromo.value, sub);
      } else {
        discount = 0;
      }
    }
    const afterPromo = Math.max(0, sub - discount);
    let shipping = afterPromo >= 399 ? 0 : 39;
    if (code === "FREESHIP" && afterPromo >= 399) shipping = 0;
    if (code === "FREESHIP" && afterPromo < 399) shipping = 39; // respect min subtotal
    const vatIncluded = Math.round(afterPromo * (20 / 120));
    const total = afterPromo + shipping;
    return { discount, shipping, vatIncluded, total };
  }, [subtotalMAD, appliedPromo]);

  const freeThreshold = 399;
  const progress = Math.min(1, Math.max(0, (subtotalMAD - (appliedPromo ? discount : 0)) / freeThreshold));

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    setPromoError(null);
    const found = PROMOS.find(p => p.code === code);
    if (!found) { setPromoError("Invalid code"); return; }
    if (subtotalMAD < (found.minSubtotal ?? 0)) { setPromoError(`Min ${found.minSubtotal} MAD subtotal required`); return; }
    setAppliedPromo(found as any);
    toast({ title: "Promo applied", description: code });
    track({ name: "promo_apply", payload: { code } });
  };

  const removePromo = () => setAppliedPromo(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<CodForm>({ resolver: zodResolver(CodSchema), defaultValues: { consent: false } as any });

  const onCheckout = async (data: CodForm) => {
    track({ name: "checkout_click", payload: { method: "cod" } });
    await new Promise(r => setTimeout(r, 600));
    const date = new Date();
    const code = `ORD-${date.toISOString().slice(0,10).replace(/-/g,"")}-${Math.floor(1000 + Math.random()*9000)}`;
    setSuccess({ code, name: data.fullName, phone: normalizePhone(data.phone) });
    track({ name: "cod_submit_success", payload: { orderCode: code, itemsCount, total } });
    toast({ title: t("success"), description: code });
    // Optionally clear cart or keep items until delivery; we keep for now.
    reset();
  };

  const buildWhatsappUrl = () => {
    track({ name: "checkout_click", payload: { method: "whatsapp" } });
    const lines = [
      "Hello, I'd like to place a COD order.",
      "Items:",
      ...enriched.map(it => {
        const lineTotal = it.unitPrice * it.qty;
        const vars = it.variantSelections ? ` (${Object.entries(it.variantSelections).map(([k,v]=>`${k}:${v}`).join(", ")})` : "";
        return `- ${it.name}${vars} x${it.qty} = ${lineTotal} MAD`;
      }),
      `Subtotal: ${subtotalMAD} MAD`,
      appliedPromo && discount ? `Discount: -${discount} MAD` : undefined,
      `Shipping: ${shipping} MAD`,
      `VAT: ${vatIncluded} MAD`,
      `Total: ${total} MAD`,
      `Name: ${watch("fullName") || ""}`,
      `Phone: ${normalizePhone(watch("phone") || "")}`,
      `City: ${watch("city") || ""}`,
      `Address: ${watch("address") || ""}`,
      `Notes: ${watch("notes") || ""}`,
    ].filter(Boolean).join("\n");
    const encoded = encodeURIComponent(lines);
    return `https://wa.me/212607076940?text=${encoded}`;
  };

  const [success, setSuccess] = useState<null | { code: string; name: string; phone: string }>(null);

  const changeQty = (productId: string, delta: number, current: number) => {
    const next = Math.max(1, current + delta);
    setQty(productId, next);
    track({ name: "qty_change", payload: { productId, qty: next } });
  };

  const removeItem = (productId: string) => {
    remove(productId);
    track({ name: "remove_item", payload: { productId } });
    toast({ title: t("remove"), description: productId });
  };

  const empty = itemsCount === 0;

  return (
    <main className="container mx-auto px-4 py-4" dir={dir}>
      {/* Header row */}
      <div className="sticky top-[56px] z-20 bg-background/80 backdrop-blur -mx-4 px-4 border-b">
        <div className="h-12 flex items-center justify-between">
          <h1 className="font-head text-lg font-semibold">{t("cart")}</h1>
          <div className="flex items-center gap-2">
            <Button variant={lang==='fr'? 'hero':'chip'} size="chip" onClick={()=>setLang('fr')}>FR</Button>
            <Button variant={lang==='en'? 'hero':'chip'} size="chip" onClick={()=>setLang('en')}>EN</Button>
            <Button variant={lang==='ar'? 'hero':'chip'} size="chip" onClick={()=>setLang('ar')}>AR</Button>
          </div>
        </div>
      </div>

      {empty ? (
        <section className="py-16 text-center">
          <div className="mx-auto max-w-xs">
            <div className="rounded-card bg-secondary aspect-square grid place-items-center">
              <span className="text-5xl">🛍️</span>
            </div>
            <h2 className="mt-6 text-xl font-semibold">{t("empty")}</h2>
            <div className="mt-4"><Link to="/shop"><Button variant="hero">{t("goShop")}</Button></Link></div>
          </div>
          {/* Cross-sell placeholder */}
          <div className="mt-10 text-left">
            <h3 className="font-head text-lg font-semibold">{t("bestsellers")}</h3>
            <div className="mt-3 flex gap-4 overflow-x-auto pb-1">
              {products.slice(0,6).map(p => (
                <Link key={p.id} to={`/product/${p.slug}`} className="min-w-[180px] rounded-card border p-3 shadow-soft">
                  <div className="rounded-card bg-secondary aspect-square grid place-items-center overflow-hidden">
                    <img src={p.images[0]} alt={p.name} className="h-20" loading="lazy" />
                  </div>
                  <div className="mt-2 text-sm line-clamp-2">{p.name}</div>
                  <div className="text-base font-semibold">{formatMAD(p.price, locale)}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6">
          {/* Cart list */}
          <div className="space-y-3">
            {enriched.map(it => (
              <article key={it.productId} className="rounded-card border p-3 shadow-soft">
                <div className="flex gap-3">
                  <Link to={`/product/${it.slug}`} className="size-20 rounded-md bg-secondary grid place-items-center overflow-hidden">
                    <img src={it.image} alt={it.name} className="h-16" loading="lazy" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${it.slug}`} className="font-medium line-clamp-2">
                      {it.name}
                    </Link>
                    {it.variantSelections && (
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {Object.entries(it.variantSelections).map(([k,v]) => (
                          <span key={k} className="rounded-pill border px-2 py-0.5">{k}: {v}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-base font-semibold">{formatMAD(it.unitPrice, locale)}</div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" aria-label="Decrease" onClick={()=>changeQty(it.productId,-1,it.qty)}><Minus/></Button>
                        <Input className="w-14 text-center" value={it.qty} onChange={e=>{
                          const v = Math.max(1, parseInt(e.target.value||'1'));
                          setQty(it.productId, v);
                          track({ name: "qty_change", payload: { productId: it.productId, qty: v } });
                        }} />
                        <Button variant="outline" size="icon" aria-label="Increase" onClick={()=>changeQty(it.productId,1,it.qty)}><Plus/></Button>
                        <Button variant="ghost" size="icon" aria-label={t("remove")} onClick={()=>removeItem(it.productId)}><X/></Button>
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Line: {formatMAD(it.unitPrice * it.qty, locale)}
                    </div>
                  </div>
                </div>
                {!it.inStock && (
                  <div className="mt-2 text-xs text-destructive">Out of stock</div>
                )}
              </article>
            ))}
          </div>

          {/* Summary + Checkout */}
          <aside className="md:sticky md:top-[112px] self-start">
            <div className="rounded-card border p-4 shadow-soft">
              <h2 className="font-head text-lg font-semibold">Summary</h2>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span>{t("subtotal")}</span><span>{formatMAD(subtotalMAD, locale)}</span></div>
                {appliedPromo && discount > 0 && (
                  <div className="flex justify-between text-green-600"><span>{t("discount")} ({appliedPromo.code})</span><span>-{formatMAD(discount, locale)}</span></div>
                )}
                <div className="flex justify-between"><span>{t("shipping")}</span><span>{formatMAD(shipping, locale)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>{t("vatIncluded")}</span><span>{formatMAD(vatIncluded, locale)}</span></div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-semibold"><span>{t("total")}</span><span>{formatMAD(total, locale)}</span></div>
                <div className="text-xs text-muted-foreground">{t("incVatNote")}</div>
              </div>

              {/* Free shipping progress */}
              {subtotalMAD - (appliedPromo && discount ? discount : 0) < freeThreshold && (
                <div className="mt-3">
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${progress*100}%` }} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{formatMAD(freeThreshold - Math.max(0, subtotalMAD - (appliedPromo?discount:0)), locale)} {t("toFree")}</div>
                </div>
              )}

              {/* Promo */}
              <div className="mt-4">
                <div className="flex gap-2">
                  <Input placeholder={t("promoPlaceholder")} value={promoInput} onChange={e=>setPromoInput(e.target.value)} className="rounded-pill" />
                  {appliedPromo ? (
                    <Button variant="secondary" onClick={removePromo}>{t("removeCode")}</Button>
                  ) : (
                    <Button variant="hero" onClick={applyPromo}>{t("apply")}</Button>
                  )}
                </div>
                {promoError && <div className="mt-1 text-xs text-destructive" role="alert">{promoError}</div>}
              </div>

              {/* Info chips */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-pill border px-2 py-1">{t("deliverySla")}</span>
                <span className="rounded-pill border px-2 py-1">COD</span>
              </div>
            </div>

            {/* Inline checkout */}
            <div className="mt-4 rounded-card border p-4 shadow-soft">
              <h3 className="font-head text-lg font-semibold">{t("codTitle")}</h3>
              <form className="mt-3 grid gap-3" onSubmit={handleSubmit(onCheckout)}>
                <Input aria-label={t("fullName")} placeholder={t("fullName")} {...register("fullName")} />
                {errors.fullName && <span className="text-xs text-destructive">{errors.fullName.message as string}</span>}
                <Input aria-label={t("phone")} placeholder={t("phone")} {...register("phone")} />
                {errors.phone && <span className="text-xs text-destructive">{errors.phone.message as string}</span>}
                <div>
                  <Input aria-label={t("city")} placeholder={t("city")} list="cities" {...register("city")} />
                  <datalist id="cities">
                    {CITIES.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
                {errors.city && <span className="text-xs text-destructive">{errors.city.message as string}</span>}
                <Textarea aria-label={t("address")} placeholder={t("address")} {...register("address")} />
                {errors.address && <span className="text-xs text-destructive">{errors.address.message as string}</span>}
                <Input aria-label={t("preferredTime")} placeholder={t("preferredTime")} {...register("preferredTime")} />
                <Textarea aria-label={t("notes")} placeholder={t("notes")} {...register("notes")} />

                <label className="flex items-center gap-2 text-sm">
                  <Checkbox {...register("consent")} />
                  <span>
                    {t("consent")} {" "}
                    <a href="/privacy" target="_blank" className="underline">Privacy</a> · <a href="/terms" target="_blank" className="underline">Terms</a>
                  </span>
                </label>
                {errors.consent && <span className="text-xs text-destructive">{errors.consent.message as string}</span>}

                <div className="grid sm:grid-cols-2 gap-2">
                  <Button type="submit" variant="hero" disabled={isSubmitting}>{t("checkout")}</Button>
                  <Button type="button" variant="outline" onClick={()=>{
                    const url = buildWhatsappUrl();
                    window.open(url, "_blank");
                  }}>{t("orderWhatsapp")}</Button>
                </div>
              </form>
            </div>
          </aside>
        </section>
      )}

      {/* Sticky bottom bar */}
      {!empty && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/90 backdrop-blur md:hidden">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <div className="text-lg font-semibold mr-auto">{formatMAD(total, locale)}</div>
            <Button variant="hero" onClick={()=>{
              const form = document.querySelector("form");
              (form as HTMLFormElement | null)?.requestSubmit();
            }}>{t("checkout")}</Button>
          </div>
        </div>
      )}

      {/* Success modal */}
      <Dialog open={!!success} onOpenChange={(o)=>{ if(!o) setSuccess(null); }}>
        <DialogContent className="rounded-[--radius-modal]">
          <DialogHeader>
            <DialogTitle>{t("success")}</DialogTitle>
            <DialogDescription>Order code: {success?.code}</DialogDescription>
          </DialogHeader>
          <div className="text-sm">We sent a confirmation to WhatsApp if provided.</div>
          <DialogFooter>
            <Link to={`/track-order?code=${encodeURIComponent(success?.code||"")}&phone=${encodeURIComponent(success?.phone||"")}`}>
              <Button variant="secondary">{t("trackOrder")}</Button>
            </Link>
            <Link to="/shop">
              <Button variant="hero">{t("continue")}</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
