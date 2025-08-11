import { useLocaleStore } from '@/state/locale';
import { messages } from '@/i18n/messages';

export const useTranslation = () => {
  const { locale } = useLocaleStore();
  const t = messages[locale].about;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return { t, locale, dir };
};
