import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/context/LanguageContext';

const MiniFAQ = () => {
  const t = useTranslation();

  return (
    <Card className="rounded-card shadow-soft">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold">{t.faqTitle}</CardTitle>
      </CardHeader>
      <CardContent className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(t.faqItems).map(([key, item]) => (
            <AccordionItem value={key} key={key}>
              <AccordionTrigger className="text-left font-semibold text-start">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default MiniFAQ;
