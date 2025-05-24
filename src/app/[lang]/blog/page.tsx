
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Newspaper } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/config/i18n.config'

interface BlogPageProps {
  params: { lang: Locale }
}

const placeholderArticles = [
  { id: 1, title: "Cómo Elegir la Madera Perfecta para tu Proyecto de Ebanistería", excerpt: "Descubre los secretos para seleccionar la madera ideal que dará vida a tus muebles y creaciones.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "woodworking tools", date: "2024-07-15" },
  { id: 2, title: "Maderas Sostenibles: El Futuro de la Construcción Ecológica", excerpt: "Conoce las opciones de maderas certificadas y cómo contribuyen a un planeta más verde.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "forest sustainable", date: "2024-07-10" },
  { id: 3, title: "Innovación en Acabados: Protege y Embellece tu Madera", excerpt: "Explora las últimas tendencias en acabados que realzan la belleza natural de la madera y prolongan su vida útil.", imageUrl: "https://placehold.co/600x400.png", dataAiHint: "wood varnish", date: "2024-07-05" },
];


export default async function BlogPage({ params: { lang } }: BlogPageProps) {
  const dictionary = await getDictionary(lang);
  const tCommon = dictionary.common;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{tCommon.blog}</h1>
        <p className="text-muted-foreground mt-2">Consejos, noticias y conocimientos sobre el mundo de la madera.</p>
      </header>

      {placeholderArticles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {placeholderArticles.map(article => (
            <Card key={article.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={`/${lang}/blog/${article.id}`} className="block">
                <div className="relative aspect-video">
                  <Image src={article.imageUrl} alt={article.title} layout="fill" objectFit="cover" data-ai-hint={article.dataAiHint}/>
                </div>
              </Link>
              <CardHeader>
                <Link href={`/${lang}/blog/${article.id}`} className="block">
                  <CardTitle className="hover:text-primary transition-colors">{article.title}</CardTitle>
                </Link>
                <CardDescription>{new Date(article.date).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{article.excerpt}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button variant="outline" asChild>
                  <Link href={`/${lang}/blog/${article.id}`}>Leer Más</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center py-16">
            <Newspaper className="h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2">Nuestro Blog está en Construcción</h2>
            <p className="text-muted-foreground mb-6">Pronto compartiremos artículos interesantes. ¡Vuelve a visitarnos!</p>
            <Button asChild>
                <Link href={`/${lang}`}>Volver al Inicio</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
