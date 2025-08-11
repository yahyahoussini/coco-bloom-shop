import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/context/LanguageContext';
import { MapPin } from 'lucide-react';

const MapCard = () => {
  const t = useTranslation();

  return (
    <Card className="rounded-card shadow-soft overflow-hidden">
      <div className="bg-secondary h-64 md:h-80 flex items-center justify-center">
        <p className="text-muted-foreground font-semibold">Map Placeholder</p>
      </div>
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center text-lg font-semibold">
          <MapPin className="me-2 h-5 w-5 text-primary" />
          <span>{t.ourAddress}</span>
        </div>
        <p className="text-muted-foreground mt-1">{t.addressPlaceholder}</p>
      </CardContent>
    </Card>
  );
};

export default MapCard;
