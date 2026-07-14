// app/[locale]/page.tsx
import type { NextPage } from 'next';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { i18n } from "@/i18n.config";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import {Link, usePathname, useRouter} from "@/navigation";

// Import your custom main sections (Header & Footer removed here since they are in layout.tsx)
import {
  PhilosophySection,
  StatsSection,
  SkillsSection,
  ContactSection,
  HeroCarousel,
} from '@/components';
import Testimonials from "@/components/Testimonial";
import RentalInventory from "@/components/RentalInventory";
import HeroImage from "@/components/HeroImage";
import BackToTop from "@/components/BackToTop";
import AboutUs from "@/components/AboutUs";

// Configure Amplify on the server side
Amplify.configure(outputs);

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

interface Props {
  params: { locale: string };
}

const Home: NextPage<Props> = async () => {
  // Fetch messages safely on the server side
  const messages = await getMessages();
  return (

    
    <NextIntlClientProvider messages={messages}>
      <BackToTop threshold={300} />
      <HeroCarousel />
      <AboutUs />
      <HeroImage/>
      <RentalInventory />
      <ContactSection />      
    </NextIntlClientProvider>
  );
};

export default Home;