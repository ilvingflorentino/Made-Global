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

// Importa allProductDetails y las interfaces desde el nuevo archivo centralizado
import { allProductDetails, type ProductDetailData, type ProductImageData, type ProductOption } from '@/lib/product-data';

interface ProductPageProps {
  params: Promise<{ lang: Locale, sku: string }>
}

// Adapta el tipo Product para usar ProductDetailData
type Product = (ProductDetailData & { id: string; }) | null;

// Función síncrona para obtener detalles del producto por SKU
// Esta función ahora usa el allProductDetails importado
const getProductDetailsSync = (sku: string): Product => {
  const productData = allProductDetails[sku];
  if (productData) {
    return { id: sku, ...productData };
  }
  return null; 
};

// Componente ImageCarousel para mostrar las imágenes del producto
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
          priority={selectedImageIndex === 0} // Prioriza la primera imagen para LCP
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Añadido sizes para rendimiento
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
                sizes="80px" // Tamaño fijo para thumbnails
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

// Componente para el visor 3D (placeholder por ahora)
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

// Componente principal de la página de producto
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

  // Efecto para cargar los datos del producto y el diccionario
  useEffect(() => {
    let isActive = true;
    async function loadData() {
      setIsLoadingData(true);
      try {
        const productData = getProductDetailsSync(sku); // Obtiene el producto por SKU
        const dictData = await getDictionary(lang);
        if (isActive) {
          setProduct(productData);
          setDictionary(dictData);
          // Establece la primera opción de medida y acabado como predeterminada si existen
          if (productData && productData.options.medidas.length > 0) {
            setSelectedMedidaId(productData.options.medidas[0].id);
          } else {
            setSelectedMedidaId(undefined); // Asegura que sea undefined si no hay opciones
          }
          if (productData && productData.options.acabado.length > 0) {
            setSelectedAcabadoId(productData.options.acabado[0].id);
          } else {
            setSelectedAcabadoId(undefined); // Asegura que sea undefined si no hay opciones
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

  // Efecto para recalcular el precio total cuando cambian las opciones o la cantidad
  useEffect(() => {
    if (!product || quantity <= 0) {
      setCalculatedPrice(null);
      return;
    }

    let currentPrice = product.price; // Inicia con el precio base del producto

    const medidaOpt = product.options.medidas.find(m => m.id === selectedMedidaId);
    if (medidaOpt) {
      currentPrice += (medidaOpt.priceAdditive || 0); // Suma el aditivo de precio de la medida
    }
    // Si no se selecciona ninguna medida pero hay opciones, usa el aditivo de la primera por defecto
    else if (product.options.medidas.length > 0) {
      currentPrice += (product.options.medidas[0].priceAdditive || 0);
    }

    const acabadoOpt = product.options.acabado.find(a => a.id === selectedAcabadoId);
    if (acabadoOpt) {
      currentPrice += (acabadoOpt.priceAdditive || 0); // Suma el aditivo de precio del acabado
    }
    // Si no se selecciona ningún acabado pero hay opciones, usa el aditivo del primero por defecto
    else if (product.options.acabado.length > 0) {
      currentPrice += (product.options.acabado[0].priceAdditive || 0);
    }
      
    setCalculatedPrice(currentPrice * quantity); // Calcula el precio total
  }, [product, selectedMedidaId, selectedAcabadoId, quantity]);

  // Manejador para el cambio de cantidad de productos
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num) && num > 0) {
      setQuantity(num);
    } else if (e.target.value === '') {
      setQuantity(1); // Default to 1 if input is cleared
    }
  };

  // Manejadores para el cambio de opciones de medida y acabado
  const handleMedidaChange = (value: string) => {
    setSelectedMedidaId(value);
  };

  const handleAcabadoChange = (value: string) => {
    setSelectedAcabadoId(value);
  };

  // Manejador para añadir el producto a la cotización
  const handleAddToCart = () => {
    if (!product || !dictionary || calculatedPrice === null || quantity <=0 ) return;
    
    // Recalcula el precio por unidad para el item de la cotización
    let pricePerUnit = product.price;
    const medidaOpt = product.options.medidas.find(m => m.id === selectedMedidaId) || (product.options.medidas.length > 0 ? product.options.medidas[0] : undefined);
    if (medidaOpt) pricePerUnit += (medidaOpt.priceAdditive || 0);

    const acabadoOpt = product.options.acabado.find(a => a.id === selectedAcabadoId) || (product.options.acabado.length > 0 ? product.options.acabado[0] : undefined);
    if (acabadoOpt) pricePerUnit += (acabadoOpt.priceAdditive || 0);
    
    // Crea el objeto QuoteItem
    const itemToAdd: Omit<QuoteItem, 'quantity'> = { 
      id: `${product.id}${selectedMedidaId ? '-' + selectedMedidaId : ''}${selectedAcabadoId ? '-' + selectedAcabadoId : ''}`,
      productId: product.id,
      name: product.name,
      pricePerUnit: pricePerUnit,
      imageUrl: product.images[0]?.src, // Usa la primera imagen del array de imágenes del producto
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

  // Manejador para comprar el producto directamente
  const handleBuyNow = () => {
    if (!product || !dictionary || calculatedPrice === null || quantity <=0 ) return;
    handleAddToCart(); // Añade al carrito y luego navega a checkout
    router.push(`/${lang}/checkout`);
  };

  // Muestra un esqueleto de carga mientras los datos se están cargando
  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Cargando detalles del producto...</p>
      </div>
    );
  }

  // Muestra un mensaje de producto no encontrado si el SKU no es válido o los datos no se cargan
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
  // Obtiene los IDs de las opciones por defecto para inicializar los RadioGroup
  const defaultMedidaId = product.options.medidas.length > 0 ? product.options.medidas[0].id : undefined;
  const defaultAcabadoId = product.options.acabado.length > 0 ? product.options.acabado[0].id : undefined;


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Columna izquierda para el carrusel de imágenes y visor 3D */}
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

        {/* Columna derecha para detalles del producto, opciones y compra */}
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl lg:text-4xl font-bold">{product.name}</CardTitle>
              <CardDescription className="text-lg pt-2">{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Muestra el precio base del producto */}
              <p className="text-3xl font-semibold text-primary mb-6">RD${product.price.toFixed(2)} <span className="text-sm text-muted-foreground">/ precio base</span></p>
              
              {/* Separador si hay opciones */}
              {(product.options.medidas.length > 0 || product.options.acabado.length > 0) && <Separator className="my-6" />}

              <div className="space-y-4 mb-6">
                {(product.options.medidas.length > 0 || product.options.acabado.length > 0) && <h3 className="text-xl font-semibold">{t.options}</h3>}
                {/* Opciones de Medidas */}
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
                          <Label htmlFor={`medida-${opt.id}`} className="font-normal">
                            {opt.label}
                            {(opt.priceAdditive || 0) !== 0 ? ` (${(opt.priceAdditive || 0) > 0 ? '+' : ''}RD$${(opt.priceAdditive || 0).toFixed(2)})` : ''}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
                {/* Opciones de Acabado */}
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

              {/* Calculadora de precios y cantidad */}
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
              
              {/* Botones de acción */}
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
          
          {/* Sección de especificaciones técnicas */}
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
