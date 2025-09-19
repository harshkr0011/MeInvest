
"use client";

import { NewsFeed } from '@/components/dashboard/news-feed';
import { Header } from '@/components/dashboard/header';
import { usePortfolio } from '@/context/portfolio-context';
import type { Stock } from '@/types';
import { useRouter } from 'next/navigation';

export default function NewsPage() {
  const { setSelectedStock } = usePortfolio();
  const router = useRouter();

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    router.push('/');
  };

  return (
    <>
      <Header onStockSelect={handleStockSelect} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <h1 className="text-2xl font-semibold">News</h1>
        <div className="grid grid-cols-1 gap-6">
          <NewsFeed />
        </div>
      </main>
    </>
  );
}

    