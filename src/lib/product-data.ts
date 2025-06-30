// src/lib/product-data.ts

// Define las interfaces para la estructura de datos de un producto
export interface ProductImageData {
  id: string; // Un ID único para la imagen (ej. '1', 'detalle-veta')
  src: string; // Ruta de la imagen (ej. '/images/caoba-andina.png')
  alt: string; // Texto alternativo para la accesibilidad
  dataAiHint: string; // Pista para IA sobre el contenido de la imagen
}

export interface ProductOption {
  id: string; // ID único de la opción (ej. 'largo', 'corto', 'natural-cepillado')
  label: string; // Etiqueta visible de la opción (ej. 'Largo', 'Natural Cepillado')
  priceModifier?: number; // Se usaba en el catálogo para el precio 'Desde'. Mantengo para referencia.
  priceAdditive?: number; // El valor numérico que se suma al precio base del producto cuando se selecciona esta opción.
}

export interface ProductSpecification {
  label: string; // Etiqueta de la especificación (ej. "Especie:")
  value: string; // Valor de la especificación (ej. "Familia Meliaceae")
}

// Define la estructura principal de los datos de un producto
export interface ProductDetailData {
  name: string; // Nombre legible del producto
  description: string; // Descripción detallada del producto
  price: number; // Precio base numérico del producto (ej. 175.00)
  images: ProductImageData[]; // Array de objetos de imagen
  options: {
    medidas: ProductOption[]; // Opciones de medida (ej. Largo, Corto)
    acabado: ProductOption[]; // Opciones de acabado (ej. Natural Cepillado, Sellado Transparente)
  };
  specifications: ProductSpecification[]; // Array de especificaciones técnicas
}

// Función para generar slugs de productos de forma consistente
// Esta función es CRÍTICA para que los IDs de la URL coincidan con las claves en allProductDetails
export function generateProductSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n')
    .replace(/p\/blanca/g, 'p-blanca') // Específico para "P/Blanca"
    .replace(/4"x8" 3\/4/g, '4x8-3-4') // Específico para "4"x8" 3/4"
    .replace(/4'x8' 3\/4/g, '4x8-3-4') // Específico para "4'x8' 3/4"
    .replace(/4'x8' 5\/8/g, '4x8-5-8') // Específico para "4'x8' 5/8"
    .replace(/mt 1mm/g, 'mt-1mm') // Específico para "MT 1mm"
    .replace(/\(natural\)/g, '-natural') // Específico para "(Natural)"
    .replace(/[()]/g, '') // Elimina paréntesis restantes
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/[^a-z0-9-]/g, '') // Elimina cualquier carácter que no sea alfanumérico o guion
    .replace(/--+/g, '-') // Reemplaza múltiples guiones con uno solo
    .replace(/^-+|-+$/g, ''); // Elimina guiones al inicio o al final
}

