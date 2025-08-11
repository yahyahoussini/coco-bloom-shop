import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/context/LanguageContext';
import { Phone, Mail } from 'lucide-react';

const ContactHero = () => {
  const t = useTranslation();

  return (
    <div className="bg-chip py-12 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center rounded-full bg-background/60 text-secondary-foreground px-4 py-1 mb-4 border border-divider">
          <span className="text-sm font-medium">{t.repliesIn24h}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-6">
          {t.contactUs}
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
          Have a question or need help with an order? We're here for you. Reach out via WhatsApp for a quick chat or send us an email.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <a href="https://wa.me/212607076940?text=Hello%20Tussna" target="_blank" rel="noopener noreferrer">
              <Phone className="me-2 h-5 w-5" />
              {t.whatsapp}
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a href="mailto:support@brand.tld">
              <Mail className="me-2 h-5 w-5" />
              {t.email}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactHero;
