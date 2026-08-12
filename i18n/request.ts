import { getRequestConfig } from 'next-intl/server';

// Persian is the primary locale. Arabic and English are additive.
export const locales = ['fa', 'ar', 'en'] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = 'fa';

// RTL locales (used to set the document `dir` attribute)
export const rtlLocales = ['fa', 'ar'] as const

function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Without middleware / [locale] segments, requestLocale can be undefined
  // during Vercel static generation. Always fall back instead of notFound().
  const requested = await requestLocale;
  const locale = requested && isAppLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
