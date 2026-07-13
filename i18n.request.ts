import { getRequestConfig } from 'next-intl/server';
import { i18n } from './i18n.config';

type Locale = (typeof i18n.locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // 1. Determine target locale: Fall back to default if the route param is invalid
  const activeLocale = i18n.locales.includes(locale as Locale)
    ? (locale as Locale)
    : i18n.defaultLocale;

  return {
    // 2. Always return the locale key back to next-intl
    locale: activeLocale,
    
    // 3. Import the safe json file matching our active locale
    messages: (await import(`./messages/${activeLocale}.json`)).default,
    timeZone: 'Asia/Kolkata', // IST for India
    now: new Date(),
  };
});