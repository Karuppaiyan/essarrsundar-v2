"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { i18n } from '@/i18n.config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.slice(locale.length + 1);
    
    // Navigate to new locale
    router.push(`/${newLocale}${pathWithoutLocale || '/'}`);
    
    // Store preference in localStorage
    localStorage.setItem('preferredLocale', newLocale);
  };

  return (
    <div className="language-switcher">
      {i18n.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLanguageChange(loc)}
          className={`lang-btn ${locale === loc ? 'active' : ''}`}
          aria-label={`Switch to ${loc}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}