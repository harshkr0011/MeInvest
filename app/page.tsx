
"use client";

import React, { useState } from 'react';

import { Header } from '@/components/dashboard/header';
import { MainChart } from '@/components/dashboard/main-chart';
import { Portfolio } from '@/components/dashboard/portfolio';
import { Watchlist } from '@/components/dashboard/watchlist';
import { NewsFeed } from '@/components/dashboard/news-feed';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { AiTrendTool } from '@/components/dashboard/ai-trend-tool';

import type { Cryptocurrency, Stock } from '@/types';
import { TradeDialog } from '@/components/dashboard/trade-dialog';
import { usePortfolio, TradeType } from '@/context/portfolio-context';
import { useRouter } from 'next/navigation';
import { CryptoTradeDialog } from '@/components/dashboard/crypto-trade-dialog';


export default function Home() {
  const { portfolio, fundHoldings, cryptoHoldings, savingsPlans, handleTrade, handleCryptoTrade, selectedStock, setSelectedStock } = usePortfolio();
  const router = useRouter();

  const [isTradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [isCryptoTradeDialogOpen, setCryptoTradeDialogOpen] = useState(false);
  const [tradeType, setTradeType] = useState<TradeType>('buy');

  const openTradeDialog = (type: TradeType) => {
    if (selectedStock.type === 'crypto') {
        setTradeType(type);
        setCryptoTradeDialogOpen(true);
    } else {
        setTradeType(type);
        setTradeDialogOpen(true);
    }
  };
  
  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    router.push('/');
  };


  return (
    <>
        <Header onStockSelect={handleStockSelect} />
        <main className="flex-1 space-y-6 p-4 md:p-6">
            <StatsCards />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                <MainChart stock={selectedStock} onTrade={openTradeDialog} />
                </div>
                <div className="lg:col-span-1">
                <Portfolio portfolio={portfolio} fundHoldings={fundHoldings} cryptoHoldings={cryptoHoldings} savingsPlans={savingsPlans} onStockSelect={setSelectedStock}/>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-1 md:col-span-1">
                    <Watchlist onStockSelect={handleStockSelect} />
                </div>
                <div className="lg:col-span-1 md:col-span-1">
                    <NewsFeed />
                </div>
                <div className="lg:col-span-1 md:col-span-2 lg:col-span-1">
                    <AiTrendTool />
                </div>
            </div>
        </main>
      <TradeDialog
        isOpen={isTradeDialogOpen}
        onOpenChange={setTradeDialogOpen}
        stock={selectedStock}
        tradeType={tradeType}
        onTrade={handleTrade}
      />
      <CryptoTradeDialog
        isOpen={isCryptoTradeDialogOpen}
        onOpenChange={setCryptoTradeDialogOpen}
        crypto={selectedStock as Cryptocurrency}
        tradeType={tradeType}
        onTrade={handleCryptoTrade}
      />
    </>
  );
}
