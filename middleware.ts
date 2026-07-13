// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { i18n } from './i18n.config';

export default createMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  localePrefix: 'as-needed',
  localeCookie: { name: 'NEXT_LOCALE' },
});

export const config = {
  matcher: [
    '/',
    '/(en|ta)/:path*',
    '/((?!_next|_vercel|.*\\..*|api).*)',
  ],
};