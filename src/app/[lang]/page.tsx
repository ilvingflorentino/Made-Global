import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/config/i18n.config'

interface HomePageProps {
  params: { lang: Locale }
}

// Placeholder components to be refined or moved later
const VideoBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
    <Image
      src="https://placehold.co/1920x1080/3D7748/F0F4F1?text=MADE+Timber" // Placeholder image
      alt="Abstract wood texture"
      layout="fill"
      objectFit="cover"
      priority
      data-ai-hint="wood texture"
    />
    <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
      {children}
    </div>
  </div>
);

const AnimatedTitle = ({ text, subtext }: { text: string, subtext: string }) => (
  <>
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in drop-shadow-lg typewriter-text">
      {text}
    </h1>
    <p className="text-lg sm:text-xl md:text-2xl mb-8 animate-fade-in animation-delay-500 drop-shadow-md">
      {subtext}
    </p>
  </>
);


const CertificationCard = ({ title, description }: { title: string, description: string }) => (
  <Card className="certification-card bg-card shadow-xl hover:shadow-2xl transition-all duration-300">
    <CardHeader className="items-center text-center">
      <CheckCircle className="w-12 h-12 text-primary mb-2" />
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-center">{description}</CardDescription>
    </CardContent>
  </Card>
);

const ProductCard = ({ name, price, imageUrl, lang }: { name: string, price: string, imageUrl: string, lang: Locale }) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
    <div className="relative aspect-[4/3] overflow-hidden">
      <Image src={imageUrl} alt={name} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" data-ai-hint="wood product"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
         <Button asChild variant="secondary" className="mb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Link href={`/${lang}/product/sample-sku`}>Ver más <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
      </div>
    </div>
    <CardContent className="p-4">
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <p className="text-primary font-medium">{price}</p>
    </CardContent>
  </Card>
);


export default async function HomePage({ params: { lang } }: HomePageProps) {
  const dictionary = await getDictionary(lang);
  const tHome = dictionary.homePage;
  const tCommon = dictionary.common;

  const certifications = [
    { title: "ISO 9001", description: "Quality Management Certified" },
    { title: "FSC Certified", description: "Sustainably Sourced Wood" },
    { title: "Local Expertise", description: "Trusted by Dominican Artisans" },
  ];

  const featuredProducts = [
    { name: "Roble Americano", price: "Desde RD$2,500", imageUrl: "https://placehold.co/600x400/936d48/FFFFFF?text=Roble", dataAiHint: "oak wood" },
    { name: "Caoba Dominicana", price: "Desde RD$3,200", imageUrl: "https://placehold.co/600x400/745437/FFFFFF?text=Caoba", dataAiHint: "mahogany wood" },
    { name: "Pino Tratado", price: "Desde RD$1,800", imageUrl: "https://placehold.co/600x400/673f1c/FFFFFF?text=Pino", dataAiHint: "pine wood" },
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <VideoBackground>
        <AnimatedTitle text={tHome.heroTitle} subtext={tHome.heroSubtitle} />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="primary" asChild className="hover:scale-105 transform transition-transform duration-300 shadow-md hover:shadow-lg">
            <Link href={`/${lang}/catalog`}>{tCommon.exploreCatalog}</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild className="hover:scale-105 transform transition-transform duration-300 shadow-md hover:shadow-lg">
            <Link href={`/${lang}/virtual-tour`}>{tCommon.liveVirtualTour}</Link>
          </Button>
        </div>
      </VideoBackground>

      {/* Certifications Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">{tCommon.certifications}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {certifications.map(cert => (
            <CertificationCard key={cert.title} title={cert.title} description={cert.description} />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">{tCommon.featuredProducts}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {featuredProducts.map(product => (
            <ProductCard key={product.name} name={product.name} price={product.price} imageUrl={product.imageUrl} lang={lang} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Button variant="outline" asChild size="lg">
            <Link href={`/${lang}/catalog`}>{tCommon.exploreCatalog} <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
