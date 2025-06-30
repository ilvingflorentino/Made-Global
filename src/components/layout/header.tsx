
import Link from 'next/link'
import Image from 'next/image' // Import next/image
import { Facebook, Instagram, Linkedin, Languages, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import type { Locale } from '@/config/i18n.config'
import type { Dictionary } from '@/lib/dictionaries'

interface HeaderProps {
  lang: Locale;
  dictionary: Dictionary['common'];
}

// Simplified LanguageSwitcher for server component context
const LanguageSwitcherServer = ({ lang, dictionary }: { lang: Locale, dictionary: Dictionary['common'] }) => {
  const otherLocales = (['en', 'es'] as Locale[]).filter(l => l !== lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={dictionary.selectLanguage}>
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/${lang}`} className={lang === lang ? 'font-bold' : ''}>
            {lang.toUpperCase()}
          </Link>
        </DropdownMenuItem>
        {otherLocales.map(locale => (
          <DropdownMenuItem key={locale} asChild>
            <Link href={`/${locale}`}>
              {locale.toUpperCase()}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export function Header({ lang, dictionary }: HeaderProps) {
  const navLinks = [
    { href: `/${lang}/catalog`, label: dictionary.catalog },
    { href: `/${lang}/virtual-tour`, label: dictionary.virtualTour },
    { href: `/${lang}/budget`, label: dictionary.budget },
    { href: `/${lang}/blog`, label: dictionary.blog }, // Placeholder
    { href: `/${lang}/our-story`, label: dictionary.ourStory }, // Placeholder
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href={`/${lang}`} className="mr-6 flex items-center space-x-2">
          <Image
            src="https://placehold.co/150x50.png" 
            alt={dictionary.appName + " Logo"}
            width={150} 
            height={50} 
            priority
            data-ai-hint="company logo"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map(link => (
            <Link key={link.label} href={link.href} className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild aria-label="Facebook">
              <Link href="https://www.facebook.com/madespinalrd" target="_blank" rel="noopener noreferrer"><Facebook className="h-5 w-5" /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="Instagram">
              <Link href="https://www.instagram.com/madespinalrd" target="_blank" rel="noopener noreferrer"><Instagram className="h-5 w-5" /></Link>
            </Button>
            {/* <Button variant="ghost" size="icon" asChild aria-label="LinkedIn">
              <Link href="#" target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5" /></Link>
            </Button> */}
          </div>
          <LanguageSwitcherServer lang={lang} dictionary={dictionary} />
          
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={dictionary.toggleNavigation}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map(link => (
                  <Link key={link.label} href={link.href} className="text-lg font-medium hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
                 <div className="mt-4 flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild aria-label="Facebook">
                      <Link href="https://www.facebook.com/madespinalrd" target="_blank" rel="noopener noreferrer"><Facebook className="h-5 w-5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild aria-label="Instagram">
                      <Link href="https://www.instagram.com/madespinalrd" target="_blank" rel="noopener noreferrer"><Instagram className="h-5 w-5" /></Link>
                    </Button>
                  </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
