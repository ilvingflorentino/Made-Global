
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Filter } from 'lucide-react'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/config/i18n.config'

interface CatalogPageProps {
  params: { lang: Locale }
}

// Reusable ProductCard, could be moved to a shared component
const ProductCard = ({ id, name, price, imageUrl, lang, dictionary, dataAiHint }: { id: string, name: string, price: string, imageUrl: string, lang: Locale, dictionary: any, dataAiHint: string }) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
    <Link href={`/${lang}/product/${id}`} className="block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={imageUrl} alt={name} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" data-ai-hint={dataAiHint}/>
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


export default async function CatalogPage({ params: { lang } }: CatalogPageProps) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.catalogPage;
  const tCommon = dictionary.common;

  // Placeholder data
  const categories = ["Maderas Duras", "Maderas Blandas", "Contrachapados", "Exóticas"];
  
  const productDetails = [
    { name: "Roble Rojo Americano", dataAiHint: "red oak" },
    { name: "Pino Amarillo del Sur", dataAiHint: "yellow pine" },
    { name: "Nogal Negro Americano", dataAiHint: "black walnut" },
    { name: "Cerezo Brasileño (Jatoba)", dataAiHint: "jatoba wood" },
    { name: "Arce Duro Canadiense", dataAiHint: "hard maple" },
    { name: "Caoba Africana (Khaya)", dataAiHint: "khaya wood" },
    { name: "Teca de Birmania", dataAiHint: "teak wood" },
    { name: "Fresno Blanco Americano", dataAiHint: "white ash" },
    { name: "Cedro Rojo Occidental", dataAiHint: "red cedar" },
  ];

  const products = productDetails.map((detail, i) => ({
    id: `sku-00${i + 1}`,
    name: detail.name,
    price: `Desde RD$${(Math.random() * 2000 + 1000).toFixed(0)}`,
    imageUrl: `https://placehold.co/600x400.png`, // Standard placeholder
    dataAiHint: detail.dataAiHint,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{tCommon.catalog}</h1>
        <p className="text-muted-foreground mt-2">Explora nuestra amplia selección de maderas de alta calidad.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-1/4 xl:w-1/5 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center"><Filter className="mr-2 h-5 w-5 text-primary"/> {t.filters}</h2>
              <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
                <AccordionItem value="category">
                  <AccordionTrigger className="text-base">{t.category}</AccordionTrigger>
                  <AccordionContent className="space-y-2 pt-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={`cat-${category}`} />
                        <Label htmlFor={`cat-${category}`} className="font-normal">{category}</Label>
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
                      <Label htmlFor="length">Largo (cm)</Label>
                      <Input id="length" type="number" placeholder="Ej: 240" />
                    </div>
                    <div>
                      <Label htmlFor="width">Ancho (cm)</Label>
                      <Input id="width" type="number" placeholder="Ej: 120" />
                    </div>
                     <div>
                      <Label htmlFor="thickness">Grosor (mm)</Label>
                      <Input id="thickness" type="number" placeholder="Ej: 18" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Button className="w-full mt-6">Aplicar Filtros</Button>
            </CardContent>
          </Card>
        </aside>

        {/* Product Grid */}
        <main className="w-full lg:w-3/4 xl:w-4/5">
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
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
          {/* Pagination Placeholder */}
          <div className="mt-12 flex justify-center">
            <Button variant="outline">Cargar más productos</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
