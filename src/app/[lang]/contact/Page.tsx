import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/config/i18n.config';
import ContactFormClient from './[articleld]/Page';

interface ContactPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <ContactFormClient lang={lang} dictionary={dictionary} />;
}
