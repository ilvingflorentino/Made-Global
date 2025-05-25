
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/config/i18n.config';
import { getArticleById, placeholderArticlesData, type BlogArticle } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { i18nConfig } from '@/config/i18n.config';
// Using ServerPageProps from global types
import type { ServerPageProps } from '@/types/page-props';

// Define the specific shape of params for this page
interface ArticlePageParams {
  lang: Locale;
  articleId: string;
}

// Use the generic ServerPageProps with our specific params type
type ArticlePageProps = ServerPageProps<ArticlePageParams>;

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const { lang, articleId } = params; // Direct destructuring

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

  const title = tBlog[articleData.titleKey as keyof typeof tBlog] || "Article Title Not Found";
  const fullContent = tBlog[articleData.fullContentKey as keyof typeof tBlog] || "Full article content not found...";

  const article = {
    ...articleData,
    title: title,
    fullContent: fullContent,
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
              fill
              className="object-cover"
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
            {article.fullContent.split('\\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>
        </CardContent>
      </Card>
    </div>
  );
}

// This is for what generateStaticParams returns, which are direct objects.
interface ArticlePageStaticParams {
  lang: Locale;
  articleId: string;
}

export async function generateStaticParams(): Promise<ArticlePageStaticParams[]> {
  const articleParams: ArticlePageStaticParams[] = [];

  if (!placeholderArticlesData || placeholderArticlesData.length === 0) {
    console.warn("generateStaticParams for blog articles: placeholderArticlesData is empty or undefined. No params will be generated.");
    return [];
  }

  for (const locale of i18nConfig.locales) {
    for (const article of placeholderArticlesData) {
      articleParams.push({
        lang: locale,
        articleId: article.id.toString(),
      });
    }
  }
  return articleParams;
}
