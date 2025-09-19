
"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/dashboard/header';
import { usePortfolio } from '@/context/portfolio-context';
import { useRouter } from 'next/navigation';
import type { Stock, UnifiedTransaction } from '@/types';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type AssetType = 'all' | 'stock' | 'crypto' | 'fund' | 'gold' | 'savings-plan';

export default function TransactionsPage() {
  const { allTransactions, setSelectedStock } = usePortfolio();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AssetType>('all');

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    router.push('/');
  };

  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') {
      return allTransactions;
    }
    return allTransactions.filter(tx => tx.assetType === activeTab);
  }, [allTransactions, activeTab]);

  const renderTransactionRow = (tx: UnifiedTransaction, index: number) => {
    const isBuy = tx.type === 'buy';
    
    let assetName = tx.name;
    let assetDetails = '';
    
    switch(tx.assetType) {
        case 'stock':
        case 'savings-plan':
            assetDetails = `${tx.quantity.toFixed(4)} shares`;
            break;
        case 'crypto':
            assetDetails = `${tx.quantity} coins`;
            break;
        case 'fund':
            assetDetails = `${tx.quantity.toFixed(4)} units`;
            break;
        case 'gold':
            assetName = 'Gold';
            assetDetails = `${tx.quantity} grams`;
            break;
    }


    return (
      <TableRow key={`${tx.id}-${index}`}>
        <TableCell className="font-medium whitespace-nowrap text-xs md:text-sm">{format(new Date(tx.date), 'dd MMM, yyyy')}</TableCell>
        <TableCell>
            <div className="font-medium text-sm md:text-base">{assetName}</div>
            <div className="text-xs text-muted-foreground">{tx.symbol}</div>
        </TableCell>
        <TableCell className="hidden sm:table-cell">
            <Badge variant="outline" className={cn(
                tx.assetType === 'stock' && 'border-sky-500 text-sky-500',
                tx.assetType === 'crypto' && 'border-orange-500 text-orange-500',
                tx.assetType === 'fund' && 'border-purple-500 text-purple-500',
                tx.assetType === 'gold' && 'border-yellow-500 text-yellow-500',
                tx.assetType === 'savings-plan' && 'border-blue-500 text-blue-500',
                'capitalize whitespace-nowrap'
            )}>{tx.assetType.replace('-', ' ')}</Badge>
        </TableCell>
        <TableCell>
          <Badge variant={isBuy ? 'default' : 'destructive'} className={cn(isBuy ? 'bg-green-600' : 'bg-red-600', 'capitalize')}>{tx.type}</Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
            <div className="whitespace-nowrap">{assetDetails}</div>
            <div className="text-xs text-muted-foreground whitespace-nowrap">@ ₹{tx.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </TableCell>
        <TableCell className="text-right font-medium whitespace-nowrap text-sm md:text-base">
            {isBuy ? '-' : '+'} ₹{tx.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <Header onStockSelect={handleStockSelect} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Transaction History</h1>
          <p className="text-muted-foreground">A complete record of all your buy and sell activities.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>
              You have made {allTransactions.length} transactions in total.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AssetType)}>
              <div className="overflow-x-auto pb-4">
                <TabsList className="flex-wrap h-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="stock">Stocks</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                  <TabsTrigger value="fund">Funds</TabsTrigger>
                  <TabsTrigger value="gold">Gold</TabsTrigger>
                  <TabsTrigger value="savings-plan">Savings</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-2 md:px-4">Date</TableHead>
                      <TableHead className="px-2 md:px-4">Asset</TableHead>
                      <TableHead className="hidden sm:table-cell px-2 md:px-4">Type</TableHead>
                      <TableHead className="px-2 md:px-4">Action</TableHead>
                      <TableHead className="hidden md:table-cell px-2 md:px-4">Details</TableHead>
                      <TableHead className="text-right px-2 md:px-4">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map(renderTransactionRow)
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No transactions in this category.
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
