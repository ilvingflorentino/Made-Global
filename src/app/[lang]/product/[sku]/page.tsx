
"use client";

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, ZoomIn, RotateCcw, Loader2 } from 'lucide-react';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/config/i18n.config';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface ProductPageProps {
  params: Promise<{ lang: Locale, sku: string }>
}

// Synchronous function to get product details
const getProductDetailsSync = (sku: string, lang: Locale) => {
  // Here you can add logic to return different details based on lang if needed
  return {
    id: sku,
    name: `Roble Americano Premium (SKU: ${sku})`, // This could be localized via dictionary later
    description: "Madera de roble americano de la más alta calidad, ideal para ebanistería fina, pisos y revestimientos. Conocida por su durabilidad y hermoso veteado.",
    price: 2850.00, // Base price per unit (e.g. per pie tablar)
    images: [
      { id: '1', src: 'https://placehold.co/800x600.png', alt: 'Roble Americano Vista Principal', dataAiHint: "oak wood" },
      { id: '2', src: 'https://placehold.co/800x600.png', alt: 'Detalle veta Roble Americano', dataAiHint: "wood grain" },
      { id: '3', src: 'https://placehold.co/800x600.png', alt: 'Aplicación de Roble Americano', dataAiHint: "wood furniture" },
    ],
    options: {
      medidas: [
        { id: 'm1', label: '2" x 4" x 8\'', priceModifier: 1.0 },
        { id: 'm2', label: '2" x 6" x 10\'', priceModifier: 1.5 },
        { id: 'm3', label: '4" x 4" x 12\'', priceModifier: 2.2 },
      ],
      acabado: [
        { id: 'a1', label: 'Natural Cepillado', priceModifier: 0 }, // Additional cost
        { id: 'a2', label: 'Sellado Transparente', priceModifier: 500 },
        { id: 'a3', label: 'Tinte Nogal', priceModifier: 750 },
      ],
    },
    specifications: [
        {label: "Especie:", value: "Quercus alba"},
        {label: "Densidad:", value: "755 kg/m³"},
        {label: "Dureza Janka:", value: "1360 lbf"},
        {label: "Usos Comunes:", value: "Muebles, pisos, gabinetes, barriles"},
    ]
  };
};

type Product = ReturnType<typeof getProductDetailsSync>;

