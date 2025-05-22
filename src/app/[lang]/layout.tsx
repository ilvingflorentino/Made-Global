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

export default function LocaleLayout({
  children,
  params: { lang },
}: LocaleLayoutProps) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        <MainLayout lang={lang}>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}

// Re-export metadata or define new metadata for localized routes if needed
export const metadata = {
  title: 'MADE Global Timber',
  description: 'Premium wood solutions for your projects.',
};
