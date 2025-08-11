import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { locales } from "@/lib/i18n";

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center justify-center space-x-2">
      <h4 className="font-semibold text-sm">Language:</h4>
      <div className="flex items-center rounded-lg border p-1">
        {locales.map((loc) => (
          <Button
            key={loc}
            variant={locale === loc ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setLocale(loc as 'en' | 'fr' | 'ar')}
            className="text-xs"
          >
            {loc.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
};


const Footer = () => {
  return (
    <footer className="mt-16 border-t">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 rounded-pill bg-secondary grid place-items-center">
              <span className="text-sm font-semibold">CB</span>
            </div>
            <span className="font-head text-lg font-semibold">Coco Bloom</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Premium bio-cosmetics crafted with care. Clean, soft and modern skincare designed for everyday rituals.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:underline">Shop</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/blog" className="hover:underline">Blog</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>Email: hello@cocobloom.example</li>
            <li>Phone: +212 607 076 940</li>
            <li>Mon–Fri: 9:00–18:00</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Follow</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">TikTok</a></li>
            <li><a href="#" className="hover:underline">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="py-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Coco Bloom. All rights reserved.
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
