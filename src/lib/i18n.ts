export const locales = ["en", "fr", "ar"];
export const defaultLocale = "en";

// Using a simple object for translations. In a larger app, a dedicated i18n library would be used.
export const translations = {
  en: {
    // General
    submit: "Submit",
    backToHome: "Back to Home",
    trackOrder: "Track Order",
    orderCode: "Order Code",
    phone: "Phone",

    // Contact Page Hero
    contactUs: "Contact Us",
    repliesIn24h: "Replies in < 24h",
    whatsapp: "WhatsApp",
    email: "Email",

    // Contact Form
    fullName: "Full Name",
    fullNamePlaceholder: "e.g., Fatima Zahra",
    emailAddress: "Email Address",
    emailPlaceholder: "e.g., f.zahra@email.com",
    phonePlaceholder: "e.g., 06 12 34 56 78",
    subject: "Subject",
    message: "Message",
    messagePlaceholder: "Please describe your issue in detail...",
    consent: "I agree to the privacy policy",
    marketingOptIn: "I want to receive news and offers",
    subjectOptions: {
      orderIssue: "Order Issue",
      productQuestion: "Product Question",
      wholesale: "Wholesale",
      other: "Other",
    },
    formSuccessTitle: "Thank You!",
    formSuccessMessage: "Your message has been sent. We will get back to you shortly. Your ticket ID is:",

    // Info Panel
    supportChannels: "Support Channels",
    ourAddress: "Our Address",
    businessHours: "Business Hours",
    socials: "Follow Us",
    trust: "Our Promises",
    addressPlaceholder: "123 Tussna Cosmetics, Main Street, Casablanca, Morocco",
    hoursWeekdays: "Mon-Fri: 09:00 - 18:00",
    hoursWeekends: "Sat: 09:00 - 14:00",
    trustChips: {
      cod: "COD 48-72h",
      madeInMorocco: "Made in Morocco",
      cleanFormulas: "Clean Formulas",
    },

    // Order Help
    orderHelpTitle: "Need help with your order?",
    trackYourOrder: "Track your order",

    // FAQ
    faqTitle: "Frequently Asked Questions",
    faqItems: {
      shipping: {
        q: "What are the shipping times?",
        a: "Orders are typically delivered within 48-72 hours nationwide.",
      },
      cod: {
        q: "How does Cash on Delivery (COD) work?",
        a: "You pay the courier in cash when your order is delivered. Please have the exact amount ready.",
      },
      returns: {
        q: "What is your return policy?",
        a: "We accept returns for unopened products within 7 days of delivery. Please contact support to initiate a return.",
      },
      allergens: {
        q: "Are your products suitable for sensitive skin?",
        a: "Our products are made with natural, clean ingredients. However, we recommend checking the ingredient list for any potential allergens.",
      },
      responseTime: {
        q: "How long does it take for support to reply?",
        a: "Our team typically replies to all inquiries within 24 hours on business days.",
      },
    },
  },
  fr: {
    // French translations will be added here
  },
  ar: {
    // Arabic translations will be added here
  },
};
