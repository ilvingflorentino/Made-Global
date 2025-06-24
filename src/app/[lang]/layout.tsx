
import type { ReactNode } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import type { Locale } from '@/config/i18n.config';
import { i18nConfig } from '@/config/i18n.config';

interface LocaleLayoutProps {
  children: ReactNode;
  params: { lang: Locale };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { lang } = params;
  return (
    <MainLayout lang={lang}>
      {children}
    </MainLayout>
  );
}

// Re-export metadata or define new metadata for localized routes if needed
export const metadata = {
  title: 'MADE Global Timber',
  description: 'Premium wood solutions for your projects.',
};
