// app/[locale]/layout.tsx
import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { i18n, type Locale } from '@/i18n.config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// TypeScript may complain about side-effect CSS imports in some setups.
// Suppress the error here since Next.js supports global CSS imports in the app directory.
// @ts-ignore
import "./globals.css";
// @ts-ignore
import './carousel.css';
// @ts-ignore
import './language-switcher.css';


export const metadata: Metadata = {
  title: 'ESS ARR Enterprises - LED Screen Rental',
  description: 'Leading LED Screen and Wall Rental Provider in India',
};

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

interface Props {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: Props) {
  // Get messages for the current locale
  // The middleware ensures the locale is valid, so we don't need to check here
  let messages;
  
  try {
    messages = await getMessages({ locale: locale as Locale });
  } catch {
    // Fallback to default locale if messages don't load
    messages = await getMessages({ locale: i18n.defaultLocale });
  }

  return (
    <html lang={locale} dir={locale === 'ta' ? 'ltr' : 'ltr'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
