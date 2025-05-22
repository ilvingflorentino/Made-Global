import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Correct import for next/font/google
import './globals.css';
// Removed i18nConfig import as generateStaticParams is removed from here

const geistSans = Geist({ // Use Geist directly
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Use Geist_Mono directly
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MADE Global Timber',
  description: 'Premium wood solutions for your projects.',
};

// Removed generateStaticParams from root layout as it's handled in [lang]/layout.tsx
// export async function generateStaticParams() {
//   return i18nConfig.locales.map(locale => ({ lang: locale }));
// }


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
