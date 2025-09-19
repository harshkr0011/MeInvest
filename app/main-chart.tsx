
"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Stock } from '@/types';
import type { TradeType } from '@/context/portfolio-context';
import { usePortfolio } from '@/context/portfolio-context';
import { PlusCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type MainChartProps = {
  stock: Stock;
  onTrade: (tradeType: TradeType) => void;
};

export function MainChart({ stock, onTrade }: MainChartProps) {
  const { addToWatchlist, isStockInWatchlist, removeFromWatchlist } = usePortfolio();
  const { toast } = useToast();
  const isUp = stock.changePercent >= 0;
  const inWatchlist = isStockInWatchlist(stock.symbol);

  const handleWatchlistClick = () => {
    if (!inWatchlist) {
      addToWatchlist(stock.symbol);
      toast({
        title: 'Added to Watchlist',
        description: `${stock.name} has been added to your watchlist.`,
      });
    } else {
      removeFromWatchlist(stock.symbol);
       toast({
        variant: "destructive",
        title: 'Removed from Watchlist',
        description: `${stock.name} has been removed from your watchlist.`,
      });
    }
  };

  const isCrypto = stock.type === 'crypto';

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              {isCrypto && (
                  <Image src={`/crypto-icons/${stock.symbol.toLowerCase()}.svg`} alt={`${stock.name} logo`} width={32} height={32} />
              )}
              <CardTitle className="text-2xl font-bold">{stock.symbol}</CardTitle>
            </div>
            <CardDescription>{stock.name}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">₹{stock.price.toLocaleString('en-IN',{minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className={cn('text-sm', isUp ? 'text-green-500' : 'text-red-500')}>
              {isUp ? '+' : ''}
              {stock.change.toFixed(2)} ({isUp ? '+' : ''}
              {stock.changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stock.history}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background/80 backdrop-blur p-2 shadow-sm">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex flex-col">
                             <span className="text-xs uppercase text-muted-foreground">
                              {payload[0].payload.date}
                            </span>
                            <span className="font-bold text-foreground">
                              ₹{payload[0].value?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                strokeWidth={2}
                stroke="hsl(var(--chart-1))"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button className="flex-1" onClick={() => onTrade('buy')}>Buy</Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleWatchlistClick}
        >
          {inWatchlist ? <CheckCircle2 className="mr-2" /> : <PlusCircle className="mr-2" />} 
          {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
        </Button>
        <Button className="flex-1" variant="outline" onClick={() => onTrade('sell')}>Sell</Button>
      </CardFooter>
    </Card>
  );
}

    