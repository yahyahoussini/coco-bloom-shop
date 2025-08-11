import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/context/LanguageContext";

const socialLinks = {
  instagram: "#",
  tiktok: "#",
  facebook: "#",
  youtube: "#",
};

const Chip = ({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) => (
  <div className="flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
    <Icon className="me-2 h-4 w-4 text-primary" /> {text}
  </div>
);

const InfoPanel = () => {
  const t = useTranslation();

  return (
    <Card className="rounded-card shadow-soft">
      <CardHeader>
        <CardTitle>{t.supportChannels}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Buttons */}
        <div className="space-y-3">
          <Button asChild variant="outline" className="h-auto w-full justify-start text-left">
            <a href="https://wa.me/212607076940?text=Hello%20Tussna" target="_blank" rel="noopener noreferrer" className="flex items-center p-3">
              <Phone className="me-4 h-5 w-5 flex-shrink-0" />
              <div className="flex-grow">
                <p className="font-semibold">{t.whatsapp}</p>
                <p className="text-sm text-muted-foreground">+212 607 076 940</p>
              </div>
            </a>
          </Button>
          <Button asChild variant="outline" className="h-auto w-full justify-start text-left">
            <a href="mailto:support@brand.tld" className="flex items-center p-3">
              <Mail className="me-4 h-5 w-5 flex-shrink-0" />
              <div className="flex-grow">
                <p className="font-semibold">{t.email}</p>
                <p className="text-sm text-muted-foreground">support@brand.tld</p>
              </div>
            </a>
          </Button>
        </div>

        <Separator />

        {/* Address and Hours */}
        <div className="space-y-4 text-sm">
          <div className="flex items-start">
            <MapPin className="me-4 h-5 w-5 flex-shrink-0 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-1">{t.ourAddress}</h3>
              <p className="text-muted-foreground">{t.addressPlaceholder}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="me-4 h-5 w-5 flex-shrink-0 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-1">{t.businessHours}</h3>
              <p className="text-muted-foreground">{t.hoursWeekdays}</p>
              <p className="text-muted-foreground">{t.hoursWeekends}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Socials */}
        <div>
          <h3 className="font-semibold mb-3">{t.socials}</h3>
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline" size="icon">
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="icon">
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.52.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.85-.38-6.73-1.77-1.8-1.32-2.86-3.3-3.02-5.4-.01-.15-.01-.3-.01-.46 0-2.51 0-5.02 0-7.54.02-1.21.32-2.41.87-3.52 1.09-2.24 3.42-3.82 5.92-3.79 2.33.02 4.44.88 5.7 2.65.02.03.04.06.06.09.08-1.3.29-2.59.45-3.88.01-.06.01-.12.02-.18z"></path></svg>
              </a>
            </Button>
            <Button asChild variant="outline" size="icon">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="icon">
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Trust Chips */}
        <div>
          <h3 className="font-semibold mb-3">{t.trust}</h3>
          <div className="flex flex-wrap gap-2">
            <Chip icon={ShieldCheck} text={t.trustChips.cod} />
            <Chip icon={ShieldCheck} text={t.trustChips.madeInMorocco} />
            <Chip icon={ShieldCheck} text={t.trustChips.cleanFormulas} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoPanel;
