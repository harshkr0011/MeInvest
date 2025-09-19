"use client";

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { news } from '@/lib/data';
import { Newspaper } from 'lucide-react';

export function NewsFeed() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <CardTitle>News Feed</CardTitle>
        </div>
        <CardDescription>Latest financial news and updates.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="pr-4">
            {news.map((article, index) => (
              <div key={article.id}>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex items-start gap-4 py-4">
                    <Image
                      alt={article.headline}
                      className="aspect-square rounded-lg object-cover"
                      height="64"
                      src={article.imageUrl}
                      width="64"
                      data-ai-hint={article.imageHint}
                    />
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none group-hover:underline group-hover:text-accent">
                        {article.headline}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {article.summary}
                      </p>
                      <p className="text-xs text-muted-foreground/80 mt-1">
                        {article.source}
                      </p>
                    </div>
                  </div>
                </a>
                {index < news.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
