import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/types/models";
import { useCart } from "@/state/cart";
import { useState } from "react";

interface Props {
  product: Product;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const VariantSelector = ({ product, open, onOpenChange }: Props) => {
  const add = useCart(s => s.add);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);

  const canAdd = product.variants?.every(v => selections[v.id]);

  const apply = () => {
    if (!canAdd) return;
    add({ productId: product.id, qty, unitPrice: product.price, variantSelections: selections });
    toast({ title: "Added to cart", description: product.name });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[--radius-modal]">
        <SheetHeader>
          <SheetTitle>Select options</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-6">
          {product.variants?.map(v => (
            <div key={v.id} className="space-y-2">
              <div className="text-sm font-medium">{v.name}</div>
              <div className="flex gap-2 flex-wrap">
                {v.options.map(opt => (
                  <Button key={opt} variant={selections[v.id] === opt ? "hero" : "chip"} size="chip" onClick={() => setSelections(prev => ({ ...prev, [v.id]: opt }))}>
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <div className="text-sm font-medium">Quantity</div>
            <div className="flex gap-2 items-center">
              <Button variant="outline" onClick={() => setQty(q => Math.max(1, q - 1))}>-</Button>
              <Input className="w-16 text-center" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value || '1')))} />
              <Button variant="outline" onClick={() => setQty(q => q + 1)}>+</Button>
            </div>
          </div>
          <div className="pt-2">
            <Button variant="hero" className="w-full" disabled={!canAdd} onClick={apply}>Add to Cart</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VariantSelector;
