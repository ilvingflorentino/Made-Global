import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, ZoomIn, RotateCcw, Loader2 } from 'lucide-react'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/config/i18n.config'

interface ProductPageProps {
  params: { lang: Locale, sku: string }
}

// Placeholder: This would come from an API or database
const getProductDetails = async (sku: string, lang: Locale) => {
  return {
    id: sku,
    name: `Roble Americano Premium (SKU: ${sku})`,
    description: "Madera de roble americano de la más alta calidad, ideal para ebanistería fina, pisos y revestimientos. Conocida por su durabilidad y hermoso veteado.",
    price: 2850.00, // Base price per unit (e.g. per pie tablar)
    images: [
      { id: '1', src: 'https://placehold.co/800x600/936d48/FFFFFF?text=Roble+Vista+1', alt: 'Roble Americano Vista Principal', dataAiHint: "oak wood" },
      { id: '2', src: 'https://placehold.co/800x600/A07A55/FFFFFF?text=Roble+Detalle", alt: 'Detalle veta Roble Americano', dataAiHint: "wood grain" },
      { id: '3', src: 'https://placehold.co/800x600/85623E/FFFFFF?text=Roble+Aplicacion', alt: 'Aplicación de Roble Americano', dataAiHint: "wood furniture" },
    ],
    options: {
      medidas: [
        { id: 'm1', label: '2" x 4" x 8\'', priceModifier: 1.0 },
        { id: 'm2', label: '2" x 6" x 10\'', priceModifier: 1.5 },
        { id: 'm3', label: '4" x 4" x 12\'', priceModifier: 2.2 },
      ],
      acabado: [
        { id: 'a1', label: 'Natural Cepillado', priceModifier: 0 },
        { id: 'a2', label: 'Sellado Transparente', priceModifier: 500 }, // Additional cost
        { id: 'a3', label: 'Tinte Nogal', priceModifier: 750 },
      ],
    },
    specifications: [
        {label: "Especie:", value: "Quercus alba"},
        {label: "Densidad:", value: "755 kg/m³"},
        {label: "Dureza Janka:", value: "1360 lbf"},
        {label: "Usos Comunes:", value: "Muebles, pisos, gabinetes, barriles"},
    ]
  }
}

const ImageCarousel = ({ images }: { images: {id:string, src:string, alt:string, dataAiHint:string}[] }) => {
  // Basic carousel, for advanced features use a library or more complex state
  const [currentIndex, setCurrentIndex] = React.useState(0); // Client-side state

  if (!images || images.length === 0) return <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">No Image</div>;
  
  // This needs to be client component to use useState
  // For now, just display the first image. A real carousel needs client-side JS.
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
      <Image src={images[0].src} alt={images[0].alt} layout="fill" objectFit="cover" data-ai-hint={images[0].dataAiHint} />
      {/* Add navigation buttons if implementing a full carousel */}
    </div>
  );
};

const ThreeViewer = () => (
  <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground shadow-inner">
    <ZoomIn className="w-16 h-16 mb-2 opacity-50" />
    <p className="text-sm">(Visor 3D Interactivo Próximamente)</p>
    <div className="flex gap-2 mt-4">
      <Button variant="outline" size="sm"><RotateCcw className="mr-2 h-4 w-4"/> Auto-Rotar</Button>
    </div>
  </div>
);


export default async function ProductPage({ params: { lang, sku } }: ProductPageProps) {
  const product = await getProductDetails(sku, lang);
  const dictionary = await getDictionary(lang);
  const t = dictionary.productPage;
  const tCommon = dictionary.common;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery / 3D Viewer */}
        <div>
          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gallery">{t.imageGallery}</TabsTrigger>
              <TabsTrigger value="viewer">{t.threeDViewer}</TabsTrigger>
            </TabsList>
            <TabsContent value="gallery" className="mt-4">
              <ImageCarousel images={product.images} />
            </TabsContent>
            <TabsContent value="viewer" className="mt-4">
              <ThreeViewer />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Product Info & Options */}
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl lg:text-4xl font-bold">{product.name}</CardTitle>
              <CardDescription className="text-lg pt-2">{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-primary mb-6">RD${product.price.toFixed(2)} <span className="text-sm text-muted-foreground">/ unidad base</span></p>
              
              <Separator className="my-6" />

              {/* Options Selector */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-semibold">{t.options}</h3>
                <div>
                  <Label className="text-md font-medium">Medidas:</Label>
                  <RadioGroup defaultValue={product.options.medidas[0].id} className="mt-2">
                    {product.options.medidas.map(opt => (
                      <div key={opt.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.id} id={opt.id} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label className="text-md font-medium">Acabado:</Label>
                  <RadioGroup defaultValue={product.options.acabado[0].id} className="mt-2">
                    {product.options.acabado.map(opt => (
                      <div key={opt.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.id} id={opt.id} />
                        <Label htmlFor={opt.id} className="font-normal">{opt.label} (+RD${opt.priceModifier.toFixed(2)})</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              
              <Separator className="my-6" />

              {/* Price Calculator - Simple version */}
              <div className="space-y-4 mb-6">
                 <h3 className="text-xl font-semibold">{t.priceCalculator}</h3>
                 <div className="flex items-end gap-4">
                    <div className="flex-grow">
                      <Label htmlFor="quantity" className="text-md font-medium">Cantidad</Label>
                      <Input type="number" id="quantity" defaultValue="1" min="1" className="mt-1"/>
                    </div>
                    <Button variant="outline" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calcular
                    </Button>
                 </div>
                 <p className="text-xl font-bold text-right">Total Estimado: <span className="text-primary">RD${product.price.toFixed(2)}</span></p>
              </div>
              
              {/* Action Buttons */}
              {/* 'Buy Now' button would be fixed on mobile (handled by MainLayout or specific logic) */}
              {/* This is the desktop version */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="mr-2 h-5 w-5" /> {t.addToCart}
                </Button>
                 <Button size="lg" variant="primary" className="flex-1">
                   {t.buyNow} {/* This would redirect to checkout */}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Especificaciones Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {product.specifications.map(spec => (
                <div key={spec.label} className="flex justify-between">
                  <span className="font-medium text-muted-foreground">{spec.label}</span>
                  <span>{spec.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

// Need client component for stateful ImageCarousel
const React = require('react'); // Hack to allow useState in this file for now
