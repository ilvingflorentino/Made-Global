
"use client";

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/config/i18n.config';
import { Skeleton } from '@/components/ui/skeleton';

interface CatalogPageProps {
  params: Promise<{ lang: Locale }>
}

// Reusable ProductCard, simplified to show a single price
const ProductCard = ({ id, name, price, imageUrl, lang, dictionary, dataAiHint }: { id: string, name: string, price: string, imageUrl: string, lang: Locale, dictionary: any, dataAiHint: string }) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
    <Link href={`/${lang}/product/${id}`} className="block" aria-label={`${dictionary.viewMore} ${name}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-300" 
          data-ai-hint={dataAiHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
           <Button variant="secondary" className="mb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              {dictionary.viewMore} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-primary font-medium">{price}</p>
      </CardContent>
    </Link>
  </Card>
);


export default function CatalogPage(props: CatalogPageProps) {
  const resolvedParams = use(props.params);
  const { lang } = resolvedParams;

  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  useEffect(() => {
    const fetchDictionary = async () => {
      setIsLoading(true);
      try {
        const dict = await getDictionary(lang);
        setDictionary(dict);
      } catch (error) {
        console.error("Error fetching dictionary:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDictionary();
  }, [lang]);

  // Updated product list based on the user's price list
  const productDetails = [
    { id: 'caoba-andina', name: "Caoba Andina", price: "Desde RD$2,800", imageUrl: "/images/caoba-andina.png", dataAiHint: "andina mahogany" },
    { id: 'caoba-sudamericana', name: "Caoba Sudamericana", price: "Desde RD$3,500", imageUrl: "/images/caoba-sudamericana.png", dataAiHint: "south american mahogany" },
    { id: 'roble-congona', name: "Roble Congona", price: "Desde RD$2,500", imageUrl: "/images/roble-congona.png", dataAiHint: "congona oak" },
    { id: 'cedro-macho', name: "Cedro Macho", price: "Desde RD$1,950", imageUrl: "/images/cedro-macho.png", dataAiHint: "male cedar" },
    { id: 'jequitiba', name: "Jequitiba", price: "Desde RD$3,500", imageUrl: "/images/jequitiba.png", dataAiHint: "jequitiba wood" },
    { id: 'roble-cerejeira', name: "Roble Cerejeira", price: "Desde RD$2,750", imageUrl: "/images/roble-cerejeira.png", dataAiHint: "cerejeira oak" },
    { id: 'poplar-alamo', name: "Poplar/Alamo", price: "Desde RD$2,200", imageUrl: "/images/poplar-alamo.png", dataAiHint: "poplar wood" },
    { id: 'mdf-3mm', name: "MDF 3mm", price: "RD$400", imageUrl: "/images/mdf.png", dataAiHint: "mdf board" },
    { id: 'mdf-5mm', name: "MDF 5mm", price: "RD$550", imageUrl: "/images/mdf.png", dataAiHint: "mdf board" },
    { id: 'mdf-9mm', name: "MDF 9mm", price: "RD$900", imageUrl: "/images/mdf.png", dataAiHint: "mdf board" },
    { id: 'mdf-12mm', name: "MDF 12mm", price: "RD$1,100", imageUrl: "/images/mdf.png", dataAiHint: "mdf board" },
    { id: 'mdf-15mm', name: "MDF 15mm", price: "RD$1,300", imageUrl: "/images/mdf.png", dataAiHint: "mdf board" },
    { id: 'mdf-18mm', name: "MDF 18mm", price: "RD$1,550", imageUrl: "/images/mdf.png", dataAiHint: "mdf board" },
    { id: 'mdf-hidrofugo-15mm', name: "MDF Hidrofugo 15mm", price: "RD$1,700", imageUrl: "/images/mdf-hidrofugo.png", dataAiHint: "waterproof mdf" },
    { id: 'mdf-hidrofugo-18mm', name: "MDF Hidrofugo 18mm", price: "RD$1,950", imageUrl: "/images/mdf-hidrofugo.png", dataAiHint: "waterproof mdf" },
    { id: 'melamina-blanca', name: "Melamina Blanca", price: "Desde RD$2,200", imageUrl: "/images/melamina-blanca.png", dataAiHint: "white melamine" },
    { id: 'pino-americano', name: "Pino Americano", price: "Desde RD$2,500", imageUrl: "/images/pino-americano.png", dataAiHint: "american pine" },
    { id: 'pino-caribe', name: "Pino Caribe", price: "Desde RD$1,750", imageUrl: "/images/pino-caribe.png", dataAiHint: "caribbean pine" },
    { id: 'playwood', name: "Playwood", price: "Desde RD$1,200", imageUrl: "/images/playwood.png", dataAiHint: "plywood sheet" },
    { id: 'canto-blanco-mt-1mm', name: "Canto Blanco MT 1mm", price: "RD$25", imageUrl: "/images/canto-blanco.png", dataAiHint: "white edge banding" },
  ];
  
  const categories = ["Maderas Duras", "Maderas Blandas", "Tableros", "Exóticas", "Melaminas", "Contrachapados", "Accesorios"];
  
  if (isLoading || !dictionary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Skeleton className="h-10 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </header>
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const t = dictionary.catalogPage;
  const tCommon = dictionary.common;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{tCommon.catalog}</h1>
        <p className="text-muted-foreground mt-2">Explora nuestra amplia selección de maderas de alta calidad.</p>
      </header>

      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-20 left-6 md:bottom-6 md:left-6 rounded-full shadow-lg p-4 h-16 w-16 z-30 bg-[hsl(var(--primary)/0.4)] text-primary-foreground hover:bg-[hsl(var(--primary)/0.5)]"
            aria-label={t.filters}
          >
            <Filter className="h-7 w-7" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-sm sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center"><Filter className="mr-2 h-5 w-5 text-primary"/> {t.filters}</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 p-1">
            <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
              <AccordionItem value="category">
                <AccordionTrigger className="text-base">{t.category}</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={`cat-sheet-${category}`} />
                      <Label htmlFor={`cat-sheet-${category}`} className="font-normal">{category}</Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger className="text-base">{t.priceRange}</AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Slider defaultValue={[2500]} max={10000} step={100} />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>RD$0</span>
                    <span>RD$10,000+</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="dimensions">
                <AccordionTrigger className="text-base">{t.dimensions}</AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div>
                    <Label htmlFor="length-sheet">Largo (cm)</Label>
                    <Input id="length-sheet" type="number" placeholder="Ej: 240" />
                  </div>
                  <div>
                    <Label htmlFor="width-sheet">Ancho (cm)</Label>
                    <Input id="width-sheet" type="number" placeholder="Ej: 120" />
                  </div>
                   <div>
                    <Label htmlFor="thickness-sheet">Grosor (mm)</Label>
                    <Input id="thickness-sheet" type="number" placeholder="Ej: 18" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button className="w-full mt-6" onClick={() => setIsFilterSheetOpen(false)}>Aplicar Filtros</Button>
          </div>
        </SheetContent>
      </Sheet>

      <main className="w-full">
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productDetails.map(product => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              lang={lang}
              dictionary={tCommon}
              dataAiHint={product.dataAiHint}
            />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button variant="outline">Cargar más productos</Button>
        </div>
      </main>
    </div>
  );
}
