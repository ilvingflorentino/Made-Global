import { NextRequest, NextResponse } from 'next/server'
import { i18nConfig } from '@/config/i18n.config' // Use the dedicated i18n config

const PUBLIC_FILE = /\.(.*)$/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files, API routes, and Next.js specific paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Use i18nConfig from '@/config/i18n.config'
  const { locales, defaultLocale } = i18nConfig;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const localeToRedirect = defaultLocale 

    // Redirect to the default locale
    // e.g. if pathname is /products, redirect to /es/products
    return NextResponse.redirect(
      new URL(`/${localeToRedirect}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
