
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
  priceModifier: number;
}

interface ProductSpecification {
  label: string;
  value: string;
}
interface ProductDetailData {
  name: string;
  description: string;
  price: number; // Base price
  images: ProductImageData[];
  options: {
    medidas: ProductOption[];
    acabado: ProductOption[];
  };
  specifications: ProductSpecification[];
}

// Define product details for all catalog items
// SKUs should match the slugs generated in catalog/page.tsx
const allProductDetails: Record<string, ProductDetailData> = {
  'alamo': {
    name: "Alamo",
    description: "Madera de Alamo de buena calidad, versátil para carpintería general, molduras y proyectos de interior. Conocida por su ligereza y facilidad para trabajar.",
    price: 1250.00,
    images: [
      { id: '1', src: `/images/alamo-principal.svg`, alt: 'Alamo Vista Principal', dataAiHint: "poplar wood" },
      { id: '2', src: `/images/alamo-detalle-veta.svg`, alt: 'Detalle veta Alamo', dataAiHint: "poplar wood grain" },
      { id: '3', src: `/images/alamo-aplicacion.svg`, alt: 'Aplicación de Alamo', dataAiHint: "poplar wood product" },
    ],
    options: {
      medidas: [
        { id: 'm1', label: '1" x 6" x 8\'', priceModifier: 1.0 }, { id: 'm2', label: '1" x 8" x 10\'', priceModifier: 1.3 }, { id: 'm3', label: '2" x 4" x 8\'', priceModifier: 1.6 },
      ],
      acabado: [
        { id: 'a1', label: 'Natural Cepillado', priceModifier: 0 }, { id: 'a2', label: 'Sellado Transparente', priceModifier: 300 }, { id: 'a3', label: 'Tinte Claro', priceModifier: 450 },
      ],
    },
    specifications: [
        {label: "Especie:", value: "Populus (Alamo)"}, {label: "Densidad Aprox.:", value: "450 kg/m³"}, {label: "Dureza Janka Aprox.:", value: "540 lbf"}, {label: "Usos Comunes:", value: "Muebles ligeros, molduras, madera contrachapada, cajas"},
    ]
  },
  'caoba': {
    name: "Caoba",
    description: "Clásica madera de Caoba, conocida por su belleza, durabilidad y rico color marrón rojizo. Ideal para muebles finos y ebanistería de alta calidad.",
    price: 2800.00,
    images: [
      { id: '1', src: `/images/caoba-principal.svg`, alt: 'Caoba Vista Principal', dataAiHint: "mahogany wood" },
      { id: '2', src: `/images/caoba-detalle-veta.svg`, alt: 'Detalle veta Caoba', dataAiHint: "mahogany wood grain" },
      { id: '3', src: `/images/caoba-aplicacion.svg`, alt: 'Aplicación de Caoba', dataAiHint: "mahogany furniture" },
    ],
    options: { /* Placeholder - copy from Alamo or define new */ medidas: [ { id: 'm1', label: '1" x 6" x 8\'', priceModifier: 1.0 }, { id: 'm2', label: '1" x 8" x 10\'', priceModifier: 1.3 }, { id: 'm3', label: '2" x 4" x 8\'', priceModifier: 1.6 }, ], acabado: [ { id: 'a1', label: 'Natural Cepillado', priceModifier: 0 }, { id: 'a2', label: 'Sellado Transparente', priceModifier: 300 }, { id: 'a3', label: 'Tinte Claro', priceModifier: 450 }, ], },
    specifications: [ {label: "Especie:", value: "Swietenia macrophylla"}, {label: "Densidad Aprox.:", value: "640 kg/m³"}, {label: "Dureza Janka Aprox.:", value: "900 lbf"}, {label: "Usos Comunes:", value: "Muebles, gabinetes, instrumentos"}, ]
  },
  'cedro-blanco': {
    name: "Cedro Blanco",
    description: "Madera ligera y aromática, conocida por su resistencia natural a la putrefacción y los insectos. Excelente para revestimientos y armarios.",
    price: 1500.00,
    images: [
      { id: '1', src: `/images/cedro-blanco-principal.svg`, alt: 'Cedro Blanco Vista Principal', dataAiHint: "white cedar wood" },
      { id: '2', src: `/images/cedro-blanco-detalle-veta.svg`, alt: 'Detalle veta Cedro Blanco', dataAiHint: "white cedar grain" },
      { id: '3', src: `/images/cedro-blanco-aplicacion.svg`, alt: 'Aplicación de Cedro Blanco', dataAiHint: "cedar closet" },
    ],
    options: { /* Placeholder */ medidas: [ { id: 'm1', label: '1" x 6" x 8\'', priceModifier: 1.0 }, { id: 'm2', label: '1" x 8" x 10\'', priceModifier: 1.3 }, { id: 'm3', label: '2" x 4" x 8\'', priceModifier: 1.6 }, ], acabado: [ { id: 'a1', label: 'Natural Cepillado', priceModifier: 0 }, { id: 'a2', label: 'Sellado Transparente', priceModifier: 300 }, { id: 'a3', label: 'Tinte Claro', priceModifier: 450 }, ], },
    specifications: [ {label: "Especie:", value: "Thuja occidentalis"}, {label: "Densidad Aprox.:", value: "370 kg/m³"}, {label: "Dureza Janka Aprox.:", value: "320 lbf"}, {label: "Usos Comunes:", value: "Revestimientos, tejas, postes"}, ]
  },
   'congona': {
    name: "Congona",
    description: "Madera Congona, apreciada por su durabilidad y resistencia, ideal para construcciones robustas y elementos exteriores.",
    price: 1850.00,
    images: [
      { id: '1', src: `/images/congona-principal.svg`, alt: 'Congona Vista Principal', dataAiHint: "congona wood" },
      { id: '2', src: `/images/congona-detalle-veta.svg`, alt: 'Detalle veta Congona', dataAiHint: "congona wood grain" },
      { id: '3', src: `/images/congona-aplicacion.svg`, alt: 'Aplicación de Congona', dataAiHint: "congona structure" },
    ],
    options: { /* Placeholder */ medidas: [ { id: 'm1', label: '1" x 6" x 8\'', priceModifier: 1.0 }, { id: 'm2', label: '1" x 8" x 10\'', priceModifier: 1.3 }, { id: 'm3', label: '2" x 4" x 8\'', priceModifier: 1.6 }, ], acabado: [ { id: 'a1', label: 'Natural Cepillado', priceModifier: 0 }, { id: 'a2', label: 'Sellado Transparente', priceModifier: 300 }, { id: 'a3', label: 'Tinte Claro', priceModifier: 450 }, ], },
    specifications: [ {label: "Especie:", value: "Congona (genérico)"}, {label: "Densidad Aprox.:", value: "700 kg/m³"}, {label: "Dureza Janka Aprox.:", value: "1200 lbf"}, {label: "Usos Comunes:", value: "Construcción, pisos, durmientes"}, ]
  },
  'encino': {
    name: "Encino",
    description: "Madera de Encino (Roble), fuerte, dura y resistente al desgaste. Muy popular para pisos, muebles y barriles.",
    price: 2200.00,
    images: [
      { id: '1', src: `/images/encino-principal.svg`, alt: 'Encino Vista Principal', dataAiHint: "oak wood" },
      { id: '2', src: `/images/encino-detalle-veta.svg`, alt: 'Detalle veta Encino', dataAiHint: "oak wood grain" },
      { id: '3', src: `/images/encino-aplicacion.svg`, alt: 'Aplicación de Encino', dataAiHint: "oak furniture" },
    ],
    options: { /* Placeholder */ medidas: [ { id: 'm1', label: '1" x 6" x 8\'', priceModifier: 1.0 }, { id: 'm2', label: '1" x 8" x 10\'', priceModifier: 1.3 }, { id: 'm3', label: '2" x 4" x 8\'', priceModifier: 1.6 }, ], acabado: [ { id: 'a1', label: 'Natural Cepillado', priceModifier: 0 }, { id: 'a2', label: 'Sellado Transparente', priceModifier: 300 }, { id: 'a3', label: 'Tinte Claro', priceModifier: 450 }, ], },
    specifications: [ {label: "Especie:", value: "Quercus (Roble/Encino)"}, {label: "Densidad Aprox.:", value: "720 kg/m³"}, {label: "Dureza Janka Aprox.:", value: "1290 lbf"}, {label: "Usos Comunes:", value: "Pisos, muebles, gabinetes, barriles"}, ]
  },
  'fresno': {
    name: "Fresno",
    description: "Madera de Fresno, conocida por su tenacidad y elasticidad. Color claro y veta prominente, ideal para mangos de herramientas y muebles.",
    price: 1950.00,
    images: [
      { id: '1', src: `/images/fresno-principal.svg`, alt: 'Fresno Vista Principal', dataAiHint: "ash wood" },
      { id: '2', src: `/images/fresno-detalle-veta.svg`, alt: 'Detalle veta Fresno', dataAiHint: "ash wood grain" },
      { id: '3', src: `/images/fresno-aplicacion.svg`, alt: 'Aplicación de Fresno', dataAiHint: "ash furniture" },
    ],
    options: { /* Placeholder */ medidas: [ { id: 'm1', label: '1" x 6" x 8\'', priceModifier: 1.0 }, { id: 'm2', label: '1" x 8" x 10\'', priceModifier: 1.3 }, { id: 'm3', label: '2" x 4" x 8\'', priceModifier: 1.6 }, ], acabado: [ { id: 'a1', label: 'Natural Cepillado', priceModifier: 0 }, { id: 'a2', label: 'Sellado Transparente', priceModifier: 300 }, { id: 'a3', label: 'Tinte Claro', priceModifier: 450 }, ], },
    specifications: [ {label: "Especie:", value: "Fraxinus"}, {label: "Densidad Aprox.:", value: "670 kg/m³"}, {label: "Dureza Janka Aprox.:", value: "1320 lbf"}, {label: "Usos Comunes:", value: "Muebles, bates de béisbol, mangos"}, ]
  },
  'nogal-americano': {
    name: "Nogal Americano",
    description: "Preciada madera de Nogal Americano, de color marrón oscuro rico y veta atractiva. Perfecta para muebles de lujo y detalles finos.",
    price: 3500.00,
    images: [
      { id: '1', src: `/images/nogal-americano-principal.svg`, alt: 'Nogal Americano Vista Principal', dataAiHint: "american walnut wood" },
      { id: '2', src: `/images/nogal-americano-detalle-veta.svg`, alt: 'Detalle veta Nogal Americano', dataAiHint: "walnut wood grain" },
      { id: '3', src: `/images/nogal-americano-aplicacion.svg`, alt: 'Aplicación de Nogal Americano', dataAiHint: "walnut furniture" },
    ],
    options: { /* Placeholder */ medidas: [ { id: 'm1', label: '1" x 6" x 8\'', priceModifier: 1.0 }, { id: 'm2', label: '1" x 8" x 10\'', priceModifier: 1.3 }, { id: 'm3', label: '2" x 4" x 8\'', priceModifier: 1.6 }, ], acabado: [ { id: 'a1', label: 'Natural Cepillado', priceModifier: 0 }, { id: 'a2', label: 'Sellado Transparente', priceModifier: 300 }, { id: 'a3', label: 'Tinte Claro', priceModifier: 450 }, ], },
    specifications: [ {label: "Especie:", value: "Juglans nigra"}, {label: "Densidad Aprox.:", value: "610 kg/m³"}, {label: "Dureza Janka Aprox.:", value: "1010 lbf"}, {label: "Usos Comunes:", value: "Muebles de alta gama, gabinetes, chapas"}, ]
  },
  'macocell': {
    name: "Macocell",
    description: "Tablero Macocell, una opción versátil y económica para diversos proyectos de carpintería y construcción ligera.",
    price: 900.00,
    images: [
      { id: '1', src: `/images/macocell-principal.svg`, alt: 'Macocell Vista Principal', dataAiHint: "macocel board" },
      { id: '2', src: `/images/macocell-textura.svg`, alt: 'Textura Macocell', dataAiHint: "macocel texture" },
      { id: '3', src: `/images/macocell-aplicacion.svg`, alt: 'Aplicación de Macocell', dataAiHint: "macocel project" },
    ],
    options: { /* Placeholder */ medidas: [ { id: 'm1', label: 'Lámina Estándar', priceModifier: 1.0 }, ], acabado: [ { id: 'a1', label: 'Crudo', priceModifier: 0 }, ], },
    specifications: [ {label: "Tipo:", value: "Tablero Aglomerado Ligero"}, {label: "Usos Comunes:", value: "Mueblería económica, divisiones, embalaje"}, ]
  },
  'mdf': {
    name: "MDF",
    description: "Tablero de MDF (Fibra de Densidad Media), uniforme y fácil de trabajar. Ideal para la fabricación de muebles, molduras y paneles.",
    price: 1100.00,
    images: [
      { id: '1', src: `/images/mdf-principal.svg`, alt: 'MDF Vista Principal', dataAiHint: "mdf board" },
      { id: '2', src: `/images/mdf-textura.svg`, alt: 'Textura MDF', dataAiHint: "mdf texture" },
      { id: '3', src: `/images/mdf-aplicacion.svg`, alt: 'Aplicación de MDF', dataAiHint: "mdf furniture" },
    ],
    options: { /* Placeholder */ medidas: [ { id: 'm1', label: 'Lámina 15mm', priceModifier: 1.0 }, { id: 'm2', label: 'Lámina 18mm', priceModifier: 1.2 },], acabado: [ { id: 'a1', label: 'Crudo', priceModifier: 0 }, { id: 'a2', label: 'Melamina Blanca', priceModifier: 500 }, ], },
    specifications: [ {label: "Tipo:", value: "Tablero de Fibra de Densidad Media"}, {label: "Usos Comunes:", value: "Muebles, gabinetes, molduras, artesanías"}, ]
  }
};


