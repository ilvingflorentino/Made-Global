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

// Reusable ProductCard component to display product details in the catalog.
// It dynamically shows either a single price or 'Largo' and 'Corto' prices.
const ProductCard = ({ 
  id, 
  name, 
  price, 
  priceLargo, 
  priceCorto, 
  imageUrl, 
  lang, 
  dictionary, 
  dataAiHint 
}: { 
  id: string, 
  name: string, 
  price?: string, // Base price, optional if Largo/Corto are provided
  priceLargo?: string, // Price for the 'Largo' option
  priceCorto?: string, // Price for the 'Corto' option
  imageUrl: string, 
  lang: Locale, 
  dictionary: any, // Dictionary for localization
  dataAiHint: string // AI hint for image description
}) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
    <Link href={`/${lang}/product/${id}`} className="block" aria-label={`${dictionary.viewMore} ${name}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Next.js Image component for optimized image loading */}
        <Image 
          src={imageUrl} 
          alt={name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-300" 
          data-ai-hint={dataAiHint}
          // Optional: 'sizes' prop is highly recommended when using 'fill' for performance
          // Sizes determine the image size at different breakpoints for responsiveness.
          // Example: sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          // Optional: 'priority' prop for images above the fold to improve LCP
          // priority={true} 
        />
        {/* Overlay for "View More" button on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
           <Button variant="secondary" className="mb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              {dictionary.viewMore} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        {/* Conditional rendering of prices: Largo/Corto or single price */}
        {priceLargo && priceCorto ? (
          <div className="text-primary font-medium flex flex-col">
            <span>Largo: {priceLargo}</span>
            <span>Corto: {priceCorto}</span>
          </div>
        ) : (
          <p className="text-primary font-medium">{price}</p>
        )}
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

  // Effect to load dictionary data based on the current language
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

  // Placeholder categories for filtering
  const categories = ["Maderas Duras", "Maderas Blandas", "Tableros", "Exóticas"];
  
  // Array of product details for the catalog.
  // Each product includes its name, AI hint, price(s), and the exact image filename.
  // IMPORTANT: Ensure 'imageFile' names match your actual files in public/images folder EXACTLY.
  const productDetails = [
    // --- New Woods with Largo/Corto Prices (PNG/JPG) ---
    { name: "Caoba Andina", dataAiHint: "andina mahogany", priceLargo: "RD$175.00", priceCorto: "RD$145.00", imageFile: "caoba-andina.png" }, 
    { name: "Caoba Sudamericana", dataAiHint: "south american mahogany", priceLargo: "RD$185.00", priceCorto: "RD$150.00", imageFile: "caoba sudamericana.png" }, 
    { name: "Roble Congona", dataAiHint: "congona oak", priceLargo: "RD$190.00", priceCorto: "RD$153.00", imageFile: "congona-2.png" }, // Using .jpg based on uploaded file
    { name: "Roble Congona P/Blanca Andino", dataAiHint: "white congona oak", priceLargo: "RD$155.00", priceCorto: "RD$130.00", imageFile: "congona-1.png" }, // Using .jpg based on uploaded file
    { name: "Cedro Macho", dataAiHint: "cedro macho wood", price: "RD$185.00", imageFile: "madera cedro macho.png" }, 
    { name: "Jequiba", dataAiHint: "jequiba wood", priceLargo: "RD$175.00", priceCorto: "RD$155.00", imageFile: "jequitiba 1.png" }, 
    { name: "Roble Cerejeira", dataAiHint: "cerejeira oak", priceLargo: "RD$295.00", priceCorto: "RD$215.00", imageFile: "roble-cerrejeira.png" }, // Using .jpg based on uploaded file
    { name: "Roble Lancha", dataAiHint: "oak plank", priceLargo: "RD$138.00", priceCorto: "RD$118.00", imageFile: "roble brasil.png" }, // Using .jpg based on uploaded file
    { name: "Roble Atados", dataAiHint: "bundled oak", price: "Desde RD$262.00", imageFile: "roble atado.png" }, // Using .jpg based on uploaded file

    // --- Existing/Other Products (mostly SVG, check your files) ---
    { name: "Poplar (Álamo)", dataAiHint: "poplar wood", price: "RD$95.00", imageFile: "poplar-principal.svg" }, 
    { name: "Formaleta Brasileña 4\"x8\" 3/4", dataAiHint: "plywood formwork", price: "RD$2,000.00", imageFile: "formaleta-brasilena-principal.svg" }, 
    { name: "MDF Hidrofugo 3/8", dataAiHint: "waterproof mdf", price: "RD$1,350.00", imageFile: "mdf-hidrofugo-principal.svg" }, 
    { name: "MDF Hidrofugo 5/8", dataAiHint: "waterproof mdf", price: "RD$1,650.00", imageFile: "mdf-hidrofugo-principal.svg" }, 
    { name: "MDF Hidrofugo 3/4", dataAiHint: "waterproof mdf", price: "RD$2,400.00", imageFile: "mdf-hidrofugo-principal.svg" }, 
    { name: "MDF Hidrofugo 1/4 (Natural)", dataAiHint: "waterproof mdf", price: "RD$725.00", imageFile: "mdf-hidrofugo-principal.svg" }, 
    { name: "Melamina 4'x8' 3/4 Blanca", dataAiHint: "white melamine", price: "RD$2,420.00", imageFile: "melamina-principal.svg" }, 
    { name: "Melamina 4'x8' 5/8 Blanca", dataAiHint: "white melamine", price: "RD$2,215.00", imageFile: "melamina-principal.svg" }, 
    { name: "Canto Blanco MT 1mm", dataAiHint: "white edge banding", price: "RD$900.00", imageFile: "canto-blanco-principal.svg" }, 
    
    // Original list products (some updated to use your provided images)
    { name: "Caoba", dataAiHint: "mahogany wood", price: "Desde RD$2,800", imageFile: "caoba andina 2.png" }, // Using 'caoba-andina-2.jpg' from your uploads for a generic Caoba
    { name: "Cedro Blanco", dataAiHint: "white cedar", price: "Desde RD$1,500", imageFile: "cedro-blanco-principal.svg" },
    { name: "Congona", dataAiHint: "congona wood", price: "Desde RD$1,850", imageFile: "congona-principal.svg" },
    { name: "Encino", dataAiHint: "Oak", price: "Desde RD$2,200", imageFile: "encino-principal.svg" }, 
    { name: "Fresno", dataAiHint: "Ash", price: "Desde RD$1,950", imageFile: "fresno-principal.svg" }, 
    { name: "Nogal Americano", dataAiHint: "American Walnut", price: "Desde RD$3,500", imageFile: "nogal-americano-principal.svg" }, 
    { name: "Macocell", dataAiHint: "macocel board", price: "RD$900.00", imageFile: "macocell-principal.svg" },
  ];

  // Map product details to include a slug (for URL) and full image URL
  const products = productDetails.map((detail) => {
    // Robust slug generation to ensure clean URLs for product pages.
    // Handles accents, ñ, spaces, and special characters.
    const slug = detail.name
      .toLowerCase()
      .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n')
      .replace(/p\/blanca/g, 'p-blanca') // Specific rule for "P/Blanca"
      .replace(/4"x8" 3\/4/g, '4x8-3-4') // Rule for dimensions like "4"x8" 3/4"
      .replace(/4'x8' 3\/4/g, '4x8-3-4') // Rule for dimensions like "4'x8' 3/4"
      .replace(/4'x8' 5\/8/g, '4x8-5-8') // Rule for dimensions like "4'x8' 5/8"
      .replace(/mt 1mm/g, 'mt-1mm') // Rule for "MT 1mm"
      .replace(/\(natural\)/g, '-natural') // Rule for "(Natural)"
      .replace(/[()]/g, '') // Remove remaining parentheses
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove any non-alphanumeric, non-hyphen characters
      .replace(/--+/g, '-') // Replace multiple hyphens with a single one
      .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
    
    // Construct the full image URL based on the 'imageFile' name
    // This assumes all image files are directly in the 'public/images/' directory.
    const imageUrl = `/images/${detail.imageFile}`;

    return {
      id: slug,
      name: detail.name,
      price: detail.price,
      priceLargo: detail.priceLargo,
      priceCorto: detail.priceCorto,
      imageUrl: imageUrl,
      dataAiHint: detail.dataAiHint,
    };
  });


  // Display loading skeleton while dictionary or product data is being fetched
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

      {/* Floating Filter Button and Sheet for mobile/tablet */}
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
              {/* Category Filter */}
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

              {/* Price Range Filter */}
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
              
              {/* Dimensions Filter */}
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

      {/* Main product grid layout */}
      <main className="w-full">
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              priceLargo={product.priceLargo} 
              priceCorto={product.priceCorto} 
              imageUrl={product.imageUrl}
              lang={lang}
              dictionary={tCommon}
              dataAiHint={product.dataAiHint}
            />
          ))}
        </div>
        {/* Pagination Placeholder */}
        <div className="mt-12 flex justify-center">
          <Button variant="outline">Cargar más productos</Button>
        </div>
      </main>
    </div>
  );
}
