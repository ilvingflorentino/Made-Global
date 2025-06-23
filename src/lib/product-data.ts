
export interface ProductImageData {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
}

export interface ProductOption {
  id:string;
  label: string;
  priceModifier?: number;
  priceAdditive?: number;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductDetailData {
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

export const allProductDetails: Record<string, ProductDetailData> = {
  'caoba-andina': {
    name: "Caoba Andina",
    description: "Madera de Caoba Andina, apreciada por su color rojizo profundo y veta elegante. Adecuada para muebles de calidad, carpintería interior y acabados decorativos.",
    price: 2800.00,
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'Caoba Andina', dataAiHint: "andina mahogany" } ],
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
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'Caoba Sudamericana', dataAiHint: "south american mahogany" } ],
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
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'Roble Congona', dataAiHint: "congona oak" } ],
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
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'Cedro Macho', dataAiHint: "male cedar" } ],
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
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'Jequitiba', dataAiHint: "jequitiba wood" } ],
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
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'Roble Cerejeira', dataAiHint: "cerejeira oak" } ],
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
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'Poplar/Alamo', dataAiHint: "poplar wood" } ],
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
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'MDF', dataAiHint: "mdf board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero"}, {label: "Grosor:", value: "3mm"} ]
  },
  'mdf-5mm': {
    name: "MDF 5mm",
    description: "Tablero de fibra de densidad media (MDF) de 5mm de grosor.",
    price: 550.00,
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'MDF', dataAiHint: "mdf board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero"}, {label: "Grosor:", value: "5mm"} ]
  },
  'mdf-9mm': {
    name: "MDF 9mm",
    description: "Tablero de fibra de densidad media (MDF) de 9mm de grosor.",
    price: 900.00,
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'MDF', dataAiHint: "mdf board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero"}, {label: "Grosor:", value: "9mm"} ]
  },
  'mdf-12mm': {
    name: "MDF 12mm",
    description: "Tablero de fibra de densidad media (MDF) de 12mm de grosor.",
    price: 1100.00,
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'MDF', dataAiHint: "mdf board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero"}, {label: "Grosor:", value: "12mm"} ]
  },
  'mdf-15mm': {
    name: "MDF 15mm",
    description: "Tablero de fibra de densidad media (MDF) de 15mm de grosor.",
    price: 1300.00,
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'MDF', dataAiHint: "mdf board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero"}, {label: "Grosor:", value: "15mm"} ]
  },
  'mdf-18mm': {
    name: "MDF 18mm",
    description: "Tablero de fibra de densidad media (MDF) de 18mm de grosor.",
    price: 1550.00,
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'MDF', dataAiHint: "mdf board" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero"}, {label: "Grosor:", value: "18mm"} ]
  },
  'mdf-hidrofugo-15mm': {
    name: "MDF Hidrofugo 15mm",
    description: "Tablero de MDF resistente a la humedad de 15mm, ideal para cocinas y baños.",
    price: 1700.00,
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'MDF Hidrofugo', dataAiHint: "waterproof mdf" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero Hidrófugo"}, {label: "Grosor:", value: "15mm"} ]
  },
  'mdf-hidrofugo-18mm': {
    name: "MDF Hidrofugo 18mm",
    description: "Tablero de MDF resistente a la humedad de 18mm, para proyectos que requieren máxima durabilidad en ambientes húmedos.",
    price: 1950.00,
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'MDF Hidrofugo', dataAiHint: "waterproof mdf" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Tablero Hidrófugo"}, {label: "Grosor:", value: "18mm"} ]
  },
  'melamina-blanca': {
    name: "Melamina Blanca",
    description: "Tablero de melamina con acabado blanco, perfecto para fabricación de muebles modulares.",
    price: 2200.00,
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'Melamina Blanca', dataAiHint: "white melamine" } ],
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
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'Pino Americano', dataAiHint: "american pine" } ],
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
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'Pino Caribe', dataAiHint: "caribbean pine" } ],
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
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'Playwood', dataAiHint: "plywood sheet" } ],
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
    images: [ { id: '1', src: "https://placehold.co/800x600.png", alt: 'Canto Blanco', dataAiHint: "white edge banding" } ],
    options: { medidas: [], acabado: [] },
    specifications: [ {label: "Tipo:", value: "Accesorio"}, {label: "Material:", value: "PVC"} ]
  },
};
