import { getDb } from "./mongo";

export type Article = {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  status: "draft" | "published";
  author: string;
  tags: string[];
  domains: string[];
  currentVersionId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ArticleVersion = {
  _id: string;
  articleId: string;
  version: number;
  title: string;
  summary: string;
  content: string;
  sourceFile?: string;
  createdAt: Date;
  notes?: string;
};

export type PublishedArticle = Article & {
  publishedAt: Date;
  content: string; // joined from current version
};

export async function listPublishedArticles(): Promise<Article[]> {
  const db = await getDb();
  const docs = await db
    .collection("articles")
    .find({ status: "published" })
    .sort({ updatedAt: -1 })
    .toArray();
  return docs.map(serialiseArticle);
}

export async function getArticleBySlug(
  slug: string,
): Promise<PublishedArticle | null> {
  const db = await getDb();
  const article = await db.collection("articles").findOne({
    slug,
    status: "published",
  });
  if (!article || !article.currentVersionId) return null;

  const version = await db.collection("article_versions").findOne({
    _id: article.currentVersionId,
  });
  if (!version) return null;

  return {
    ...serialiseArticle(article),
    publishedAt: article.publishedAt ?? article.createdAt,
    content: version.content,
  };
}

function serialiseArticle(doc: Record<string, unknown>): Article {
  return {
    _id: String(doc._id),
    slug: doc.slug as string,
    title: doc.title as string,
    summary: doc.summary as string,
    status: doc.status as "draft" | "published",
    author: doc.author as string,
    tags: (doc.tags as string[]) ?? [],
    domains: (doc.domains as string[]) ?? [],
    currentVersionId: doc.currentVersionId
      ? String(doc.currentVersionId)
      : undefined,
    createdAt: doc.createdAt as Date,
    updatedAt: doc.updatedAt as Date,
  };
}
