
"use client";

import { Portfolio } from '@/components/dashboard/portfolio';
import { Header } from '@/components/dashboard/header';
import { usePortfolio } from '@/context/portfolio-context';
import { useRouter } from 'next/navigation';
import type { Stock } from '@/types';

export default function PortfolioPage() {
  const { portfolio, fundHoldings, cryptoHoldings, savingsPlans, setSelectedStock } = usePortfolio();
  const router = useRouter();

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    router.push('/');
  }

  return (
    <>
      <Header onStockSelect={handleStockSelect} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        <div className="grid grid-cols-1 gap-6">
          <Portfolio portfolio={portfolio} fundHoldings={fundHoldings} cryptoHoldings={cryptoHoldings} savingsPlans={savingsPlans} onStockSelect={handleStockSelect} />
        </div>
      </main>
    </>
  );
}

    