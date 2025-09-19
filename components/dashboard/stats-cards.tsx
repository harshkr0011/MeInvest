
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MarketIndex } from '@/types';
import { marketIndices as initialMarketIndices } from '@/lib/data';

export function StatsCards() {
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>(initialMarketIndices);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketIndices(indices => indices.map(index => {
        const changePercent = (Math.random() - 0.49) * 0.5; // smaller, more frequent changes
        const change = (index.value * changePercent) / 100;
        const newValue = index.value + change;

        return {
          ...index,
          value: newValue,
          change: change,
          changePercent: changePercent,
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {marketIndices.map((index) => {
        const isUp = index.changePercent >= 0;
        return (
          <Card key={index.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{index.name}</CardTitle>
               {isUp ? <ArrowUp className="h-4 w-4 text-green-500" /> : <ArrowDown className="h-4 w-4 text-red-500" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{index.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p
                className={cn(
                  'text-xs',
                  isUp ? 'text-green-600' : 'text-red-600'
                )}
              >
                {isUp ? '+' : ''}{index.change.toFixed(2)} ({isUp ? '+' : ''}{index.changePercent.toFixed(2)}%)
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
