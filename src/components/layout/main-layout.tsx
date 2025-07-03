import type { ReactNode } from 'react'
import { Header } from './header'
import { Footer } from './footer'
import { MobileDockMenu } from './mobile-dock-menu'
import type { Locale } from '@/config/i18n.config'
import { getDictionary, Dictionary } from '@/lib/dictionaries'
import { Toaster } from "@/components/ui/toaster"
import { ChatbotLauncher } from '@/components/chatbot/chatbot-launcher'
import { QuoteProvider } from '@/context/QuoteContext' 

interface MainLayoutProps {
  children: ReactNode;
  lang: Locale;
}

export async function MainLayout({ children, lang }: MainLayoutProps) {
  const dictionary = await getDictionary(lang);
  
  return (
    // QuoteProvider debe envolver un ÚNICO elemento hijo.
    // En este caso, todo el contenido visual de la página (Header, main, Footer, etc.)
    // está dentro de un solo <div>, y ese <div> es el único hijo de QuoteProvider.
    <QuoteProvider>
      <div className="flex flex-col min-h-screen">
        <Header lang={lang} dictionary={dictionary.common} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <ChatbotLauncher dictionary={dictionary.common}/>
        <Footer lang={lang} dictionary={dictionary.common} />
        <MobileDockMenu lang={lang} dictionary={dictionary.common}/>
        <Toaster />
      </div>
    </QuoteProvider>
  )
}
