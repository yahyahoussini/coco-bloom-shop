"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/context/LanguageContext';
import { Search } from 'lucide-react';

// Analytics mock
const trackEvent = (eventName: string, params?: object) => {
  console.log(`[Analytics] Event: ${eventName}`, params || "");
};

const formSchema = z.object({
  orderCode: z.string().nonempty({ message: 'Order code is required.' }),
  phone: z.string().nonempty({ message: 'Phone number is required.' }),
});

type FormValues = z.infer<typeof formSchema>;

const OrderHelpCard = () => {
  const navigate = useNavigate();
  const t = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { orderCode: '', phone: '' },
  });

  const onSubmit = (values: FormValues) => {
    trackEvent("track_order_click", {
      orderCode: values.orderCode,
      phone: values.phone
    });
    const params = new URLSearchParams({
      code: values.orderCode,
      phone: values.phone,
    });
    navigate(`/track-order?${params.toString()}`);
  };

  return (
    <Card className="rounded-card shadow-soft">
      <CardHeader>
        <CardTitle>{t.orderHelpTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="orderCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.orderCode}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ORD12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.phone}</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number on the order" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <Search className="me-2 h-4 w-4" />
              {t.trackYourOrder}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default OrderHelpCard;
