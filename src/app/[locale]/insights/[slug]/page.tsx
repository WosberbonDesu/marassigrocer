"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { insights } from "@/data/insights";

export default function InsightDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations("insights");

  const post = insights.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Article not found.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href={`/${locale}/insights`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToInsights")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href={`/${locale}/insights`}
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        {t("backToInsights")}
      </Link>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {post.readTime}
        </span>
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="prose mt-8 max-w-none">
        {post.content.split("\n\n").map((block, i) => {
          if (block.startsWith("## ")) {
            return (
              <h2 key={i} className="mt-8 text-xl font-semibold">
                {block.replace("## ", "")}
              </h2>
            );
          }
          return (
            <p key={i} className="mt-4 leading-relaxed text-muted-foreground">
              {block}
            </p>
          );
        })}
      </div>
    </article>
  );
}
