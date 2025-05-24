
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/config/i18n.config';
import { getArticleById, type BlogArticle } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ArticlePageProps {
  params: {
    lang: Locale;
    articleId: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { lang, articleId } = params;
  const numericArticleId = parseInt(articleId, 10);

  if (isNaN(numericArticleId)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const articleData = getArticleById(numericArticleId);

  if (!articleData) {
    notFound();
  }

  const tBlog = dictionary.blogPage;
  const tCommon = dictionary.common;

  const article = {
    ...articleData,
    title: tBlog[articleData.titleKey as keyof typeof tBlog] || "Article Title",
    fullContent: tBlog[articleData.fullContentKey as keyof typeof tBlog] || "Full article content...",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button asChild variant="outline" className="mb-8">
        <Link href={`/${lang}/blog`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {lang === 'es' ? 'Volver al Blog' : 'Back to Blog'}
        </Link>
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold mb-3">{article.title}</CardTitle>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
            <Image 
              src={article.imageUrl} 
              alt={article.title} 
              layout="fill" 
              objectFit="cover" 
              data-ai-hint={article.dataAiHint}
              priority
            />
          </div>
          <CardDescription>
            {lang === 'es' ? 'Publicado el ' : 'Published on '} 
            {new Date(article.date).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <article className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">
            {/* Split content by newlines to render paragraphs, or use a markdown parser if content is markdown */}
            {article.fullContent.split('\\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>
        </CardContent>
      </Card>
    </div>
  );
}

// Optional: Generate static params for better SEO and build times if articles are known
export async function generateStaticParams({ params: { lang } }: { params: { lang: Locale } }) {
  // Ensure placeholderArticlesData is imported or accessible here
  const { placeholderArticlesData } = await import('@/lib/blog-data');
  
  return placeholderArticlesData.map(article => ({
    articleId: article.id.toString(),
  }));
}
