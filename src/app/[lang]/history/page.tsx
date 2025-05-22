import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCircle } from 'lucide-react'
import Link from 'next/link'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/config/i18n.config'

interface HistoryPageProps {
  params: { lang: Locale }
}

export default async function HistoryPage({ params: { lang } }: HistoryPageProps) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.historyPage;
  const tCommon = dictionary.common;

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-4 w-fit mb-4">
            <UserCircle className="h-12 w-12" />
          </div>
          <CardTitle className="text-3xl">{t.title}</CardTitle>
          <CardDescription>{t.comingSoon}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Estamos trabajando para brindarte acceso a tu historial de pedidos y opciones de gestión de cuenta.
            ¡Vuelve pronto!
          </p>
          <Button asChild size="lg">
            <Link href={`/${lang}/catalog`}>{tCommon.exploreCatalog}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
