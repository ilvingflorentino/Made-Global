
import type { Locale } from '@/config/i18n.config'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then(module => module.default),
  es: () => import('@/dictionaries/es.json').then(module => module.default),
}

export const getDictionary = async (locale: Locale) => {
  const loadDictionary = dictionaries[locale] || dictionaries.en; // Fallback to 'en'
  return loadDictionary();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
