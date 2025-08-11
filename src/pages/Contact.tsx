import React from 'react';
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import InfoPanel from '@/components/contact/InfoPanel';
import OrderHelpCard from '@/components/contact/OrderHelpCard';
import MapCard from '@/components/contact/MapCard';
import MiniFAQ from '@/components/contact/MiniFAQ';

const ContactPage = () => {
  return (
    <div className="bg-background text-foreground">
      <ContactHero />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
          <div className="space-y-8">
            <InfoPanel />
            <OrderHelpCard />
          </div>
        </div>
        <div className="mt-12 md:mt-16">
          <MapCard />
        </div>
        <div className="mt-12 md:mt-16">
          <MiniFAQ />
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
