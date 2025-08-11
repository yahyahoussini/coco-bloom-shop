"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Loader2, Send, Home, Ticket, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";

// Analytics mock
const trackEvent = (eventName: string, params?: object) => {
  console.log(`[Analytics] Event: ${eventName}`, params || "");
};

const phoneRegex = /^(?:\+212|0)([ -]?)\d{9}$/;

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." })
    .max(60, { message: "Full name must not exceed 60 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(phoneRegex, {
    message: "Please enter a valid Moroccan phone number (e.g., 0612345678).",
  }),
  subject: z.string({ required_error: "Please select a subject." }),
  orderCode: z
    .string()
    .regex(/^[a-zA-Z0-9]{6,12}$/, {
      message: "Order code must be 6-12 alphanumeric characters.",
    })
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(20, { message: "Message must be at least 20 characters." })
    .max(2000, { message: "Message must not exceed 2000 characters." }),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy.",
  }),
  marketingOptIn: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      orderCode: "",
      message: "",
      consent: false,
      marketingOptIn: false,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: FormValues) => {
    trackEvent("contact_submit_attempt");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const normalizedPhone = values.phone.startsWith("0")
      ? `+212${values.phone.substring(1)}`
      : values.phone;
    const whatsappMessage = encodeURIComponent(
      `Hello Tussna,\nI need help.\nName: ${values.fullName}\nPhone: ${normalizedPhone.replace(/\s|-/g, "")}\nSubject: ${values.subject}\nOrder code: ${values.orderCode || "N/A"}\nMessage: ${values.message}`
    );
    console.log(
      `WhatsApp Link: https://wa.me/212607076940?text=${whatsappMessage}`
    );

    const newTicketId = `CNT-${format(new Date(), "yyyyMMdd")}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;
    setTicketId(newTicketId);
    setIsSubmitted(true);
    trackEvent("contact_submit_success", { ticketId: newTicketId });
  };

  if (isSubmitted) {
    return (
      <Card className="rounded-card shadow-soft">
        <CardContent className="p-8 text-center">
          <Ticket className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t.formSuccessTitle}</h2>
          <p className="text-muted-foreground mb-4">
            {t.formSuccessMessage}{" "}
            <span className="font-semibold text-foreground">{ticketId}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button
              onClick={() => navigate("/track-order")}
              variant="secondary"
            >
              <Search className="me-2 h-4 w-4" />
              {t.trackOrder}
            </Button>
            <Button onClick={() => navigate("/")}>
              <Home className="me-2 h-4 w-4" />
              {t.backToHome}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-card shadow-soft">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t.contactUs}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.fullName}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.fullNamePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.emailAddress}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.emailPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.phone}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.phonePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.subject}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="order_issue">
                          {t.subjectOptions.orderIssue}
                        </SelectItem>
                        <SelectItem value="product_question">
                          {t.subjectOptions.productQuestion}
                        </SelectItem>
                        <SelectItem value="wholesale">
                          {t.subjectOptions.wholesale}
                        </SelectItem>
                        <SelectItem value="other">{t.subjectOptions.other}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orderCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t.orderCode}{" "}
                      <span className="text-muted-foreground">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ORD12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.message}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t.messagePlaceholder}
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t.consent}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketingOptIn"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t.marketingOptIn}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="me-2 h-4 w-4" />
              )}
              {isSubmitting ? "Sending..." : t.submit}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
