
import type { Locale } from '@/config/i18n.config';

export interface BlogArticle {
  id: number;
  titleKey: keyof Dictionary['blogPage'];
  excerptKey: keyof Dictionary['blogPage'];
  fullContentKey: keyof Dictionary['blogPage'];
  imageUrl: string;
  dataAiHint: string;
  date: string;
}

// Define Dictionary type locally for blogPage keys, or import it if it's small enough
// For simplicity, assuming blogPage keys are known strings.
interface Dictionary {
  blogPage: {
    blogArticle1Title: string;
    blogArticle1Excerpt: string;
    blogArticle1Full: string;
    blogArticle2Title: string;
    blogArticle2Excerpt: string;
    blogArticle2Full: string;
    blogArticle3Title: string;
    blogArticle3Excerpt: string;
    blogArticle3Full: string;
    [key: string]: string; // Allow any string key
  };
  common: {
    [key: string]: string;
  }
}


export const placeholderArticlesData: BlogArticle[] = [
  { id: 1, titleKey: "blogArticle1Title", excerptKey: "blogArticle1Excerpt", fullContentKey: "blogArticle1Full", imageUrl: "/images/blog-article-1.jpg", dataAiHint: "woodworking tools", date: "2024-07-15" },
  { id: 2, titleKey: "blogArticle2Title", excerptKey: "blogArticle2Excerpt", fullContentKey: "blogArticle2Full", imageUrl: "/images/blog-article-2.jpg", dataAiHint: "forest sustainable", date: "2024-07-10" },
  { id: 3, titleKey: "blogArticle3Title", excerptKey: "blogArticle3Excerpt", fullContentKey: "blogArticle3Full", imageUrl: "/images/blog-article-3.jpg", dataAiHint: "wood varnish", date: "2024-07-05" },
];

export function getArticleById(id: number): BlogArticle | undefined {
  return placeholderArticlesData.find(article => article.id === id);
}
