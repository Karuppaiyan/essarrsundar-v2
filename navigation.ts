import {createNavigation} from 'next-intl/navigation';
export const locales = ["en", "ta"] as const;
// export const localePrefix = "always";
export const localePrefix = "as-needed";

export const {Link, usePathname, useRouter} = createNavigation(locales, localePrefix);