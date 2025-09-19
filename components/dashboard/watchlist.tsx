
"use client";

import React from 'react';
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
import { usePortfolio } from '@/context/portfolio-context';
import { List, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { Stock } from '@/types';


type WatchlistProps = {
  onStockSelect: (stock: Stock) => void;
};

export function Watchlist({ onStockSelect }: WatchlistProps) {
  const { stocks, watchlist, removeFromWatchlist } = usePortfolio();
  
  const watchlistStocks = React.useMemo(() => {
    return watchlist.map(symbol => stocks.find(s => s.symbol === symbol)).filter((s): s is Stock => !!s);
  }, [watchlist, stocks]);

  const handleSelect = (stock: Stock) => {
    if (onStockSelect) {
      onStockSelect(stock);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className='flex items-center gap-2'>
                <List className="h-5 w-5 text-primary" />
                <CardTitle>My Watchlist</CardTitle>
            </div>
        </div>
        <CardDescription>Your hand-picked stocks to watch.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        <ScrollArea className="h-full">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>% Change</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {watchlistStocks.map((stock) => {
                    const isUp = stock.changePercent >= 0;
                    return (
                        <TableRow key={stock.symbol} >
                            <TableCell onClick={() => handleSelect(stock)} className="font-medium cursor-pointer">{stock.symbol}</TableCell>
                            <TableCell onClick={() => handleSelect(stock)} className="cursor-pointer">₹{stock.price.toFixed(2)}</TableCell>
                            <TableCell
                                onClick={() => handleSelect(stock)}
                                className={cn('cursor-pointer', isUp ? 'text-green-600' : 'text-red-600')}
                            >
                                {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromWatchlist(stock.symbol)}>
                                    <XCircle className="h-4 w-4 text-muted-foreground" />
                                    <span className="sr-only">Remove from watchlist</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
