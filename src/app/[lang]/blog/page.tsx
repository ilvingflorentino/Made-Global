
"use client";

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/config/i18n.config';
import { Skeleton } from '@/components/ui/skeleton';
import { placeholderArticlesData, type BlogArticle } from '@/lib/blog-data';

interface BlogPageProps {
  params: Promise<{ lang: Locale }>
}

export default function BlogPage(props: BlogPageProps) {
  const resolvedParams = use(props.params);
  const { lang } = resolvedParams;

  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedArticles, setExpandedArticles] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchDictionary = async () => {
      setIsLoading(true);
      try {
        const dict = await getDictionary(lang);
        setDictionary(dict);
      } catch (error) {
        console.error("Error fetching dictionary:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDictionary();
  }, [lang]);

  const toggleArticle = (articleId: number) => {
    setExpandedArticles(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
  };

  if (isLoading || !dictionary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <Skeleton className="h-10 w-1/2 mx-auto mb-2" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden">
              <div className="relative aspect-video">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-full mb-1" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <div className="p-6 pt-0">
                <Skeleton className="h-10 w-24" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const tCommon = dictionary.common;
  const tBlog = dictionary.blogPage;

  const articles = placeholderArticlesData.map(article => ({
    ...article,
    title: tBlog[article.titleKey as keyof typeof tBlog] || "Article Title",
    excerpt: tBlog[article.excerptKey as keyof typeof tBlog] || "Article excerpt...",
    fullContent: tBlog[article.fullContentKey as keyof typeof tBlog] || "Full article content...",
  }));


  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{tCommon.blog}</h1>
        <p className="text-muted-foreground mt-2">{tBlog.subtitle}</p>
      </header>

      {articles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <Card key={article.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={`/${lang}/blog/${article.id}`} className="block" aria-label={`Read more about ${article.title}`}>
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
                <p className="text-sm text-muted-foreground">
                  {expandedArticles[article.id] ? article.fullContent : article.excerpt}
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button variant="outline" onClick={() => toggleArticle(article.id)}>
                  {expandedArticles[article.id] ? tCommon.readLess : tCommon.readMore}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center py-16">
            <Newspaper className="h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2">{tBlog.emptyStateTitle}</h2>
            <p className="text-muted-foreground mb-6">{tBlog.emptyStateMessage}</p>
            <Button asChild>
                <Link href={`/${lang}`}>{tBlog.emptyStateButton}</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
