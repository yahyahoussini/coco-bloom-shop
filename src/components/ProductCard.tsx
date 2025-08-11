import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/types/models";
import { useCart } from "@/state/cart";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import VariantSelector from "./VariantSelector";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const add = useCart(s => s.add);
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (product.variants && product.variants.length > 0) {
      setOpen(true);
      return;
    }
    add({ productId: product.id, qty: 1, unitPrice: product.price });
    toast({ title: "Added to cart", description: product.name });
  };

  return (
    <Card className="rounded-card shadow-soft hover:shadow-softer transition-shadow overflow-hidden">
      <CardContent className="p-4">
        <div className="relative">
          <Link to={`/product/${product.slug}`}>
            <div className="rounded-card overflow-hidden bg-secondary aspect-square grid place-items-center">
              <img src={product.images[0]} alt={product.name} className="h-24" loading="lazy" />
            </div>
          </Link>
          <Button
            variant="circle"
            size="icon"
            aria-label="Add to cart"
            className="absolute -bottom-3 -right-2"
            onClick={handleAdd}
          >
            <Plus />
          </Button>
        </div>
        <Link to={`/product/${product.slug}`}>
          <div className="mt-4 space-y-1">
            <div className="text-sm line-clamp-2">{product.name}{product.volume ? ` · ${product.volume}` : ""}</div>
            <div className="text-base font-semibold">${product.price.toFixed(0)}</div>
          </div>
        </Link>
      </CardContent>

      {product.variants && (
        <VariantSelector open={open} onOpenChange={setOpen} product={product} />
      )}
    </Card>
  );
};

export default ProductCard;
