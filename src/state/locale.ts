import { create } from 'zustand';

type Locale = 'en' | 'fr' | 'ar';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'en', // Default language
  setLocale: (locale) => set({ locale }),
}));