type Product = (ProductDetailData & { id: string; }) | null;


// Synchronous function to get product details
const getProductDetailsSync = (sku: string, lang: Locale): Product => {
  const productData = allProductDetails[sku];
  if (productData) {
    return { id: sku, ...productData };
  }
  // Fallback or notFound() logic if SKU is invalid.
  // For now, returning null if not found, UI will handle loading/error state.
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
        if(isActive) setProduct(null); // Ensure product is null on error
      } finally {
        if (isActive) {
          setIsLoadingData(false);
        }
      }
    }
    if (sku && lang) { // Ensure sku and lang are available
        loadData();
    } else {
        setIsLoadingData(false); // Stop loading if essential params are missing
        setProduct(null);
    }
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
      } else if (medidaOpt && !product.options.acabado.length) { // Case where there are no acabado options
        const priceAfterMedida = product.price * medidaOpt.priceModifier;
        setCalculatedPrice(priceAfterMedida * quantity);
      } else if (acabadoOpt && !product.options.medidas.length) { // Case where there are no medida options
         const priceAfterAcabado = product.price + acabadoOpt.priceModifier;
         setCalculatedPrice(priceAfterAcabado * quantity);
      } else if (!product.options.medidas.length && !product.options.acabado.length) { // No options
        setCalculatedPrice(product.price * quantity);
      }

    } else if (product && quantity > 0 && calculatedPrice === null) { 
       const initialMedidaOpt = product.options.medidas.find(m => m.id === selectedMedidaId) || product.options.medidas[0];
       const initialAcabadoOpt = product.options.acabado.find(a => a.id === selectedAcabadoId) || product.options.acabado[0];
       
       let basePriceWithOptions = product.price;
       if (initialMedidaOpt) {
           basePriceWithOptions *= initialMedidaOpt.priceModifier;
       }
       if (initialAcabadoOpt) {
           basePriceWithOptions += initialAcabadoOpt.priceModifier;
       }
       setCalculatedPrice(basePriceWithOptions * quantity);
    }
  }, [product, selectedMedidaId, selectedAcabadoId, quantity, calculatedPrice]);


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
    
    const medidaOpt = product.options.medidas.find(m => m.id === selectedMedidaId);
    const acabadoOpt = product.options.acabado.find(a => a.id === selectedAcabadoId);

    let pricePerUnit = product.price;
    if (medidaOpt) pricePerUnit *= medidaOpt.priceModifier;
    if (acabadoOpt) pricePerUnit += acabadoOpt.priceModifier;


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
    // Optional: Add to quote first, then redirect. For now, just redirect.
    if (!product || !dictionary || calculatedPrice === null || quantity <=0 ) return;
    handleAddToCart(); // Add to quote before redirecting
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
    // This can happen if SKU is invalid or dictionary fails to load
     return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <CardTitle>Producto no encontrado</CardTitle>
        <CardDescription>El producto que buscas no está disponible o la página no pudo cargarse.</CardDescription>
        <Button onClick={() => router.push(`/${lang}/catalog`)} className="mt-4">Volver al Catálogo</Button>
      </div>
    );
  }

  const t = dictionary.productPage;

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
              <p className="text-3xl font-semibold text-primary mb-6">RD${product.price.toFixed(2)} <span className="text-sm text-muted-foreground">/ unidad base</span></p>
              
              {(product.options.medidas.length > 0 || product.options.acabado.length > 0) && <Separator className="my-6" />}

              <div className="space-y-4 mb-6">
                {(product.options.medidas.length > 0 || product.options.acabado.length > 0) && <h3 className="text-xl font-semibold">{t.options}</h3>}
                {product.options.medidas.length > 0 && (
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
                )}
                {product.options.acabado.length > 0 && (
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
                <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isLoadingData || !selectedMedidaId || (product.options.acabado.length > 0 && !selectedAcabadoId)}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> {t.addToCart}
                </Button>
                 <Button size="lg" variant="link" className="flex-1" onClick={handleBuyNow} disabled={isLoadingData || !selectedMedidaId || (product.options.acabado.length > 0 && !selectedAcabadoId)}>
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
