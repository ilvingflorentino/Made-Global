import Link from 'next/link'
import { Home, Search, Calendar, Film, Menu } from 'lucide-react'
import type { Locale } from '@/config/i18n.config'
import type { Dictionary } from '@/lib/dictionaries'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface MobileDockMenuProps {
  lang: Locale;
  dictionary: Dictionary['common'];
}

export function MobileDockMenu({ lang, dictionary }: MobileDockMenuProps) {
  const mainNavItems = [
    { href: `/${lang}`, icon: Home, label: dictionary.home },
    { href: `/${lang}/catalog`, icon: Search, label: dictionary.catalog },
    { href: `/${lang}/budget`, icon: Calendar, label: dictionary.budget },
    { href: `/${lang}/virtual-tour`, icon: Film, label: dictionary.virtualTour },
  ];

  const moreNavItems = [
     { href: `/${lang}/blog`, label: dictionary.blog },
     { href: `/${lang}/our-story`, label: dictionary.ourStory },
     { href: `/${lang}/history`, label: dictionary.history },
     { href: `/${lang}/contact`, label: dictionary.contact }, // Placeholder for contact page
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-t-lg z-40">
      <div className="flex justify-around items-center h-16">
        {mainNavItems.map((item) => (
          <Link key={item.label} href={item.href} className="flex flex-col items-center justify-center text-xs text-muted-foreground hover:text-primary transition-colors p-2">
            <item.icon className="h-6 w-6 mb-0.5" />
            <span>{item.label}</span>
          </Link>
        ))}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex flex-col items-center justify-center text-xs text-muted-foreground hover:text-primary transition-colors p-2 h-full">
              <Menu className="h-6 w-6 mb-0.5" />
              <span>{dictionary.more}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader>
              <SheetTitle>{dictionary.more}</SheetTitle>
            </SheetHeader>
            <div className="grid gap-3 py-4">
              {moreNavItems.map(item => (
                 <Link key={item.label} href={item.href} className="text-md font-medium p-2 rounded-md hover:bg-muted transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
