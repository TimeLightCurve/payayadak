import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Persian is the primary locale. Arabic and English are additive.
export const locales = ['fa', 'ar', 'en'] as const;
export const defaultLocale = 'fa' as const;

// RTL locales (used to set the document `dir` attribute)
export const rtlLocales = ['fa', 'ar'] as const;

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as (typeof locales)[number])) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
