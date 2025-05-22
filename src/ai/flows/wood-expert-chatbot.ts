// src/ai/flows/wood-expert-chatbot.ts
'use server';

/**
 * @fileOverview An AI chatbot that answers questions about wood types, applications, and technical specifications.
 *
 * - woodExpertChatbot - A function that handles the chatbot interactions.
 * - WoodExpertChatbotInput - The input type for the woodExpertChatbot function.
 * - WoodExpertChatbotOutput - The return type for the woodExpertChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WoodExpertChatbotInputSchema = z.object({
  question: z.string().describe('The user question about wood.'),
});
export type WoodExpertChatbotInput = z.infer<typeof WoodExpertChatbotInputSchema>;

const WoodExpertChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question about wood.'),
});
export type WoodExpertChatbotOutput = z.infer<typeof WoodExpertChatbotOutputSchema>;

export async function woodExpertChatbot(input: WoodExpertChatbotInput): Promise<WoodExpertChatbotOutput> {
  return woodExpertChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'woodExpertChatbotPrompt',
  input: {schema: WoodExpertChatbotInputSchema},
  output: {schema: WoodExpertChatbotOutputSchema},
  prompt: `You are a helpful AI chatbot expert in the area of wood, wood types, their applications, and technical specifications.
  A user is asking you a question about wood. Answer their question to the best of your ability.

  Question: {{{question}}}
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
