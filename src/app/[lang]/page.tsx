import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/config/i18n.config';

interface VideoBackgroundProps {
  children: React.ReactNode;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  altText?: string;
  dataAiHint?: string;
}

const VideoBackground = ({ children, mediaUrl, mediaType, altText = "Hero background", dataAiHint }: VideoBackgroundProps) => (
  <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
    {mediaType === 'image' && (
      <Image
        src={mediaUrl}
        alt={altText}
        fill
        className="object-cover"
        priority
        data-ai-hint={dataAiHint || "hero background"}
      />
    )}
    {mediaType === 'video' && (
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={mediaUrl}
      >
        Tu navegador no soporta la etiqueta de video.
      </video>
    )}
    <div className="absolute inset-0 bg-black/30" />
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
      {children}
    </div>
  </div>
);

const AnimatedTitle = ({ text, subtext }: { text: string; subtext: string }) => (
  <>
    <div className="marquee-wrapper w-full">
      <h1 className="marquee-text text-4xl sm:text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
        <span>{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </h1>
    </div>
    <p className="text-lg sm:text-xl md:text-2xl mb-8 animate-fade-in animation-delay-500 drop-shadow-md">
      {subtext}
    </p>
  </>
);

const CertificationCard = ({ title, description }: { title: string; description: string }) => (
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

const ProductCard = ({
  id,
  name,
  price,
  imageUrl,
  lang,
  dataAiHint,
}: {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  lang: Locale;
  dataAiHint: string;
}) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
    <div className="relative aspect-[4/3] overflow-hidden">
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        data-ai-hint={dataAiHint}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
        <Button
          asChild
          variant="secondary"
          className="mb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
        >
          <Link href={`/${lang}/product/${id}`}>
            Ver más <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
    <CardContent className="p-4">
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <p className="text-primary font-medium">{price}</p>
    </CardContent>
  </Card>
);

interface HomePageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const tHome = dictionary.homePage;
  const tCommon = dictionary.common;

  const certifications = [
    { title: "ISO 9001", description: "Quality Management Certified" },
    { title: "FSC Certified", description: "Sustainably Sourced Wood" },
    { title: "Local Expertise", description: "Trusted by Dominican Artisans" },
  ];

  const featuredProducts = [
    { id: "encino", name: "Encino", price: "Desde RD$2,750", imageUrl: "/images/encino.svg", dataAiHint: "oak wood" },
    { id: "fresno", name: "Fresno", price: "Desde RD$3,100", imageUrl: "/images/fresno.svg", dataAiHint: "ash wood" },
    { id: "nogal-americano", name: "Nogal Americano", price: "Desde RD$4,500", imageUrl: "/images/nogal-americano.svg", dataAiHint: "american walnut" },
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      <VideoBackground
        mediaType="video"
        mediaUrl="/videos/hero-background.mp4"
      >
        <AnimatedTitle text={tHome.heroTitle} subtext={tHome.heroSubtitle} />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="default" asChild className="hover:scale-105 transform transition-transform duration-300 shadow-md hover:shadow-lg">
            <Link href={`/${lang}/catalog`}>{tCommon.exploreCatalog}</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild className="hover:scale-105 transform transition-transform duration-300 shadow-md hover:shadow-lg">
            <Link href={`/${lang}/virtual-tour`}>{tCommon.liveVirtualTour}</Link>
          </Button>
        </div>
      </VideoBackground>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">{tCommon.certifications}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {certifications.map((cert) => (
            <CertificationCard key={cert.title} title={cert.title} description={cert.description} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">{tCommon.featuredProducts}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              lang={lang}
              dataAiHint={product.dataAiHint}
            />
          ))}
        </div>
        <div className="text-center mt-10">
          <Button variant="outline" asChild size="lg">
            <Link href={`/${lang}/catalog`}>
              {tCommon.exploreCatalog} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
