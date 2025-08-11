import { Link } from "react-router-dom";
import { useLocaleStore } from "@/state/locale";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const { locale, setLocale } = useLocaleStore();

  return (
    <footer className="mt-16 border-t">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 rounded-pill bg-secondary grid place-items-center">
              <span className="text-sm font-semibold">Z</span>
            </div>
            <span className="font-head text-lg font-semibold">zayna</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Moroccan heritage, clinically-minded clean beauty with cash-on-delivery convenience.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:underline">Shop</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>Email: contact@zayna.ma</li>
            <li>WhatsApp: +212 607 076 940</li>
            <li>Mon–Fri: 9:00–18:00</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Language</h4>
          <div className="flex items-center gap-2">
            <Button variant={locale === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setLocale('en')}>EN</Button>
            <Button variant={locale === 'fr' ? 'default' : 'outline'} size="sm" onClick={() => setLocale('fr')}>FR</Button>
            <Button variant={locale === 'ar' ? 'default' : 'outline'} size="sm" onClick={() => setLocale('ar')}>AR</Button>
          </div>
        </div>
      </div>
      <div className="py-4 border-t text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} zayna. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
