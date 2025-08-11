import { ShoppingBag, Search, SlidersHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/state/cart";

const Header = () => {
  const { itemsCount } = useCart();
  const location = useLocation();
  const onShop = location.pathname.startsWith("/shop");

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-pill bg-secondary flex items-center justify-center">
            <span className="sr-only">Coco Bloom</span>
            <span className="text-sm font-semibold">CB</span>
          </div>
          <span className="font-head text-lg font-semibold">Coco Bloom</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/shop" className="story-link">Shop</Link>
          <Link to="/blog" className="story-link">Blog</Link>
          <Link to="/about" className="story-link">About</Link>
          <Link to="/contact" className="story-link">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Filters" className={onShop ? "" : "opacity-60"}>
            <SlidersHorizontal />
          </Button>
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingBag />
            </Button>
            {itemsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] grid place-items-center">
                {itemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
