export const i18nConfig = {
  defaultLocale: 'es',
  locales: ['en', 'es'],
} as const

export type Locale = (typeof i18nConfig)['locales'][number]
