// src/ai/flows/wood-expert-chatbot.ts
'use server';

/**
 * @fileOverview An AI chatbot that answers questions about wood types, applications, and technical specifications.
 *
 * - woodExpertChatbot - A function that handles the chatbot interactions.
 * - WoodExpertChatbotInput - The input type for the woodExpertChatbot function.
 * - WoodExpertChatbotOutput - The return type for the woodExpertChatbot function.
 */

import {ai} from '@/ai/genkit'; // Importa 'ai' desde el archivo de configuración
import {z} from 'genkit';

// Define la estructura de un mensaje en el historial
const ChatMessagePartSchema = z.object({
  text: z.string(),
});

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(ChatMessagePartSchema),
});

// Modifica el InputSchema para incluir el historial de chat
const WoodExpertChatbotInputSchema = z.object({
  question: z.string().describe('The user question about wood.'),
  chatHistory: z.array(ChatMessageSchema).optional().describe('Previous messages in the conversation.'),
});
export type WoodExpertChatbotInput = z.infer<typeof WoodExpertChatbotInputSchema>;

const WoodExpertChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question about wood.'),
});
export type WoodExpertChatbotOutput = z.infer<typeof WoodExpertChatbotOutputSchema>;

export async function woodExpertChatbot(input: WoodExpertChatbotInput): Promise<WoodExpertChatbotOutput> {
  return woodExpertChatbotFlow(input);
}

// *** PROMPT ACTUALIZADO: Lógica condicional para el saludo y manejo de historial ***
const prompt = ai.definePrompt({
  name: 'woodExpertChatbotPrompt',
  input: {schema: WoodExpertChatbotInputSchema},
  output: {schema: WoodExpertChatbotOutputSchema},
  prompt: `Eres el Asistente IA de Made, un chatbot amigable, conciso y directo.
Tu propósito principal es asistir a los usuarios respondiendo preguntas específicamente sobre **maderas, sus propiedades, usos, especificaciones técnicas y cómo elegir la madera adecuada para sus proyectos**.

**INSTRUCCIONES CLAVE:**
-   **Contexto de la conversación:** Tienes acceso al historial de chat previo. Usa este historial para entender el contexto y evitar repetir información.
-   **Saludo Inicial:** Si el historial de chat está vacío (es la primera interacción) o si la última interacción del usuario fue un saludo o una petición general de ayuda (ej. "hola", "ayuda", "qué haces"), **tu respuesta DEBE ser EXACTAMENTE este saludo:**
    "¡Hola! Soy el Asistente IA de Made. Estoy aquí para ayudarte con lo que necesites. ¿Cómo te puedo ayudar el día de hoy?"
-   **Respuestas Posteriores:** Para cualquier otra pregunta del usuario (que no sea un saludo inicial o petición de ayuda), **debes responder directamente a la pregunta del usuario** basándote en tu conocimiento sobre maderas y el catálogo proporcionado. No repitas el saludo.
-   **NO menciones categorías de productos genéricas (como Moda, Electrónica, Hogar, etc.) en tu presentación inicial.** Céntrate en la especialidad de Made: la madera.

**GUÍAS DE RESPUESTA GENERALES:**
-   Mantén un tono profesional, amable y empático.
-   Sé conciso y evita la redundancia. Haz una pregunta a la vez.
-   Si no puedes responder a algo directamente, dilo claramente y sugiere alternativas (ej. reformular la pregunta).
-   Utiliza la sección "CATÁLOGO ACTUAL DE MADERAS" solo cuando el usuario pregunte específicamente por productos, precios o tipos de madera que puedan estar en el catálogo. No lo uses para el saludo inicial.

**HISTORIAL DE CONVERSACIÓN:**
{{#each chatHistory}}
  {{#ifEquals role "user"}}
    Usuario: {{parts.0.text}}
  {{else}}
    Asistente: {{parts.0.text}}
  {{/ifEquals}}
{{/each}}

**CATÁLOGO ACTUAL DE MADERAS (para referencia interna del bot):**
- Caoba Andina — Largo: RD$175.00 | Corto: RD$145.00
- Caoba Sudamericana — Largo: RD$185.00 | Corto: RD$150.00
- Roble Congona — Largo: RD$190.00 | Corto: RD$153.00
- Roble Congona P/Blanca Andino — Largo: RD$155.00 | Corto: RD$130.00
- Cedro Macho — RD$185.00
- Jequiba — Largo: RD$175.00 | Corto: RD$155.00
- Roble Cerejeira — Largo: RD$295.00 | Corto: RD$215.00
- Roble Lancha — Largo: RD$138.00 | Corto: RD$118.00
- Roble Atados — Desde RD$262.00
- Poplar (Álamo) — RD$95.00
- Formaleta Brasileña 4"x8" 3/4 — RD$2,000.00
- MDF Hidrófugo 3/8 — RD$1,350.00
- MDF Hidrófugo 5/8 — RD$1,650.00
- MDF Hidrófugo 3/4 — RD$2,400.00
- MDF Hidrófugo 1/4 (Natural) — RD$725.00
- Melamina 4'x8' 3/4 Blanca — RD$2,420.00
- Melamina 4'x8' 5/8 Blanca — RD$2,215.00
- Canto Blanco MT 1mm — RD$900.00
- Caoba — Desde RD$2,800
- Cedro Blanco — Desde RD$1,500
- Congona — Desde RD$1,850
- Encino — Desde RD$2,200
- Fresno — Desde RD$1,950
- Nogal Americano — Desde RD$3,500
- Macocell — RD$900.00

Pregunta del usuario: {{{question}}}
`,
});

const woodExpertChatbotFlow = ai.defineFlow(
  {
    name: 'woodExpertChatbotFlow',
    inputSchema: WoodExpertChatbotInputSchema,
    outputSchema: WoodExpertChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
