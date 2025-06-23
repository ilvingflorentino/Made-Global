
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
  priceModifier: number; // For options that multiply the price
  priceAdditive?: number; // For options that add to the price
}

interface ProductSpecification {
  label: string;
  value: string;
}
interface ProductDetailData {
  name: string;
  description: string;
  price: number; // Base price (usually the 'Corto' or standard price)
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
  // == Updated products from price list ==
  'caoba-andina': {
    name: "Caoba Andina",
    description: "Madera de Caoba Andina, apreciada por su color rojizo profundo y veta elegante. Adecuada para muebles de calidad, carpintería interior y acabados decorativos.",
    price: 145.00, // Base price is 'Corto'
    images: [
      { id: '1', src: `/images/caoba-andina.svg`, alt: 'Caoba Andina Vista Principal', dataAiHint: "andina mahogany wood" },
      { id: '2', src: `/images/caoba-andina-detalle-veta.svg`, alt: 'Detalle veta Caoba Andina', dataAiHint: "andina mahogany grain" },
      { id: '3', src: `/images/caoba-andina-aplicacion.svg`, alt: 'Aplicación de Caoba Andina', dataAiHint: "andina mahogany furniture" },
    ],
    options: {
      medidas: [
        { id: 'corto', label: 'Corto', priceModifier: 1.0, priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$30.00)', priceModifier: 1.0, priceAdditive: 30.00 }, // 175 - 145 = 30
      ],
      acabado: [
        { id: 'a1', label: 'Natural Cepillado', priceModifier: 1.0, priceAdditive: 0 },
        { id: 'a2', label: 'Sellado (+RD$350)', priceModifier: 1.0, priceAdditive: 350 },
      ],
    },
    specifications: [
        {label: "Especie:", value: "Familia Meliaceae (Caoba Andina)"}, {label: "Densidad Aprox.:", value: "550-650 kg/m³"}, {label: "Dureza Janka Aprox.:", value: "800-950 lbf"}, {label: "Usos Comunes:", value: "Muebles, ebanistería, revestimientos"},
    ]
  },
  'caoba-sudamericana': {
    name: "Caoba Sudamericana",
    description: "Una madera clásica y muy valorada, conocida por su trabajabilidad, color rico y durabilidad. Ideal para muebles finos y carpintería de alta gama.",
    price: 150.00, // Base price is 'Corto'
    images: [ { id: '1', src: `/images/caoba-sudamericana.svg`, alt: 'Caoba Sudamericana', dataAiHint: "south american mahogany" } ],
    options: {
      medidas: [
        { id: 'corto', label: 'Corto', priceModifier: 1.0, priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$35.00)', priceModifier: 1.0, priceAdditive: 35.00 }, // 185 - 150 = 35
      ],
      acabado: [],
    },
    specifications: [ {label: "Especie:", value: "Swietenia macrophylla"}, {label: "Usos Comunes:", value: "Muebles de lujo, gabinetes, instrumentos"}, ]
  },
  'roble-congona': {
    name: "Roble Congona",
    description: "Madera dura y resistente, con una veta atractiva. Adecuada para proyectos que requieren durabilidad y un acabado robusto.",
    price: 153.00, // Base price is 'Corto'
    images: [ { id: '1', src: `/images/roble-congona.svg`, alt: 'Roble Congona', dataAiHint: "congona oak" } ],
    options: {
      medidas: [
        { id: 'corto', label: 'Corto', priceModifier: 1.0, priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$37.00)', priceModifier: 1.0, priceAdditive: 37.00 }, // 190 - 153 = 37
      ],
      acabado: [],
    },
    specifications: [ {label: "Tipo:", value: "Madera dura"}, {label: "Usos Comunes:", value: "Estructuras, pisos, carpintería general"}, ]
  },
  'roble-congona-p-blanca': {
    name: "Roble Congona P/Blanca",
    description: "Variante de Roble Congona con tonalidades más claras, manteniendo la resistencia y versatilidad de la especie.",
    price: 130.00, // Base price is 'Corto'
    images: [ { id: '1', src: `/images/roble-congona-p-blanca.svg`, alt: 'Roble Congona P/Blanca', dataAiHint: "white congona oak" } ],
    options: {
      medidas: [
        { id: 'corto', label: 'Corto', priceModifier: 1.0, priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$25.00)', priceModifier: 1.0, priceAdditive: 25.00 }, // 155 - 130 = 25
      ],
      acabado: [],
    },
    specifications: [ {label: "Tipo:", value: "Madera dura"}, {label: "Usos Comunes:", value: "Muebles, revestimientos, carpintería"}, ]
  },
  'cedro-macho': {
    name: "Cedro Macho",
    description: "Madera semidura y estable, con un color que varía de rosado a marrón rojizo. Fácil de trabajar y resistente a insectos.",
    price: 185.00, // Only 'Largo' price available
    images: [ { id: '1', src: `/images/cedro-macho.svg`, alt: 'Cedro Macho', dataAiHint: "cedro macho wood" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Especie:", value: "Carapa guianensis"}, {label: "Usos Comunes:", value: "Puertas, ventanas, muebles, construcción ligera"}, ]
  },
  'jequitiba': {
    name: "Jequitiba",
    description: "Madera brasileña de color rosado a rojizo claro, de grano recto y textura media. Usada en muebles, chapas y construcción civil.",
    price: 155.00, // Base price is 'Corto'
    images: [ { id: '1', src: `/images/jequitiba.svg`, alt: 'Jequitiba', dataAiHint: "jequitiba wood" } ],
    options: {
      medidas: [
        { id: 'corto', label: 'Corto', priceModifier: 1.0, priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$20.00)', priceModifier: 1.0, priceAdditive: 20.00 }, // 175 - 155 = 20
      ],
      acabado: [],
    },
    specifications: [ {label: "Especie:", value: "Cariniana legalis"}, {label: "Usos Comunes:", value: "Muebles, carpintería interior, paneles"}, ]
  },
  'roble-cerejeira': {
    name: "Roble Cerejeira",
    description: "Conocida como Cerejeira o Roble Brasileño, es una madera de alta calidad con un color amarillo a marrón dorado y un veteado atractivo.",
    price: 215.00, // Base price is 'Corto'
    images: [ { id: '1', src: `/images/roble-cerejeira.svg`, alt: 'Roble Cerejeira', dataAiHint: "cerejeira oak" } ],
    options: {
      medidas: [
        { id: 'corto', label: 'Corto', priceModifier: 1.0, priceAdditive: 0 },
        { id: 'largo', label: 'Largo (+RD$80.00)', priceModifier: 1.0, priceAdditive: 80.00 }, // 295 - 215 = 80
      ],
      acabado: [],
    },
    specifications: [ {label: "Especie:", value: "Amburana cearensis"}, {label: "Usos Comunes:", value: "Muebles finos, pisos, puertas"}, ]
  },
  'poplar-(alamo)': {
    name: "Poplar (Alamo)",
    description: "Madera de Alamo (Poplar) de buena calidad, versátil para carpintería general, molduras y proyectos de interior. Conocida por su ligereza y facilidad para trabajar.",
    price: 95.00,
    images: [
      { id: '1', src: `/images/poplar-(alamo).svg`, alt: 'Alamo Vista Principal', dataAiHint: "poplar wood" },
    ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Especie:", value: "Populus"}, {label: "Usos Comunes:", value: "Muebles ligeros, molduras, madera contrachapada"}, ]
  },
  'formaleta-brasileña-4x8-3-4': {
    name: "Formaleta Brasileña 4x8 3/4",
    description: "Tablero de encofrado de alta resistencia, utilizado en la construcción para moldear estructuras de hormigón.",
    price: 2000.00,
    images: [ { id: '1', src: `/images/formaleta-brasileña-4x8-3-4.svg`, alt: 'Formaleta Brasileña', dataAiHint: "plywood formwork" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero Contrachapado (Plywood)"}, {label: "Uso:", value: "Encofrado para construcción"}, ]
  },
  'mdf-hidrofugo-3-8': {
    name: "MDF Hidrofugo 3/8",
    description: "Tablero de MDF con tratamiento resistente a la humedad, ideal para ambientes como cocinas y baños. Espesor de 3/8 pulgadas.",
    price: 1350.00,
    images: [ { id: '1', src: `/images/mdf-hidrofugo-3-8.svg`, alt: 'MDF Hidrofugo', dataAiHint: "waterproof mdf" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "MDF Resistente a la Humedad"}, {label: "Espesor:", value: "3/8\" (9.5mm)"}, ]
  },
  'mdf-hidrofugo-5-8': {
    name: "MDF Hidrofugo 5/8",
    description: "Tablero de MDF con tratamiento resistente a la humedad, ideal para ambientes como cocinas y baños. Espesor de 5/8 pulgadas.",
    price: 1650.00,
    images: [ { id: '1', src: `/images/mdf-hidrofugo-5-8.svg`, alt: 'MDF Hidrofugo', dataAiHint: "waterproof mdf" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "MDF Resistente a la Humedad"}, {label: "Espesor:", value: "5/8\" (15.9mm)"}, ]
  },
  'mdf-hidrofugo-3-4': {
    name: "MDF Hidrofugo 3/4",
    description: "Tablero de MDF con tratamiento resistente a la humedad, ideal para ambientes como cocinas y baños. Espesor de 3/4 pulgadas.",
    price: 2400.00,
    images: [ { id: '1', src: `/images/mdf-hidrofugo-3-4.svg`, alt: 'MDF Hidrofugo', dataAiHint: "waterproof mdf" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "MDF Resistente a la Humedad"}, {label: "Espesor:", value: "3/4\" (19mm)"}, ]
  },
  'mdf-hidrofugo-1-4': {
    name: "MDF Hidrofugo 1/4",
    description: "Tablero de MDF con tratamiento resistente a la humedad, ideal para ambientes como cocinas y baños. Espesor de 1/4 pulgadas.",
    price: 725.00,
    images: [ { id: '1', src: `/images/mdf-hidrofugo-1-4.svg`, alt: 'MDF Hidrofugo', dataAiHint: "waterproof mdf" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "MDF Resistente a la Humedad"}, {label: "Espesor:", value: "1/4\" (6.35mm)"}, ]
  },
  'melamina-4x8-3-4-blanca': {
    name: "Melamina 4x8 3/4 Blanca",
    description: "Tablero de aglomerado recubierto con melamina blanca de alta durabilidad, listo para usar en la fabricación de muebles. Espesor de 3/4 pulgadas.",
    price: 2420.00,
    images: [ { id: '1', src: `/images/melamina-4x8-3-4-blanca.svg`, alt: 'Melamina Blanca', dataAiHint: "white melamine board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero de Melamina"}, {label: "Color:", value: "Blanco"}, {label: "Espesor:", value: "3/4\" (19mm)"}, ]
  },
  'melamina-4x8-5-8-blanca': {
    name: "Melamina 4x8 5/8 Blanca",
    description: "Tablero de aglomerado recubierto con melamina blanca de alta durabilidad, listo para usar en la fabricación de muebles. Espesor de 5/8 pulgadas.",
    price: 2215.00,
    images: [ { id: '1', src: `/images/melamina-4x8-5-8-blanca.svg`, alt: 'Melamina Blanca', dataAiHint: "white melamine board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero de Melamina"}, {label: "Color:", value: "Blanco"}, {label: "Espesor:", value: "5/8\" (15.9mm)"}, ]
  },
  'canto-blanco-mt-1mm': {
    name: "Canto Blanco MT 1mm",
    description: "Cinta de PVC para recubrir los bordes de tableros de melamina y MDF, proporcionando un acabado profesional y duradero. Se vende por metro.",
    price: 900.00,
    images: [ { id: '1', src: `/images/canto-blanco-mt-1mm.svg`, alt: 'Canto Blanco', dataAiHint: "white edge banding" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tapacanto de PVC"}, {label: "Color:", value: "Blanco"}, {label: "Ancho:", value: "22mm"}, {label: "Espesor:", value: "1mm"}, ]
  },

  // == Existing products not in the new price list (kept for variety) ==
  'encino': {
    name: "Encino",
    description: "Madera de Encino (Roble), fuerte, dura y resistente al desgaste. Muy popular para pisos, muebles y barriles.",
    price: 2750.00,
    images: [
      { id: '1', src: `/images/encino.svg`, alt: 'Encino Vista Principal', dataAiHint: "oak wood" },
      { id: '2', src: `/images/encino-detalle-veta.svg`, alt: 'Detalle veta Encino', dataAiHint: "oak wood grain" },
      { id: '3', src: `/images/encino-aplicacion.svg`, alt: 'Aplicación de Encino', dataAiHint: "oak furniture" },
    ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Especie:", value: "Quercus (Roble/Encino)"}, {label: "Densidad Aprox.:", value: "720 kg/m³"}, {label: "Dureza Janka Aprox.:", value: "1290 lbf"}, {label: "Usos Comunes:", value: "Pisos, muebles, gabinetes, barriles"}, ]
  },
  'fresno': {
    name: "Fresno",
    description: "Madera de Fresno, conocida por su tenacidad y elasticidad. Color claro y veta prominente, ideal para mangos de herramientas y muebles.",
    price: 3100.00,
    images: [
      { id: '1', src: `/images/fresno.svg`, alt: 'Fresno Vista Principal', dataAiHint: "ash wood" },
      { id: '2', src: `/images/fresno-detalle-veta.svg`, alt: 'Detalle veta Fresno', dataAiHint: "ash wood grain" },
      { id: '3', src: `/images/fresno-aplicacion.svg`, alt: 'Aplicación de Fresno', dataAiHint: "ash furniture" },
    ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Especie:", value: "Fraxinus"}, {label: "Densidad Aprox.:", value: "670 kg/m³"}, {label: "Dureza Janka Aprox.:", value: "1320 lbf"}, {label: "Usos Comunes:", value: "Muebles, bates de béisbol, mangos"}, ]
  },
  'nogal-americano': {
    name: "Nogal Americano",
    description: "Preciada madera de Nogal Americano, de color marrón oscuro rico y veta atractiva. Perfecta para muebles de lujo y detalles finos.",
    price: 4500.00,
    images: [
      { id: '1', src: `/images/nogal-americano.svg`, alt: 'Nogal Americano Vista Principal', dataAiHint: "american walnut wood" },
      { id: '2', src: `/images/nogal-americano-detalle-veta.svg`, alt: 'Detalle veta Nogal Americano', dataAiHint: "walnut wood grain" },
      { id: '3', src: `/images/nogal-americano-aplicacion.svg`, alt: 'Aplicación de Nogal Americano', dataAiHint: "walnut furniture" },
    ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Especie:", value: "Juglans nigra"}, {label: "Densidad Aprox.:", value: "610 kg/m³"}, {label: "Dureza Janka Aprox.:", value: "1010 lbf"}, {label: "Usos Comunes:", value: "Muebles de alta gama, gabinetes, chapas"}, ]
  },
};


type Product = (ProductDetailData & { id: string; }) | null;


// Synchronous function to get product details
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
    if (product && quantity > 0) {
      let currentPrice = product.price;
      const medidaOpt = product.options.medidas.find(m => m.id === selectedMedidaId);
      const acabadoOpt = product.options.acabado.find(a => a.id === selectedAcabadoId);

      // Apply modifiers
      if (medidaOpt) {
          currentPrice = (currentPrice * medidaOpt.priceModifier) + (medidaOpt.priceAdditive || 0);
      }
      if (acabadoOpt) {
          currentPrice = (currentPrice * acabadoOpt.priceModifier) + (acabadoOpt.priceAdditive || 0);
      }
      
      setCalculatedPrice(currentPrice * quantity);

    } else if (product && quantity > 0 && product.options.medidas.length === 0 && product.options.acabado.length === 0) {
        setCalculatedPrice(product.price * quantity);
    }
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
    
    const medidaOpt = product.options.medidas.find(m => m.id === selectedMedidaId);
    const acabadoOpt = product.options.acabado.find(a => a.id === selectedAcabadoId);

    let pricePerUnit = product.price;
    if (medidaOpt) {
      pricePerUnit = (pricePerUnit * medidaOpt.priceModifier) + (medidaOpt.priceAdditive || 0);
    }
    if (acabadoOpt) {
      pricePerUnit = (pricePerUnit * acabadoOpt.priceModifier) + (acabadoOpt.priceAdditive || 0);
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
              <p className="text-3xl font-semibold text-primary mb-6">RD${product.price.toFixed(2)} <span className="text-sm text-muted-foreground">/ unidad base</span></p>
              
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
