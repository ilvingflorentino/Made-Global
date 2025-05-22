import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin, Clock } from 'lucide-react'
import type { Locale } from '@/config/i18n.config'
import type { Dictionary } from '@/lib/dictionaries'

interface FooterProps {
  lang: Locale;
  dictionary: Dictionary['common'];
}

export function Footer({ lang, dictionary }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const contactInfo = {
    address: "Km. 13 1/2 de la Autopista Duarte",
    phone: "809-683-5778",
    whatsapp: "1-829-603-3058",
    email: "maderies@gmail.com",
    hours: [
      { days: `${dictionary.monFri}:`, time: "8:00 AM - 5:00 PM" },
      { days: `${dictionary.saturday}:`, time: "8:00 AM - 12:00 PM" },
    ],
    social: [
      { name: "Facebook", Icon: Facebook, href: "https://www.facebook.com/madespinalrd" },
      { name: "Instagram", Icon: Instagram, href: "https://www.instagram.com/madespinalrd" },
      // { name: "LinkedIn", Icon: Linkedin, href: "#" }, // Placeholder LinkedIn
    ]
  }

  const footerLinks = [
    {
      title: dictionary.appName,
      links: [
        { label: dictionary.ourStory, href: `/${lang}/our-story` },
        { label: dictionary.blog, href: `/${lang}/blog` },
        { label: dictionary.virtualTour, href: `/${lang}/virtual-tour` },
      ]
    },
    {
      title: dictionary.catalog,
      links: [
        { label: dictionary.exploreCatalog, href: `/${lang}/catalog` },
        { label: dictionary.budget, href: `/${lang}/budget` },
      ]
    },
    {
      title: dictionary.contact,
      isContact: true,
    }
  ];


  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href={`/${lang}`} className="text-2xl font-bold text-primary">
              {dictionary.logoText}
            </Link>
            <p className="mt-4 text-sm">
              {/* Short company description - can be translated */}
              Providing premium quality wood and derivatives since 2009.
            </p>
          </div>
          
          {/* Navigation Links */}
          {footerLinks.filter(group => !group.isContact).map(group => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold tracking-wider uppercase">{group.title}</h3>
              <ul role="list" className="mt-4 space-y-2">
                {group.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">{dictionary.contact}</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 shrink-0" /> {contactInfo.address}
              </p>
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-2 shrink-0" /> {contactInfo.phone}
              </p>
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-2 shrink-0" /> {contactInfo.email}
              </p>
              <p className="flex items-center font-semibold mt-2">
                 WhatsApp: {contactInfo.whatsapp}
              </p>
            </div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mt-6">{dictionary.hours}</h3>
             <div className="mt-2 space-y-1 text-sm">
                {contactInfo.hours.map(hour => (
                  <p key={hour.days}><span className="font-medium">{hour.days}</span> {hour.time}</p>
                ))}
             </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {currentYear} {dictionary.appName}. {dictionary.allRightsReserved}.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {contactInfo.social.map(socialLink => (
              <Link key={socialLink.name} href={socialLink.href} target="_blank" rel="noopener noreferrer" aria-label={socialLink.name} className="hover:text-primary transition-colors">
                <socialLink.Icon className="h-6 w-6" />
              </Link>
            ))}
          </div>
           <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href={`/${lang}/privacy-policy`} className="hover:text-primary transition-colors">{dictionary.privacyPolicy}</Link>
            <Link href={`/${lang}/terms-of-service`} className="hover:text-primary transition-colors">{dictionary.termsOfService}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