const ImageCarousel = ({ images }: { images: Product['images'] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        No Image Available
      </div>
    );
  }

  const selectedImage = images[selectedImageIndex];

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
        <Image
          key={selectedImage.id}
          src={selectedImage.src}
          alt={selectedImage.alt}
          layout="fill"
          objectFit="cover"
          data-ai-hint={selectedImage.dataAiHint}
          priority={selectedImageIndex === 0}
        />
      </div>
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all
                          ${selectedImageIndex === index ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent hover:border-muted-foreground/50'}`}
              aria-label={`View image ${index + 1} of ${images.length}`}
            >
              <Image
                src={image.src}
                alt={`Thumbnail for ${image.alt}`}
                layout="fill"
                objectFit="cover"
                data-ai-hint={image.dataAiHint}
              />
              {selectedImageIndex === index && (
                <div className="absolute inset-0 bg-primary/30" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ThreeViewer = () => (
  <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground shadow-inner p-4">
    <ZoomIn className="w-16 h-16 mb-2 opacity-50" />
    <p className="text-sm mb-4 text-center">(Visor 3D Interactivo Próximamente)</p>
    <div className="flex gap-2 mt-auto">
      <Button variant="outline" size="sm" disabled>
        <RotateCcw className="mr-2 h-4 w-4"/> Auto-Rotar
      </Button>
    </div>
  </div>
);


export default function ProductPage(props: ProductPageProps) {
  const resolvedParams = use(props.params);
  const { lang, sku } = resolvedParams;

  const router = useRouter();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [selectedMedidaId, setSelectedMedidaId] = useState<string | undefined>(undefined);
  const [selectedAcabadoId, setSelectedAcabadoId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);


  useEffect(() => {
    let isActive = true;
    async function loadData() {
      setIsLoadingData(true);
      try {
        const productData = getProductDetailsSync(sku, lang);
        const dictData = await getDictionary(lang);
        if (isActive) {
          setProduct(productData);
          setDictionary(dictData);
          // Initialize options and price after product data is loaded
          if (productData) {
            const initialMedidaId = productData.options.medidas[0]?.id;
            const initialAcabadoId = productData.options.acabado[0]?.id;
            setSelectedMedidaId(initialMedidaId);
            setSelectedAcabadoId(initialAcabadoId);
          }
        }
      } catch (error) {
        console.error("Failed to load product page data:", error);
      } finally {
        if (isActive) {
          setIsLoadingData(false);
        }
      }
    }
    loadData();
    return () => {
      isActive = false; 
    };
  }, [lang, sku]);


  useEffect(() => {
    if (product && selectedMedidaId && selectedAcabadoId && quantity > 0) {
      const medidaOpt = product.options.medidas.find(m => m.id === selectedMedidaId);
      const acabadoOpt = product.options.acabado.find(a => a.id === selectedAcabadoId);

      if (medidaOpt && acabadoOpt) {
        const priceAfterMedida = product.price * medidaOpt.priceModifier;
        const priceAfterAcabado = priceAfterMedida + acabadoOpt.priceModifier;
        const finalPrice = priceAfterAcabado * quantity;
        setCalculatedPrice(finalPrice);
      }
    } else if (product && quantity > 0 && calculatedPrice === null) {
      // Fallback for initial calculation if options not fully set yet, or default.
      // This ensures an initial price is shown based on product base price and quantity 1.
       const initialMedidaOpt = product.options.medidas[0];
       const initialAcabadoOpt = product.options.acabado[0];
       if(initialMedidaOpt && initialAcabadoOpt){
         const priceAfterMedida = product.price * initialMedidaOpt.priceModifier;
         const priceAfterAcabado = priceAfterMedida + initialAcabadoOpt.priceModifier;
         setCalculatedPrice(priceAfterAcabado * quantity);
       } else {
        setCalculatedPrice(product.price * quantity);
       }
    }
  }, [product, selectedMedidaId, selectedAcabadoId, quantity, calculatedPrice]);


  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num) && num > 0) {
      setQuantity(num);
    } else if (e.target.value === '') {
      // Allow clearing the input, defaulting to 1 or handle validation elsewhere
      setQuantity(1); // Or perhaps set an error state / handle invalid input
    }
  };

  const handleMedidaChange = (value: string) => {
    setSelectedMedidaId(value);
  };

  const handleAcabadoChange = (value: string) => {
    setSelectedAcabadoId(value);
  };

  const handleAddToCart = () => {
    if (!product || !dictionary) return;
    const tProductPage = dictionary.productPage;
    toast({
      title: tProductPage.itemAddedToQuoteTitle || "Item Added",
      description: `${product.name} ${tProductPage.itemAddedToQuoteMsg || 'has been added to your quote.'}`,
    });
  };

  const handleBuyNow = () => {
    router.push(`/${lang}/checkout`);
  };


  if (isLoadingData || !product || !dictionary) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Cargando detalles del producto...</p>
      </div>
    );
  }

  const t = dictionary.productPage;
  // const tCommon = dictionary.common; // Already have dictionary for tProductPage above

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
                  <RadioGroup 
                    value={selectedMedidaId} 
                    onValueChange={handleMedidaChange} 
                    className="mt-2"
                  >
                    {product.options.medidas.map(opt => (
                      <div key={opt.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.id} id={`medida-${opt.id}`} />
                        <Label htmlFor={`medida-${opt.id}`} className="font-normal">{opt.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label className="text-md font-medium">Acabado:</Label>
                  <RadioGroup 
                    value={selectedAcabadoId} 
                    onValueChange={handleAcabadoChange} 
                    className="mt-2"
                  >
                    {product.options.acabado.map(opt => (
                      <div key={opt.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.id} id={`acabado-${opt.id}`} />
                        <Label htmlFor={`acabado-${opt.id}`} className="font-normal">{opt.label} (+RD${opt.priceModifier.toFixed(2)})</Label>
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
                      <Input 
                        type="number" 
                        id="quantity" 
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1" 
                        className="mt-1"
                      />
                    </div>
                 </div>
                 <p className="text-xl font-bold text-right">Total Estimado: <span className="text-primary">RD${calculatedPrice !== null ? calculatedPrice.toFixed(2) : '...'}</span></p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> {t.addToCart}
                </Button>
                 <Button size="lg" variant="link" className="flex-1" onClick={handleBuyNow}>
                   {t.buyNow}
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

