
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/dashboard/header';
import { usePortfolio } from '@/context/portfolio-context';
import type { Cryptocurrency, Stock } from '@/types';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Search } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

type SortKey = keyof Cryptocurrency | '';
type SortDirection = 'asc' | 'desc';

export default function CryptocurrencyPage() {
  const { cryptos, setSelectedStock } = usePortfolio();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortKey, setSortKey] = useState<SortKey>('marketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // The app uses a single selected item on the dashboard, we'll adapt crypto to it
  const handleCryptoSelect = (crypto: Cryptocurrency) => {
    const adaptedStock: Stock = {
        ...crypto,
        history: crypto.history.map(h => ({ date: h.date, price: h.price })),
        change: crypto.change,
        volume: crypto.volume,
    };
    setSelectedStock(adaptedStock);
    router.push('/');
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };
  
  const getSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'desc' ? ' ▼' : ' ▲';
  }

  const filteredAndSortedCryptos = useMemo(() => {
    let filtered = cryptos;
    if (debouncedSearchTerm) {
      filtered = cryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey as keyof Cryptocurrency];
        const bValue = b[sortKey as keyof Cryptocurrency];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    return filtered;
  }, [cryptos, debouncedSearchTerm, sortKey, sortDirection]);

  return (
    <>
      <Header onStockSelect={(stock) => {
          setSelectedStock(stock);
          router.push('/');
      }} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Cryptocurrency Market</h1>
                <p className="text-muted-foreground">Explore the top cryptocurrencies.</p>
            </div>
             <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search by name or symbol..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('name')}>
                                    Name {getSortIndicator('name')}
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort('price')}>
                                    Price {getSortIndicator('price')}
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort('changePercent')}>
                                    24h % {getSortIndicator('changePercent')}
                                </Button>
                            </TableHead>
                            <TableHead className="hidden lg:table-cell text-right">
                                <Button variant="ghost" onClick={() => handleSort('marketCap')}>
                                    Market Cap {getSortIndicator('marketCap')}
                                </Button>
                            </TableHead>
                            <TableHead className="hidden lg:table-cell text-right">
                                <Button variant="ghost" onClick={() => handleSort('volume')}>
                                    Volume (24h) {getSortIndicator('volume')}
                                </Button>
                            </TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredAndSortedCryptos.map((crypto) => (
                            <TableRow key={crypto.symbol} onClick={() => handleCryptoSelect(crypto)} className="cursor-pointer">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            {crypto.name}
                                            <span className="text-muted-foreground ml-2">{crypto.symbol}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono">₹{crypto.price.toLocaleString('en-IN')}</TableCell>
                                <TableCell className={cn("text-right", crypto.changePercent >= 0 ? 'text-green-500' : 'text-red-500')}>
                                    {crypto.changePercent.toFixed(2)}%
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-right font-mono">₹{(crypto.marketCap / 1_00_00_000).toLocaleString('en-IN')} Cr</TableCell>
                                <TableCell className="hidden lg:table-cell text-right font-mono">₹{(crypto.volume / 1_00_00_000).toLocaleString('en-IN')} Cr</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
                 {filteredAndSortedCryptos.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                        No cryptocurrencies found for "{debouncedSearchTerm}".
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </>
  );
}
