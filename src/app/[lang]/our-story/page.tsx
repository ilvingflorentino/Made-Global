import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, MapPin, BarChartBig } from 'lucide-react';
import Image from 'next/image';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/config/i18n.config';

// ✅ CAMBIO: ahora `params` es una Promesa, como lo requiere Next.js 15+
interface OurStoryPageProps {
  params: Promise<{ lang: Locale }>;
}

const values = [
  { title: "Calidad", description: "Comprometidos con ofrecer solo maderas de la más alta calidad.", icon: BarChartBig },
  { title: "Innovación", description: "Buscando constantemente nuevas formas de mejorar nuestros productos y servicios.", icon: BarChartBig }, 
  { title: "Sostenibilidad", description: "Priorizando prácticas responsables con el medio ambiente.", icon: BarChartBig },
  { title: "Compromiso", description: "Dedicados a la satisfacción de nuestros clientes y al desarrollo de la comunidad.", icon: Users },
];

// ✅ CAMBIO: await al objeto `params`
export default async function OurStoryPage({ params }: OurStoryPageProps) {
  const { lang } = await params;

  const dictionary = await getDictionary(lang);
  const tCommon = dictionary.common;

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{tCommon.ourStory}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Conoce la trayectoria de MADE, desde nuestros humildes comienzos hasta convertirnos en un referente en el sector maderero de República Dominicana.
        </p>
      </header>

      {/* Section: Origen */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Origen: Una Pasión por la Madera</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Fundada en 2009 por Christian Espinal en Santiago, MADE nació de una profunda pasión por la nobleza de la madera y el deseo de proveer materiales de primera para artesanos y constructores. Lo que comenzó como un pequeño emprendimiento familiar, rápidamente se ganó una reputación por su excelente calidad y servicio al cliente.
          </p>
        </div>
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
          <Image src="/images/our-story-origen.svg" alt="Origen de MADE" layout="fill" objectFit="cover" data-ai-hint="company origin" />
        </div>
      </section>

      {/* Section: Crecimiento */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl md:order-last">
          <Image src="/images/our-story-crecimiento.svg" alt="Crecimiento de MADE" layout="fill" objectFit="cover" data-ai-hint="company growth" />
        </div>
        <div>
          <h2 className="text-3xl font-semibold mb-4">Crecimiento y Expansión</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Con el tiempo, la demanda por nuestros productos creció, llevándonos a expandir nuestras operaciones. Decidimos trasladarnos a Santo Domingo para estar más cerca de un mercado más amplio y mejorar nuestra capacidad logística. Esta mudanza marcó un hito importante, permitiéndonos servir a clientes en todo el país con mayor eficiencia.
          </p>
          <p className="mt-4 text-sm text-primary font-medium">Mapa animado de mudanza (Próximamente)</p>
        </div>
      </section>

      {/* Section: Valores */}
      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center">Nuestros Valores Fundamentales</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <Card key={value.title} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-3">
                  <value.icon className="h-6 w-6" />
                </div>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section: Ubicación */}
      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center">Encuéntranos</h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Nuestra Sede Principal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1 shrink-0 text-primary" /> Km. 13 1/2 de la Autopista Duarte, Santo Domingo Oeste.
              </p>
              <p><span className="font-semibold">Teléfono:</span> 809-683-5778</p>
              <p><span className="font-semibold">Email:</span> maderies@gmail.com</p>
              <p><span className="font-semibold">Horario:</span> L-V 8am-5pm, Sáb 8am-12pm</p>
            </CardContent>
          </Card>
          <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.610357458097!2d-69.987486985098!3d18.45611918744669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf8bd5a87a536b%3A0x7261163a4e0a0589!2sMaderas%20y%20Derivados%20Espinal%20Srl!5e0!3m2!1ses!2sdo!4v1628589000000!5m2!1ses!2sdo"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de MADE SRL"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
