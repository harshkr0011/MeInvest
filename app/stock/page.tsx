
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/dashboard/header';
import { usePortfolio } from '@/context/portfolio-context';
import type { Stock } from '@/types';
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
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

type SortKey = keyof Stock | '';
type SortDirection = 'asc' | 'desc';

export default function StockPage() {
  const { stocks, setSelectedStock } = usePortfolio();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortKey, setSortKey] = useState<SortKey>('marketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
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

  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks;
    if (debouncedSearchTerm) {
      filtered = stocks.filter(stock =>
        stock.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey as keyof Stock];
        const bValue = b[sortKey as keyof Stock];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            if (sortKey === 'marketCap' || sortKey === 'volume') {
                const convertToNumber = (val: string) => {
                    const num = parseFloat(val.slice(0,-1));
                    const multiplier = val.slice(-1).toUpperCase();
                    if (multiplier === 'T') return num * 1e12;
                    if (multiplier === 'M') return num * 1e6;
                    return num;
                }
                const numA = convertToNumber(aValue);
                const numB = convertToNumber(bValue);
                return sortDirection === 'asc' ? numA - numB : numB - numA;
            }
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if(typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }

    return filtered;
  }, [stocks, debouncedSearchTerm, sortKey, sortDirection]);

  return (
    <>
      <Header onStockSelect={handleStockSelect} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Indian Stock Market</h1>
                <p className="text-muted-foreground">Explore all listed stocks.</p>
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
                            <TableHead className="px-2 md:px-4">
                                <Button variant="ghost" onClick={() => handleSort('symbol')}>
                                    Symbol {getSortIndicator('symbol')}
                                </Button>
                            </TableHead>
                            <TableHead className="hidden lg:table-cell px-2 md:px-4">
                                <Button variant="ghost" onClick={() => handleSort('name')}>
                                    Name {getSortIndicator('name')}
                                </Button>
                            </TableHead>
                            <TableHead className="text-right px-2 md:px-4">
                                <Button variant="ghost" onClick={() => handleSort('price')}>
                                    Price {getSortIndicator('price')}
                                </Button>
                            </TableHead>
                            <TableHead className="text-right px-2 md:px-4">
                                <Button variant="ghost" onClick={() => handleSort('changePercent')}>
                                    % Change {getSortIndicator('changePercent')}
                                </Button>
                            </TableHead>
                            <TableHead className="hidden lg:table-cell text-right px-2 md:px-4">
                                <Button variant="ghost" onClick={() => handleSort('volume')}>
                                    Volume {getSortIndicator('volume')}
                                </Button>
                            </TableHead>
                            <TableHead className="hidden lg:table-cell text-right px-2 md:px-4">
                                <Button variant="ghost" onClick={() => handleSort('marketCap')}>
                                    Market Cap {getSortIndicator('marketCap')}
                                </Button>
                            </TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredAndSortedStocks.map((stock) => (
                            <TableRow key={stock.symbol} onClick={() => handleStockSelect(stock)} className="cursor-pointer">
                                <TableCell className="font-bold px-2 md:px-4">{stock.symbol}</TableCell>
                                <TableCell className="hidden lg:table-cell px-2 md:px-4">{stock.name}</TableCell>
                                <TableCell className="text-right px-2 md:px-4">₹{stock.price.toFixed(2)}</TableCell>
                                <TableCell className={cn("text-right px-2 md:px-4", stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500')}>
                                    {stock.changePercent.toFixed(2)}%
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-right px-2 md:px-4">{stock.volume}</TableCell>
                                <TableCell className="hidden lg:table-cell text-right px-2 md:px-4">{stock.marketCap}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                 </div>
                 {filteredAndSortedStocks.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                        No stocks found for "{debouncedSearchTerm}".
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </>
  );
}
