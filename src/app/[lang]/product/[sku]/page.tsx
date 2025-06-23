
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
import { useQuote, type QuoteItem } from '@/context/QuoteContext'; 

interface ProductPageProps {
  params: Promise<{ lang: Locale, sku: string }>
}

interface ProductImageData {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
}

interface ProductOption {
  id: string;
  label: string;
  priceModifier?: number; // Kept for future use
  priceAdditive?: number;
}

interface ProductSpecification {
  label: string;
  value: string;
}
interface ProductDetailData {
  name: string;
  description: string;
  price: number; 
  images: ProductImageData[];
  options: {
    medidas: ProductOption[];
    acabado: ProductOption[];
  };
  specifications: ProductSpecification[];
}

// This is now the "database" of product details, updated with user's price list and Largo/Corto options
const allProductDetails: Record<string, ProductDetailData> = {
  'caoba-andina': {
    name: "Caoba Andina",
    description: "Madera de Caoba Andina, apreciada por su color rojizo profundo y veta elegante. Adecuada para muebles de calidad, carpintería interior y acabados decorativos.",
    price: 2800.00, // This will be the base price (Corto)
    images: [ { id: '1', src: `/images/caoba-andina.png`, alt: 'Caoba Andina', dataAiHint: "andina mahogany" } ],
    options: { 
      medidas: [
        { id: 'corto', label: 'Corto (Precio Base)', priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$350)', priceAdditive: 350 },
      ], 
      acabado: [] 
    },
    specifications: [ {label: "Tipo:", value: "Madera dura"}, {label: "Color:", value: "Rojizo profundo"}, {label: "Usos:", value: "Muebles, carpintería fina"} ]
  },
  'caoba-sudamericana': {
    name: "Caoba Sudamericana",
    description: "Una de las maderas más finas del mundo, la Caoba Sudamericana es conocida por su durabilidad, belleza y color rico. Ideal para ebanistería de lujo.",
    price: 3500.00,
    images: [ { id: '1', src: `/images/caoba-sudamericana.png`, alt: 'Caoba Sudamericana', dataAiHint: "south american mahogany" } ],
    options: { 
      medidas: [
        { id: 'corto', label: 'Corto (Precio Base)', priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$500)', priceAdditive: 500 },
      ], 
      acabado: [] 
    },
    specifications: [ {label: "Tipo:", value: "Madera dura de lujo"}, {label: "Color:", value: "Marrón rojizo"}, {label: "Usos:", value: "Ebanistería de alta gama"} ]
  },
  'roble-congona': {
    name: "Roble Congona",
    description: "Madera robusta y resistente, perfecta para proyectos que requieren durabilidad y un aspecto rústico y atractivo.",
    price: 2500.00,
    images: [ { id: '1', src: `/images/roble-congona.png`, alt: 'Roble Congona', dataAiHint: "congona oak" } ],
    options: { 
      medidas: [
        { id: 'corto', label: 'Corto (Precio Base)', priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$300)', priceAdditive: 300 },
      ], 
      acabado: [] 
    },
    specifications: [ {label: "Tipo:", value: "Madera dura"}, {label: "Color:", value: "Marrón claro a medio"}, {label: "Usos:", value: "Pisos, vigas, muebles rústicos"} ]
  },
  'cedro-macho': {
    name: "Cedro Macho",
    description: "Madera versátil y aromática, con buena resistencia a la intemperie y a los insectos.",
    price: 1950.00,
    images: [ { id: '1', src: `/images/cedro-macho.png`, alt: 'Cedro Macho', dataAiHint: "male cedar" } ],
    options: { 
      medidas: [
        { id: 'corto', label: 'Corto (Precio Base)', priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$250)', priceAdditive: 250 },
      ], 
      acabado: [] 
    },
    specifications: [ {label: "Tipo:", value: "Madera blanda"}, {label: "Color:", value: "Marrón rosado"}, {label: "Usos:", value: "Revestimientos, cajonería"} ]
  },
  'jequitiba': {
    name: "Jequitiba",
    description: "Madera brasileña de alta calidad, con una textura fina y un color que va del rosa pálido al marrón rojizo. Excelente para muebles y acabados de interiores.",
    price: 3500.00,
    images: [ { id: '1', src: `/images/jequitiba.png`, alt: 'Jequitiba', dataAiHint: "jequitiba wood" } ],
    options: { 
      medidas: [
        { id: 'corto', label: 'Corto (Precio Base)', priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$400)', priceAdditive: 400 },
      ], 
      acabado: [] 
    },
    specifications: [ {label: "Tipo:", value: "Madera dura brasileña"}, {label: "Color:", value: "Rosa a marrón rojizo"}, {label: "Usos:", value: "Muebles finos, puertas"} ]
  },
  'roble-cerejeira': {
    name: "Roble Cerejeira",
    description: "También conocida como Cerejeira, esta madera ofrece una alternativa atractiva al roble tradicional, con una veta interesante y buena trabajabilidad.",
    price: 2750.00,
    images: [ { id: '1', src: `/images/roble-cerejeira.png`, alt: 'Roble Cerejeira', dataAiHint: "cerejeira oak" } ],
    options: { 
        medidas: [
        { id: 'corto', label: 'Corto (Precio Base)', priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$350)', priceAdditive: 350 },
      ], 
      acabado: [] 
    },
    specifications: [ {label: "Tipo:", value: "Madera dura"}, {label: "Color:", value: "Amarillo a marrón claro"}, {label: "Usos:", value: "Mobiliario, carpintería general"} ]
  },
  'poplar-alamo': {
    name: "Poplar/Alamo",
    description: "Madera ligera y económica, fácil de trabajar. Ideal para carpintería interior, marcos y proyectos que serán pintados.",
    price: 2200.00,
    images: [ { id: '1', src: `/images/poplar-alamo.png`, alt: 'Poplar/Alamo', dataAiHint: "poplar wood" } ],
    options: { 
      medidas: [
        { id: 'corto', label: 'Corto (Precio Base)', priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$250)', priceAdditive: 250 },
      ], 
      acabado: [] 
    },
    specifications: [ {label: "Tipo:", value: "Madera blanda"}, {label: "Color:", value: "Blanco a verdoso"}, {label: "Usos:", value: "Molduras, carpintería pintada"} ]
  },
  'mdf-3mm': {
    name: "MDF 3mm",
    description: "Tablero de fibra de densidad media (MDF) de 3mm de grosor, ideal para fondos de muebles y manualidades.",
    price: 400.00,
    images: [ { id: '1', src: `/images/mdf.png`, alt: 'MDF', dataAiHint: "mdf board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero"}, {label: "Grosor:", value: "3mm"} ]
  },
  'mdf-5mm': {
    name: "MDF 5mm",
    description: "Tablero de fibra de densidad media (MDF) de 5mm de grosor.",
    price: 550.00,
    images: [ { id: '1', src: `/images/mdf.png`, alt: 'MDF', dataAiHint: "mdf board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero"}, {label: "Grosor:", value: "5mm"} ]
  },
  'mdf-9mm': {
    name: "MDF 9mm",
    description: "Tablero de fibra de densidad media (MDF) de 9mm de grosor.",
    price: 900.00,
    images: [ { id: '1', src: `/images/mdf.png`, alt: 'MDF', dataAiHint: "mdf board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero"}, {label: "Grosor:", value: "9mm"} ]
  },
  'mdf-12mm': {
    name: "MDF 12mm",
    description: "Tablero de fibra de densidad media (MDF) de 12mm de grosor.",
    price: 1100.00,
    images: [ { id: '1', src: `/images/mdf.png`, alt: 'MDF', dataAiHint: "mdf board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero"}, {label: "Grosor:", value: "12mm"} ]
  },
  'mdf-15mm': {
    name: "MDF 15mm",
    description: "Tablero de fibra de densidad media (MDF) de 15mm de grosor.",
    price: 1300.00,
    images: [ { id: '1', src: `/images/mdf.png`, alt: 'MDF', dataAiHint: "mdf board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero"}, {label: "Grosor:", value: "15mm"} ]
  },
  'mdf-18mm': {
    name: "MDF 18mm",
    description: "Tablero de fibra de densidad media (MDF) de 18mm de grosor.",
    price: 1550.00,
    images: [ { id: '1', src: `/images/mdf.png`, alt: 'MDF', dataAiHint: "mdf board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero"}, {label: "Grosor:", value: "18mm"} ]
  },
  'mdf-hidrofugo-15mm': {
    name: "MDF Hidrofugo 15mm",
    description: "Tablero de MDF resistente a la humedad de 15mm, ideal para cocinas y baños.",
    price: 1700.00,
    images: [ { id: '1', src: `/images/mdf-hidrofugo.png`, alt: 'MDF Hidrofugo', dataAiHint: "waterproof mdf" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero Hidrófugo"}, {label: "Grosor:", value: "15mm"} ]
  },
  'mdf-hidrofugo-18mm': {
    name: "MDF Hidrofugo 18mm",
    description: "Tablero de MDF resistente a la humedad de 18mm, para proyectos que requieren máxima durabilidad en ambientes húmedos.",
    price: 1950.00,
    images: [ { id: '1', src: `/images/mdf-hidrofugo.png`, alt: 'MDF Hidrofugo', dataAiHint: "waterproof mdf" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero Hidrófugo"}, {label: "Grosor:", value: "18mm"} ]
  },
  'melamina-blanca': {
    name: "Melamina Blanca",
    description: "Tablero de melamina con acabado blanco, perfecto para fabricación de muebles modulares.",
    price: 2200.00,
    images: [ { id: '1', src: `/images/melamina-blanca.png`, alt: 'Melamina Blanca', dataAiHint: "white melamine" } ],
    options: { 
      medidas: [
        { id: '1cara', label: '1 Cara (Precio Base)', priceAdditive: 0 },
        { id: '2caras', label: '2 Caras (+RD$250)', priceAdditive: 250 },
      ], 
      acabado: [] 
    },
    specifications: [ {label: "Tipo:", value: "Tablero Melamínico"}, {label: "Color:", value: "Blanco"} ]
  },
  'pino-americano': {
    name: "Pino Americano",
    description: "Madera de pino americano, conocida por su veta distintiva y versatilidad. Ideal para construcción y carpintería en general.",
    price: 2500.00,
    images: [ { id: '1', src: `/images/pino-americano.png`, alt: 'Pino Americano', dataAiHint: "american pine" } ],
    options: { 
      medidas: [
        { id: 'corto', label: 'Corto (Precio Base)', priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$250)', priceAdditive: 250 },
      ], 
      acabado: [] 
    },
    specifications: [ {label: "Tipo:", value: "Madera blanda"}, {label: "Usos:", value: "Construcción, muebles"} ]
  },
  'pino-caribe': {
    name: "Pino Caribe",
    description: "Pino tratado resistente, ideal para exteriores y construcción. Ofrece una solución duradera y económica.",
    price: 1750.00,
    images: [ { id: '1', src: `/images/pino-caribe.png`, alt: 'Pino Caribe', dataAiHint: "caribbean pine" } ],
    options: { 
      medidas: [
        { id: 'corto', label: 'Corto (Precio Base)', priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$200)', priceAdditive: 200 },
      ], 
      acabado: [] 
    },
    specifications: [ {label: "Tipo:", value: "Madera blanda tratada"}, {label: "Usos:", value: "Exteriores, estructuras"} ]
  },
  'playwood': {
    name: "Playwood",
    description: "Tableros de contrachapado (playwood) versátiles para una variedad de aplicaciones estructurales y decorativas.",
    price: 1200.00,
    images: [ { id: '1', src: `/images/playwood.png`, alt: 'Playwood', dataAiHint: "plywood sheet" } ],
    options: { 
      medidas: [
        { id: 'sencillo', label: 'Sencillo (Precio Base)', priceAdditive: 0 },
        { id: 'marino', label: 'Marino (+RD$500)', priceAdditive: 500 },
      ], 
      acabado: [] 
    },
    specifications: [ {label: "Tipo:", value: "Contrachapado"}, {label: "Grosor:", value: "Variable"} ]
  },
  'canto-blanco-mt-1mm': {
    name: "Canto Blanco MT 1mm",
    description: "Canto de PVC color blanco para un acabado profesional en tableros de melamina. Precio por metro lineal.",
    price: 25.00,
    images: [ { id: '1', src: `/images/canto-blanco.png`, alt: 'Canto Blanco', dataAiHint: "white edge banding" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Accesorio"}, {label: "Material:", value: "PVC"} ]
  },
};

type Product = (ProductDetailData & { id: string; }) | null;

const getProductDetailsSync = (sku: string, lang: Locale): Product => {
  const productData = allProductDetails[sku];
  if (productData) {
    return { id: sku, ...productData };
  }
  return null; 
};


const ImageCarousel = ({ images }: { images: ProductImageData[] }) => {
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
          fill
          className="object-cover"
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
                fill
                className="object-cover"
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
  const { addToQuote } = useQuote(); 

  const [product, setProduct] = useState<Product>(null);
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
          if (productData && productData.options.medidas.length > 0) {
            setSelectedMedidaId(productData.options.medidas[0].id);
          }
          if (productData && productData.options.acabado.length > 0) {
            setSelectedAcabadoId(productData.options.acabado[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to load product page data:", error);
        if(isActive) setProduct(null); 
      } finally {
        if (isActive) {
          setIsLoadingData(false);
        }
      }
    }
    if (sku && lang) { 
        loadData();
    } else {
        setIsLoadingData(false); 
        setProduct(null);
    }
    return () => {
      isActive = false; 
    };
  }, [lang, sku]);


  useEffect(() => {
    if (!product) return;

    let currentPrice = product.price; // Start with base price
    const medidaOpt = product.options.medidas.find(m => m.id === selectedMedidaId);
    const acabadoOpt = product.options.acabado.find(a => a.id === selectedAcabadoId);

    if (medidaOpt) {
      currentPrice += (medidaOpt.priceAdditive || 0);
    }
    if (acabadoOpt) {
      currentPrice += (acabadoOpt.priceAdditive || 0);
    }
      
    setCalculatedPrice(currentPrice * quantity);

  }, [product, selectedMedidaId, selectedAcabadoId, quantity]);


  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num) && num > 0) {
      setQuantity(num);
    } else if (e.target.value === '') {
      setQuantity(1); 
    }
  };

  const handleMedidaChange = (value: string) => {
    setSelectedMedidaId(value);
  };

  const handleAcabadoChange = (value: string) => {
    setSelectedAcabadoId(value);
  };

  const handleAddToCart = () => {
    if (!product || !dictionary || calculatedPrice === null || quantity <=0 ) return;
    
    let pricePerUnit = product.price;
    const medidaOpt = product.options.medidas.find(m => m.id === selectedMedidaId);
    const acabadoOpt = product.options.acabado.find(a => a.id === selectedAcabadoId);
    
    if (medidaOpt) {
      pricePerUnit += (medidaOpt.priceAdditive || 0);
    }
    if (acabadoOpt) {
      pricePerUnit += (acabadoOpt.priceAdditive || 0);
    }
    
    const itemToAdd: Omit<QuoteItem, 'quantity'> = { 
      id: `${product.id}${selectedMedidaId ? '-' + selectedMedidaId : ''}${selectedAcabadoId ? '-' + selectedAcabadoId : ''}`,
      productId: product.id,
      name: product.name,
      pricePerUnit: pricePerUnit,
      imageUrl: product.images[0]?.src, 
      dataAiHint: product.images[0]?.dataAiHint,
      selectedMedidaLabel: medidaOpt?.label,
      selectedAcabadoLabel: acabadoOpt?.label,
    };

    addToQuote(itemToAdd, quantity);

    const tProductPage = dictionary.productPage;
    toast({
      title: tProductPage.itemAddedToQuoteTitle || "Item Added",
      description: `${quantity} x ${product.name} ${medidaOpt ? `(${medidaOpt.label})` : ''} ${acabadoOpt ? `(${acabadoOpt.label})` : ''} ${tProductPage.itemAddedToQuoteMsg || 'has been added to your quote.'}`,
    });
  };

  const handleBuyNow = () => {
    if (!product || !dictionary || calculatedPrice === null || quantity <=0 ) return;
    handleAddToCart(); 
    router.push(`/${lang}/checkout`);
  };


  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Cargando detalles del producto...</p>
      </div>
    );
  }

  if (!product || !dictionary) {
     return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <CardTitle>Producto no encontrado</CardTitle>
        <CardDescription>El producto que buscas no está disponible o la página no pudo cargarse.</CardDescription>
        <Button onClick={() => router.push(`/${lang}/catalog`)} className="mt-4">Volver al Catálogo</Button>
      </div>
    );
  }

  const t = dictionary.productPage;
  const defaultMedidaId = product.options.medidas.length > 0 ? product.options.medidas[0].id : undefined;
  const defaultAcabadoId = product.options.acabado.length > 0 ? product.options.acabado[0].id : undefined;


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
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

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl lg:text-4xl font-bold">{product.name}</CardTitle>
              <CardDescription className="text-lg pt-2">{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-primary mb-6">RD${product.price.toFixed(2)} <span className="text-sm text-muted-foreground">/ precio base</span></p>
              
              {(product.options.medidas.length > 0 || product.options.acabado.length > 0) && <Separator className="my-6" />}

              <div className="space-y-4 mb-6">
                {(product.options.medidas.length > 0 || product.options.acabado.length > 0) && <h3 className="text-xl font-semibold">{t.options}</h3>}
                {product.options.medidas.length > 0 && (
                  <div>
                    <Label className="text-md font-medium">Medidas:</Label>
                    <RadioGroup 
                      value={selectedMedidaId || defaultMedidaId} 
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
                )}
                {product.options.acabado.length > 0 && (
                  <div>
                    <Label className="text-md font-medium">Acabado:</Label>
                    <RadioGroup 
                      value={selectedAcabadoId || defaultAcabadoId} 
                      onValueChange={handleAcabadoChange} 
                      className="mt-2"
                    >
                      {product.options.acabado.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt.id} id={`acabado-${opt.id}`} />
                          <Label htmlFor={`acabado-${opt.id}`} className="font-normal">{opt.label} {(opt.priceAdditive || 0) > 0 ? `(+RD$${opt.priceAdditive?.toFixed(2)})` : ''}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>
              
              <Separator className="my-6" />

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
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                    size="lg" 
                    className="flex-1" 
                    onClick={handleAddToCart} 
                    disabled={isLoadingData || (product.options.medidas.length > 0 && !selectedMedidaId) || (product.options.acabado.length > 0 && !selectedAcabadoId)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> {t.addToCart}
                </Button>
                 <Button 
                    size="lg" 
                    variant="link" 
                    className="flex-1" 
                    onClick={handleBuyNow} 
                    disabled={isLoadingData || (product.options.medidas.length > 0 && !selectedMedidaId) || (product.options.acabado.length > 0 && !selectedAcabadoId)}
                >
                   {t.buyNow}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {product.specifications.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
}


    