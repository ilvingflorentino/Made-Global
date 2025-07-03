// src/ai/genkit.config.ts
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv'; // Importa config de dotenv

// Carga las variables de entorno si es necesario
config(); 

// Inicializa Genkit una única vez
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash', // Asegúrate de que este modelo sea el que quieres usar
});

// Este archivo solo inicializa Genkit y exporta 'ai'.
// No debe contener definiciones de flujos ni prompts.