// Objeto principal que contiene los detalles de TODOS los productos, indexados por su slug.
export const allProductDetails: Record<string, ProductDetailData> = {

  // --- Maderas ---

  // Caoba Andina
  [generateProductSlug("Caoba Andina")]: { // Clave generada por el slug
    name: "Caoba Andina",
    description: "Madera de Caoba Andina, apreciada por su color rojizo profundo y veta elegante. Adecuada para muebles de calidad, carpintería interior y acabados decorativos.",
    price: 175.00, // Precio base (corresponde a "Largo")
    images: [
      { id: '1', src: '/images/caoba andina.png', alt: 'Caoba Andina Vista Principal', dataAiHint: "andina mahogany wood" },
      { id: '2', src: '/images/caoba andina.png', alt: 'Detalle veta Caoba Andina', dataAiHint: "andina mahogany grain" }, // Usando otra imagen que subiste
    ],
    options: {
      medidas: [
        { id: 'largo', label: 'Largo', priceAdditive: 0 }, // No añade nada al precio base
        { id: 'corto', label: 'Corto', priceAdditive: 145.00 - 175.00 }, // Precio Corto - Precio Largo
      ],
      acabado: [
        { id: 'natural-cepillado', label: 'Natural Cepillado', priceAdditive: 0 },
        { id: 'sellado-nitro', label: 'Sellado Nitro Transparente', priceAdditive: 350 },
      ],
    },
    specifications: [
        { label: "Especie:", value: "Familia Meliaceae (Caoba Andina)" },
        { label: "Densidad Aprox.:", value: "550-650 kg/m³" },
        { label: "Dureza Janka Aprox.:", value: "800-950 lbf" },
        { label: "Usos Comunes:", value: "Muebles, ebanistería, revestimientos" },
    ]
  },

  // Caoba Sudamericana
  [generateProductSlug("Caoba Sudamericana")]: {
    name: "Caoba Sudamericana",
    description: "Madera de Caoba Sudamericana, con tonalidades ricas y veta distinguida, ideal para mobiliario de alta gama y trabajos de carpintería fina.",
    price: 185.00, // Precio base (corresponde a "Largo")
    images: [
      { id: '1', src: '/images/caoba sudamericana.png', alt: 'Caoba Sudamericana Vista Principal', dataAiHint: "south american mahogany wood" },
    ],
    options: {
      medidas: [
        { id: 'largo', label: 'Largo', priceAdditive: 0 },
        { id: 'corto', label: 'Corto', priceAdditive: 150.00 - 185.00 }, // Precio Corto - Precio Largo
      ],
      acabado: [
        { id: 'natural-cepillado', label: 'Natural Cepillado', priceAdditive: 0 },
        { id: 'sellado-transparente', label: 'Sellado Transparente', priceAdditive: 300 },
      ],
    },
    specifications: [
        { label: "Especie:", value: "Swietenia macrophylla (Variante Sudamericana)" },
        { label: "Densidad Aprox.:", value: "600-700 kg/m³" },
        { label: "Dureza Janka Aprox.:", value: "850-1000 lbf" },
        { label: "Usos Comunes:", value: "Muebles de lujo, interiores, tallado" },
    ]
  },

  // Roble Congona
  [generateProductSlug("Roble Congona")]: {
    name: "Roble Congona",
    description: "Madera de Roble Congona, apreciada por su durabilidad y resistencia, ideal para construcciones robustas y elementos exteriores.",
    price: 190.00, // Precio base (corresponde a "Largo")
    images: [
      { id: '1', src: '/images/congona-2.png', alt: 'Roble Congona Vista Principal', dataAiHint: "congona oak wood" },
    ],
    options: {
      medidas: [
        { id: 'largo', label: 'Largo', priceAdditive: 0 },
        { id: 'corto', label: 'Corto', priceAdditive: 153.00 - 190.00 }, // Precio Corto - Precio Largo
      ],
      acabado: [
        { id: 'natural-cepillado', label: 'Natural Cepillado', priceAdditive: 0 },
      ],
    },
    specifications: [
        { label: "Especie:", value: "Roble Congona (genérico)" },
        { label: "Densidad Aprox.:", value: "700 kg/m³" },
        { label: "Dureza Janka Aprox.:", value: "1200 lbf" },
        { label: "Usos Comunes:", value: "Construcción, pisos, durmientes" },
    ]
  },

  // Roble Congona P/Blanca Andino
  [generateProductSlug("Roble Congona P/Blanca Andino")]: {
    name: "Roble Congona P/Blanca Andino",
    description: "Variedad Andina de Roble Congona P/Blanca, con características de durabilidad y resistencia, apta para diversas aplicaciones de carpintería.",
    price: 155.00, // Precio base (corresponde a "Largo")
    images: [
      { id: '1', src: '/images/congona-1.png', alt: 'Roble Congona P/Blanca Andino Principal', dataAiHint: "andina white congona oak wood" },
    ],
    options: {
      medidas: [
        { id: 'largo', label: 'Largo', priceAdditive: 0 },
        { id: 'corto', label: 'Corto', priceAdditive: 130.00 - 155.00 }, // Precio Corto - Precio Largo
      ],
      acabado: [
        { id: 'natural', label: 'Natural', priceAdditive: 0 },
      ],
    },
    specifications: [
      { label: "Especie:", value: "Roble Congona (P/Blanca Andino)" },
      { label: "Densidad Aprox.:", value: "680-750 kg/m³" },
      { label: "Usos Comunes:", value: "Carpintería general, estructuras ligeras" },
    ]
  },

  // Cedro Macho
  [generateProductSlug("Cedro Macho")]: {
    name: "Cedro Macho",
    description: "Madera de Cedro Macho, con un buen equilibrio entre resistencia y facilidad de trabajo, ideal para una variedad de proyectos de ebanistería.",
    price: 185.00, // Precio único
    images: [
      { id: '1', src: '/images/madera cedro macho.png', alt: 'Cedro Macho Principal', dataAiHint: "male cedar wood" },
    ],
    options: {
      medidas: [
        { id: 'unidad', label: 'Por Unidad', priceAdditive: 0 }, // No hay largo/corto explícito en la tabla para este
      ],
      acabado: [
        { id: 'natural-cepillado', label: 'Natural Cepillado', priceAdditive: 0 },
      ],
    },
    specifications: [
      { label: "Especie:", value: "Cedrela odorata (Variedad Macho)" },
      { label: "Densidad Aprox.:", value: "400-500 kg/m³" },
      { label: "Usos Comunes:", value: "Muebles, revestimientos, cajas de puros" },
    ]
  },

  // Jequiba
  [generateProductSlug("Jequiba")]: {
    name: "Jequiba",
    description: "Madera de Jequiba, conocida por su resistencia y apariencia atractiva, adecuada para construcción y mobiliario.",
    price: 175.00, // Precio base (corresponde a "Largo")
    images: [
      { id: '1', src: '/images/jequitiba 1.png', alt: 'Jequiba Principal', dataAiHint: "jequiba wood" },
    ],
    options: {
      medidas: [
        { id: 'largo', label: 'Largo', priceAdditive: 0 },
        { id: 'corto', label: 'Corto', priceAdditive: 155.00 - 175.00 }, // Precio Corto - Precio Largo
      ],
      acabado: [
        { id: 'natural', label: 'Natural', priceAdditive: 0 },
      ],
    },
    specifications: [
      { label: "Especie:", value: "Cariniana (Jequiba)" },
      { label: "Densidad Aprox.:", value: "700-800 kg/m³" },
      { label: "Usos Comunes:", value: "Construcción pesada, pisos, mobiliario" },
    ]
  },

  // Roble Cerejeira
  [generateProductSlug("Roble Cerejeira")]: {
    name: "Roble Cerejeira",
    description: "Roble Cerejeira, una madera elegante con tonos rojizos, ideal para muebles finos, ebanistería y proyectos de interior de alta calidad.",
    price: 295.00, // Precio base (corresponde a "Largo")
    images: [
      { id: '1', src: '/images/roble-cerrejeira.png', alt: 'Roble Cerejeira Principal', dataAiHint: "cherry oak wood" },
    ],
    options: {
      medidas: [
        { id: 'largo', label: 'Largo', priceAdditive: 0 },
        { id: 'corto', label: 'Corto', priceAdditive: 215.00 - 295.00 }, // Precio Corto - Precio Largo
      ],
      acabado: [
        { id: 'natural-cepillado', label: 'Natural Cepillado', priceAdditive: 0 },
      ],
    },
    specifications: [
      { label: "Especie:", value: "Roble (variedad Cerejeira)" },
      { label: "Densidad Aprox.:", value: "680-780 kg/m³" },
      { label: "Usos Comunes:", value: "Muebles de lujo, pisos, instrumentos musicales" },
    ]
  },

  // Roble Lancha
  [generateProductSlug("Roble Lancha")]: {
    name: "Roble Lancha",
    description: "Madera de Roble en formato de lancha, ideal para pisos, revestimientos y proyectos que requieran piezas más anchas y uniformes.",
    price: 138.00, // Precio base (corresponde a "Largo")
    images: [
      { id: '1', src: '/images/roble brasil.png', alt: 'Roble Lancha Principal', dataAiHint: "oak plank wood" },
    ],
    options: {
      medidas: [
        { id: 'largo', label: 'Largo', priceAdditive: 0 },
        { id: 'corto', label: 'Corto', priceAdditive: 118.00 - 138.00 }, // Precio Corto - Precio Largo
      ],
      acabado: [
        { id: 'natural', label: 'Natural', priceAdditive: 0 },
      ],
    },
    specifications: [
      { label: "Especie:", value: "Roble" },
      { label: "Formato:", value: "Lancha" },
      { label: "Usos Comunes:", value: "Pisos, revestimientos, ebanistería" },
    ]
  },

  // Roble Atados
  [generateProductSlug("Roble Atados")]: {
    name: "Roble Atados",
    description: "Atados de Roble, una opción conveniente para proyectos que requieren múltiples piezas de roble de alta calidad.",
    price: 262.00, // Precio base (precio "SIN DESCUENTO")
    images: [
      { id: '1', src: '/images/roble atado.png', alt: 'Roble Atados Principal', dataAiHint: "bundled oak wood" },
    ],
    options: {
      medidas: [
        { id: 'unidad', label: 'Atado Individual', priceAdditive: 0 }, // Corresponde al precio base 262.00
        // Podríamos añadir una opción de "Con Descuento" si es relevante, pero la tabla solo da un precio "SIN DESCUENTO"
      ],
      acabado: [
        { id: 'natural', label: 'Natural', priceAdditive: 0 },
      ],
    },
    specifications: [
      { label: "Especie:", value: "Roble (tipo genérico)" },
      { label: "Formato:", value: "Atados (bundles)" },
      { label: "Nota:", value: "El precio indicado es por atado." },
    ]
  },

  // Poplar (Álamo)
  [generateProductSlug("Poplar (Álamo)")]: {
    name: "Poplar (Álamo)",
    description: "Madera de Poplar (Álamo) de buena calidad, versátil para carpintería general, molduras y proyectos de interior. Conocida por su ligereza y facilidad para trabajar.",
    price: 95.00, // Precio único
    images: [
      { id: '1', src: '/images/poplar-principal.svg', alt: 'Poplar Vista Principal', dataAiHint: "poplar wood" },
    ],
    options: {
      medidas: [
        { id: 'unidad', label: 'Por Unidad', priceAdditive: 0 },
      ],
      acabado: [
        { id: 'natural-cepillado', label: 'Natural Cepillado', priceAdditive: 0 },
        { id: 'sellado-transparente', label: 'Sellado Transparente', priceAdditive: 300 },
      ],
    },
    specifications: [
        { label: "Especie:", value: "Populus (Álamo)" },
        { label: "Densidad Aprox.:", value: "450 kg/m³" },
        { label: "Dureza Janka Aprox.:", value: "540 lbf" },
        { label: "Usos Comunes:", value: "Muebles ligeros, molduras, madera contrachapada, cajas" },
    ]
  },

  // --- Tableros y Derivados ---

  // Formaleta Brasileña 4"x8" 3/4
  [generateProductSlug("Formaleta Brasileña 4\"x8\" 3/4")]: {
    name: "Formaleta Brasileña 4\"x8\" 3/4",
    description: "Tablero de formaleta de origen brasileño, ideal para encofrados y estructuras temporales en construcción. Medida estándar 4x8 pies y 3/4 pulgadas de grosor.",
    price: 2000.00, // Precio único
    images: [
      { id: '1', src: '/images/formaleta-brasilena-principal.svg', alt: 'Formaleta Brasileña Principal', dataAiHint: "brazilian formwork board" },
    ],
    options: {
      medidas: [
        { id: 'estandar', label: 'Lámina 4\' x 8\'', priceAdditive: 0 },
      ],
      acabado: [
        { id: 'crudo', label: 'Crudo', priceAdditive: 0 },
      ],
    },
    specifications: [
      { label: "Tipo:", value: "Tablero de Formaleta" },
      { label: "Origen:", value: "Brasil" },
      { label: "Medidas:", value: "4 pies x 8 pies" },
      { label: "Espesor:", value: "3/4 pulgadas" },
      { label: "Usos Comunes:", value: "Encofrados, estructuras temporales" },
    ]
  },

  // MDF Hidrófugo (varios espesores, el precio base es del 3/8)
  [generateProductSlug("MDF Hidrofugo 3/8")]: { // Usamos 3/8 como SKU principal
    name: "MDF Hidrofugo", // Nombre base para la página de producto
    description: "Tablero de Fibra de Densidad Media (MDF) con tratamiento hidrófugo, resistente a la humedad. Ideal para cocinas, baños y ambientes con exposición al agua.",
    price: 1350.00, // Precio base (para 3/8)
    images: [
      { id: '1', src: '/images/mdf-hidrofugo-principal.svg', alt: 'MDF Hidrófugo Principal', dataAiHint: "water resistant mdf board" },
    ],
    options: {
      medidas: [
        { id: '3-16', label: '3/16', priceAdditive: 0 - 1350.00 }, // 0.00 en tabla, resta del base
        { id: '3-8', label: '3/8', priceAdditive: 0 }, // Este es el precio base
        { id: '5-8', label: '5/8', priceAdditive: 1650.00 - 1350.00 }, // 1650.00 - base
        { id: '1-2', label: '1/2', priceAdditive: 0 - 1350.00 }, // 0.00 en tabla, resta del base
        { id: '3-4', label: '3/4', priceAdditive: 2400.00 - 1350.00 }, // 2400.00 - base
        { id: '1-4-natural', label: '1/4 (Natural)', priceAdditive: 725.00 - 1350.00 }, // 725.00 - base
      ],
      acabado: [
        { id: 'crudo', label: 'Crudo', priceAdditive: 0 },
      ],
    },
    specifications: [
      { label: "Tipo:", value: "MDF Hidrófugo" },
      { label: "Densidad:", value: "Media" },
      { label: "Propiedad:", value: "Resistente a la humedad" },
      { label: "Usos Comunes:", value: "Muebles de cocina, baño, zonas húmedas" },
    ]
  },

  // Melamina 4'x8' 3/4 Blanca
  [generateProductSlug("Melamina 4'x8' 3/4 Blanca")]: {
    name: "Melamina 4'x8' 3/4 Blanca",
    description: "Tablero de melamina blanca de 4x8 pies y 3/4 de pulgada de espesor, ideal para fabricación de muebles, estanterías y revestimientos con acabado limpio.",
    price: 2420.00, // Precio único
    images: [
      { id: '1', src: '/images/melamina-principal.svg', alt: 'Melamina 4x8 3/4 Blanca Principal', dataAiHint: "white melamine board" },
    ],
    options: {
      medidas: [
        { id: 'lamina', label: 'Lámina 4\' x 8\'', priceAdditive: 0 },
      ],
      acabado: [
        { id: 'blanco', label: 'Blanco', priceAdditive: 0 },
      ],
    },
    specifications: [
      { label: "Material:", value: "Tablero aglomerado recubierto de melamina" },
      { label: "Color:", value: "Blanco" },
      { label: "Medidas:", value: "4 pies x 8 pies" },
      { label: "Espesor:", value: "3/4 pulgadas" },
      { label: "Usos Comunes:", value: "Muebles, armarios, divisiones, estanterías" },
    ]
  },

  // Melamina 4'x8' 5/8 Blanca
  [generateProductSlug("Melamina 4'x8' 5/8 Blanca")]: {
    name: "Melamina 4'x8' 5/8 Blanca",
    description: "Tablero de melamina blanca de 4x8 pies y 5/8 de pulgada de espesor, una opción versátil y económica para proyectos de mobiliario y diseño interior.",
    price: 2215.00, // Precio único
    images: [
      { id: '1', src: '/images/melamina-principal.svg', alt: 'Melamina 4x8 5/8 Blanca Principal', dataAiHint: "white melamine board" },
    ],
    options: {
      medidas: [
        { id: 'lamina', label: 'Lámina 4\' x 8\'', priceAdditive: 0 },
      ],
      acabado: [
        { id: 'blanco', label: 'Blanco', priceAdditive: 0 },
      ],
    },
    specifications: [
      { label: "Material:", value: "Tablero aglomerado recubierto de melamina" },
      { label: "Color:", value: "Blanco" },
      { label: "Medidas:", value: "4 pies x 8 pies" },
      { label: "Espesor:", value: "5/8 pulgadas" },
      { label: "Usos Comunes:", value: "Muebles, paneles decorativos, divisiones" },
    ]
  },

  // Canto Blanco MT 1mm
  [generateProductSlug("Canto Blanco MT 1mm")]: {
    name: "Canto Blanco MT 1mm",
    description: "Canto de PVC blanco de 1mm de espesor, ideal para el acabado de tableros de melamina y MDF, proporcionando un borde duradero y estético.",
    price: 900.00, // Precio único por el rollo de 100 MT
    images: [
      { id: '1', src: '/images/canto-blanco-principal.svg', alt: 'Canto Blanco MT 1mm Principal', dataAiHint: "white edge banding" },
    ],
    options: {
      medidas: [
        { id: 'rollo', label: 'Rollo de 100 Metros Lineales', priceAdditive: 0 },
      ],
      acabado: [
        { id: 'natural', label: 'Natural', priceAdditive: 0 },
      ],
    },
    specifications: [
      { label: "Material:", value: "PVC" },
      { label: "Color:", value: "Blanco" },
      { label: "Espesor:", value: "1mm" },
      { label: "Formato:", value: "Rollo de 100 Metros" },
      { label: "Usos Comunes:", value: "Acabado de bordes de tableros" },
    ]
  },

  // --- Productos Originales (actualizados con imágenes si aplica) ---

  // Caoba (Genérica)
  // Nota: Si este es el mismo que Caoba Andina, deberías considerar eliminar uno
  [generateProductSlug("Caoba")]: {
    name: "Caoba (Genérica)",
    description: "Clásica madera de Caoba, conocida por su belleza, durabilidad y rico color marrón rojizo. Ideal para muebles finos y ebanistería de alta calidad.",
    price: 2800.00,
    images: [
      { id: '1', src: '/images/caoba andina 2.jpg', alt: 'Caoba Vista Principal', dataAiHint: "mahogany wood" }, // Usando una de tus PNGs
    ],
    options: {
      medidas: [
        { id: 'm1', label: '1" x 6" x 8\'', priceAdditive: 0 },
        { id: 'm2', label: '1" x 8" x 10\'', priceAdditive: 500 }, // Ejemplo de adición de precio
      ],
      acabado: [
        { id: 'natural-cepillado', label: 'Natural Cepillado', priceAdditive: 0 },
        { id: 'sellado-transparente', label: 'Sellado Transparente', priceAdditive: 300 },
      ],
    },
    specifications: [
        { label: "Especie:", value: "Swietenia macrophylla" },
        { label: "Densidad Aprox.:", value: "640 kg/m³" },
        { label: "Usos Comunes:", value: "Muebles, gabinetes, instrumentos" },
    ]
  },

  // Cedro Blanco
  [generateProductSlug("Cedro Blanco")]: {
    name: "Cedro Blanco",
    description: "Madera ligera y aromática, conocida por su resistencia natural a la putrefacción y los insectos. Excelente para revestimientos y armarios.",
    price: 1500.00,
    images: [
      { id: '1', src: '/images/cedro-blanco-principal.svg', alt: 'Cedro Blanco Vista Principal', dataAiHint: "white cedar wood" },
    ],
    options: {
      medidas: [
        { id: 'm1', label: '1" x 6" x 8\'', priceAdditive: 0 },
      ],
      acabado: [
        { id: 'natural-cepillado', label: 'Natural Cepillado', priceAdditive: 0 },
      ],
    },
    specifications: [
        { label: "Especie:", value: "Thuja occidentalis" },
        { label: "Densidad Aprox.:", value: "370 kg/m³" },
        { label: "Usos Comunes:", value: "Revestimientos, tejas, postes" },
    ]
  },

  // Congona (Tipo Genérico)
  [generateProductSlug("Congona")]: {
    name: "Congona (Tipo Genérico)",
    description: "Madera Congona genérica, apreciada por su durabilidad y resistencia.",
    price: 1850.00,
    images: [
      { id: '1', src: '/images/congona-principal.svg', alt: 'Congona Vista Principal', dataAiHint: "congona wood" },
    ],
    options: {
      medidas: [
        { id: 'm1', label: '1" x 6" x 8\'', priceAdditive: 0 },
      ],
      acabado: [
        { id: 'natural-cepillado', label: 'Natural Cepillado', priceAdditive: 0 },
      ],
    },
    specifications: [
        { label: "Especie:", value: "Congona (genérico)" },
        { label: "Densidad Aprox.:", value: "700 kg/m³" },
        { label: "Usos Comunes:", value: "Construcción, pisos, durmientes" },
    ]
  },

  // Encino
  [generateProductSlug("Encino")]: {
    name: "Encino",
    description: "Madera de Encino (Roble), fuerte, dura y resistente al desgaste. Muy popular para pisos, muebles y barriles.",
    price: 2200.00,
    images: [
      { id: '1', src: '/images/encino-principal.svg', alt: 'Encino Vista Principal', dataAiHint: "oak wood" },
    ],
    options: {
      medidas: [
        { id: 'm1', label: '1" x 6" x 8\'', priceAdditive: 0 },
      ],
      acabado: [
        { id: 'natural-cepillado', label: 'Natural Cepillado', priceAdditive: 0 },
      ],
    },
    specifications: [
        { label: "Especie:", value: "Quercus (Roble/Encino)" },
        { label: "Densidad Aprox.:", value: "720 kg/m³" },
        { label: "Usos Comunes:", value: "Pisos, muebles, gabinetes, barriles" },
    ]
  },

  // Fresno
  [generateProductSlug("Fresno")]: {
    name: "Fresno",
    description: "Madera de Fresno, conocida por su tenacidad y elasticidad. Color claro y veta prominente, ideal para mangos de herramientas y muebles.",
    price: 1950.00,
    images: [
      { id: '1', src: '/images/fresno-principal.svg', alt: 'Fresno Vista Principal', dataAiHint: "ash wood" },
    ],
    options: {
      medidas: [
        { id: 'm1', label: '1" x 6" x 8\'', priceAdditive: 0 },
      ],
      acabado: [
        { id: 'natural-cepillado', label: 'Natural Cepillado', priceAdditive: 0 },
      ],
    },
    specifications: [
        { label: "Especie:", value: "Fraxinus" },
        { label: "Densidad Aprox.:", value: "670 kg/m³" },
        { label: "Usos Comunes:", value: "Muebles, bates de béisbol, mangos" },
    ]
  },

  // Nogal Americano
  [generateProductSlug("Nogal Americano")]: {
    name: "Nogal Americano",
    description: "Preciada madera de Nogal Americano, de color marrón oscuro rico y veta atractiva. Perfecta para muebles de lujo y detalles finos.",
    price: 3500.00,
    images: [
      { id: '1', src: '/images/nogal-americano-principal.svg', alt: 'Nogal Americano Vista Principal', dataAiHint: "american walnut wood" },
    ],
    options: {
      medidas: [
        { id: 'm1', label: '1" x 6" x 8\'', priceAdditive: 0 },
      ],
      acabado: [
        { id: 'natural-cepillado', label: 'Natural Cepillado', priceAdditive: 0 },
      ],
    },
    specifications: [
        { label: "Especie:", value: "Juglans nigra" },
        { label: "Densidad Aprox.:", value: "610 kg/m³" },
        { label: "Usos Comunes:", value: "Muebles de alta gama, gabinetes, chapas" },
    ]
  },

  // Macocell
  [generateProductSlug("Macocell")]: {
    name: "Macocell",
    description: "Tablero Macocell, una opción versátil y económica para diversos proyectos de carpintería y construcción ligera.",
    price: 900.00,
    images: [
      { id: '1', src: '/images/macocell-principal.svg', alt: 'Macocell Vista Principal', dataAiHint: "macocel board" },
    ],
    options: {
      medidas: [
        { id: 'lamina-estandar', label: 'Lámina Estándar', priceAdditive: 0 },
      ],
      acabado: [
        { id: 'crudo', label: 'Crudo', priceAdditive: 0 },
      ],
    },
    specifications: [
        { label: "Tipo:", value: "Tablero Aglomerado Ligero" },
        { label: "Usos Comunes:", value: "Mueblería económica, divisiones, embalaje" },
    ]
  },
};
