
"use client";

import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Wallet, Briefcase, Gem, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PortfolioHolding, Stock, FundHolding, CryptoHolding, Cryptocurrency, SavingsPlan } from '@/types';
import { usePortfolio } from '@/context/portfolio-context';
import { Separator } from '@/components/ui/separator';

type PortfolioProps = {
  portfolio: PortfolioHolding[];
  fundHoldings: FundHolding[];
  cryptoHoldings?: CryptoHolding[];
  savingsPlans: SavingsPlan[];
  onStockSelect?: (stock: Stock) => void;
};

export function Portfolio({ portfolio, fundHoldings, cryptoHoldings = [], savingsPlans, onStockSelect }: PortfolioProps) {
  const { stocks, cryptos, goldBalanceGrams, mutualFunds, goldData } = usePortfolio();
  
  const { totalValue, totalStockPnl, totalFundPnl, sortedPortfolio, totalCryptoPnl, sortedCryptoPortfolio, goldValue } = useMemo(() => {
    let totalStockValue = 0;
    let totalStockInvested = 0;
    
    const portfolioWithCurrentValue = portfolio.map(holding => {
        const stockData = stocks.find(s => s.symbol === holding.symbol);
        const currentPrice = stockData ? stockData.price : holding.currentPrice;
        const currentValue = holding.shares * currentPrice;
        totalStockValue += currentValue;
        totalStockInvested += (holding.shares * holding.avgPrice);
        return { ...holding, currentValue };
    });

    const sorted = portfolioWithCurrentValue.sort((a, b) => b.currentValue - a.currentValue);

    let totalFundValue = 0;
    let totalFundInvested = 0;
    fundHoldings.forEach((holding) => {
      const fundData = mutualFunds.find(f => f.id === holding.id);
      totalFundValue += (holding.units * (fundData?.nav || holding.avgNav));
      totalFundInvested += holding.investedAmount;
    });
    
    let totalCryptoValue = 0;
    let totalCryptoInvested = 0;
    const cryptoPortfolioWithCurrentValue = cryptoHoldings.map(holding => {
        const cryptoData = cryptos.find(c => c.symbol === holding.symbol);
        const currentPrice = cryptoData ? cryptoData.price : holding.avgPrice;
        const currentValue = holding.amount * currentPrice;
        totalCryptoValue += currentValue;
        totalCryptoInvested += (holding.amount * holding.avgPrice);
        return { ...holding, currentValue };
    });
    const sortedCrypto = cryptoPortfolioWithCurrentValue.sort((a, b) => b.currentValue - a.currentValue);

    const currentGoldValue = goldBalanceGrams * goldData.pricePerGram;

    return { 
      totalValue: totalStockValue + totalFundValue + totalCryptoValue + currentGoldValue,
      totalStockPnl: totalStockValue - totalStockInvested,
      totalFundPnl: totalFundValue - totalFundInvested,
      totalCryptoPnl: totalCryptoValue - totalCryptoInvested,
      sortedPortfolio: sorted,
      sortedCryptoPortfolio: sortedCrypto,
      goldValue: currentGoldValue,
    };
  }, [portfolio, fundHoldings, cryptoHoldings, stocks, cryptos, goldBalanceGrams, mutualFunds, goldData]);

  const handleSelect = (holding: PortfolioHolding) => {
    if (onStockSelect) {
      const stock = stocks.find(s => s.symbol === holding.symbol);
      if (stock) {
        onStockSelect(stock);
      }
    }
  };
  
  const handleCryptoSelect = (holding: CryptoHolding) => {
    if (onStockSelect) {
        const crypto = cryptos.find(c => c.symbol === holding.symbol);
        if (crypto) {
            onStockSelect(crypto as Stock);
        }
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <CardTitle>Portfolio</CardTitle>
        </div>
        <div className="flex justify-between items-baseline">
            <CardDescription>Your investment performance.</CardDescription>
             <p className="text-2xl font-bold">₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        <ScrollArea className="h-full">
          {sortedPortfolio.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stocks</TableHead>
                  <TableHead>Avg. Price</TableHead>
                  <TableHead className="text-right">Today's P&L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPortfolio.map((holding) => {
                  const stockData = stocks.find(s => s.symbol === holding.symbol);
                  if (!stockData) return null;

                  const pnl = (stockData.price - holding.avgPrice) * holding.shares;
                  const isUp = pnl >= 0;

                  return (
                    <TableRow key={holding.symbol} onClick={() => handleSelect(holding)} className={onStockSelect ? 'cursor-pointer' : ''}>
                      <TableCell className="font-medium">
                        <div>{holding.symbol}</div>
                        <div className="text-xs text-muted-foreground">{holding.shares} shares</div>
                      </TableCell>
                      <TableCell>₹{holding.avgPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className={cn('text-right', isUp ? 'text-green-500' : 'text-red-500')}>
                        {isUp ? '+' : ''}₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {fundHoldings.length > 0 && <Separator className="my-2" />}

          {fundHoldings.length > 0 && (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mutual Funds</TableHead>
                        <TableHead className="text-right">P&L</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fundHoldings.map(holding => {
                         const fundData = mutualFunds.find(f => f.id === holding.id);
                         const currentValue = holding.units * (fundData?.nav || holding.avgNav);
                         const pnl = currentValue - holding.investedAmount;
                         const isUp = pnl >= 0;

                         return (
                             <TableRow key={holding.id}>
                                <TableCell className="font-medium">
                                  <div>{holding.name}</div>
                                  <div className="text-xs text-muted-foreground">₹{currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                                </TableCell>
                                <TableCell className={cn('text-right', isUp ? 'text-green-500' : 'text-red-500')}>
                                     {isUp ? '+' : ''}₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </TableCell>
                             </TableRow>
                         )
                    })}
                </TableBody>
            </Table>
          )}
          
          {sortedCryptoPortfolio.length > 0 && <Separator className="my-2" />}
          
          {sortedCryptoPortfolio.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crypto</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCryptoPortfolio.map((holding) => {
                  const pnl = (holding.currentValue) - (holding.amount * holding.avgPrice);
                  const isUp = pnl >= 0;
                  return (
                    <TableRow key={holding.symbol} onClick={() => handleCryptoSelect(holding)} className="cursor-pointer">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                           <div>
                                {holding.name}
                                <div className="text-xs text-muted-foreground">{holding.amount.toFixed(6)} {holding.symbol}</div>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell className={cn('text-right', isUp ? 'text-green-500' : 'text-red-500')}>
                        {isUp ? '+' : ''}₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          
          {goldBalanceGrams > 0 && <Separator className="my-2" />}

          {goldBalanceGrams > 0 && (
             <div className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2 px-2">Gold</h4>
                <div className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500/10 p-2 rounded-full">
                           <Gem className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                            <p className="font-semibold">Digital Gold</p>
                            <p className="text-xs text-muted-foreground">{goldBalanceGrams.toFixed(4)} grams</p>
                        </div>
                    </div>
                    <p className="font-semibold text-base">
                        ₹{goldValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
          )}

          {savingsPlans.length > 0 && <Separator className="my-2" />}

          {savingsPlans.length > 0 && (
             <div className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2 px-2">Saving Plans</h4>
                 {savingsPlans.map(plan => (
                    <div key={plan.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500/10 p-2 rounded-full">
                            <PiggyBank className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="font-semibold">{plan.name}</p>
                                <p className="text-xs text-muted-foreground">For {plan.stockSymbol}</p>
                            </div>
                        </div>
                        <p className="font-semibold text-base">
                            ₹{plan.amount.toLocaleString('en-IN')}/mo
                        </p>                    </div>
                 ))}
            </div>
          )}
          
          {(portfolio.length === 0 && fundHoldings.length === 0 && cryptoHoldings.length === 0 && goldBalanceGrams === 0 && savingsPlans.length === 0) && (
             <div className="text-center p-8 text-muted-foreground">No assets in portfolio.</div>
          )}

        </ScrollArea>
      </CardContent>
    </Card>
  );
}
