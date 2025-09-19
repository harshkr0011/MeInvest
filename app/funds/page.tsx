

"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/dashboard/header';
import { usePortfolio } from '@/context/portfolio-context';
import { useRouter } from 'next/navigation';
import type { Stock } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Wallet, ArrowUp, TrendingUp, Zap, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type MutualFund } from '@/lib/funds-data';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';
import { InvestDialog } from '@/components/dashboard/invest-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function FundsPage() {
  const { setSelectedStock, fundHoldings, investInFund, sellFund, mutualFunds } = usePortfolio();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isInvestDialogOpen, setInvestDialogOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<MutualFund | null>(null);
  
  const { totalInvested, totalCurrentValue } = useMemo(() => {
    let invested = 0;
    let currentValue = 0;
    fundHoldings.forEach(holding => {
      const fundData = mutualFunds.find(f => f.id === holding.id);
      invested += holding.investedAmount;
      // Simplified current value calculation
      currentValue += holding.units * (fundData?.nav || holding.avgNav); 
    });
    return { totalInvested: invested, totalCurrentValue: currentValue };
  }, [fundHoldings, mutualFunds]);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    router.push('/');
  }

  const handleInvestClick = (fund: MutualFund) => {
    setSelectedFund(fund);
    setInvestDialogOpen(true);
  };
  
  const handleInvestmentSubmit = (fund: MutualFund, amount: number): boolean => {
    const success = investInFund(fund, amount);
    if (success) {
        toast({
            title: "Investment Successful",
            description: `You have successfully invested ₹${amount.toLocaleString()} in ${fund.name}.`,
        });
        setInvestDialogOpen(false);
        return true;
    }
    // Error toast is handled in the dialog
    return false;
  }

  const handleSellFund = (holdingId: string) => {
    sellFund(holdingId);
    toast({
        variant: "destructive",
        title: "Investment Sold",
        description: "Your fund holding has been sold.",
    });
  };

  const riskColor = (risk: 'Low' | 'Medium' | 'High') => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'High': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredFunds = useMemo(() => {
    if (!debouncedSearchTerm) return mutualFunds;
    
    const lowercasedTerm = debouncedSearchTerm.toLowerCase();
    
    return mutualFunds.filter(fund => 
        fund.name.toLowerCase().includes(lowercasedTerm) ||
        fund.category.toLowerCase().includes(lowercasedTerm) ||
        fund.risk.toLowerCase().includes(lowercasedTerm)
    );
  }, [debouncedSearchTerm, mutualFunds]);


  return (
    <>
      <Header onStockSelect={handleStockSelect} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Mutual Funds</h1>
                <p className="text-muted-foreground">Explore and invest in a wide range of mutual funds.</p>
            </div>
             <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search funds by name, category, or risk..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {fundHoldings.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <CardTitle>My Investments</CardTitle>
              </div>
              <div className="flex justify-between items-baseline">
                <CardDescription>Your mutual fund performance.</CardDescription>
                <p className="text-2xl font-bold">₹{totalCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund Name</TableHead>
                    <TableHead className="text-right">Invested</TableHead>
                    <TableHead className="text-right">Current Value</TableHead>
                    <TableHead className="text-right">P&L</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fundHoldings.map(holding => {
                    const fundData = mutualFunds.find(f => f.id === holding.id);
                    // This is a simplified valuation
                    const currentValue = holding.units * (fundData?.nav || holding.avgNav);
                    const pnl = currentValue - holding.investedAmount;
                    const isUp = pnl >= 0;

                    return (
                      <TableRow key={holding.id}>
                        <TableCell className="font-medium">{holding.name}</TableCell>
                        <TableCell className="text-right">₹{holding.investedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right">₹{currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className={cn('text-right', isUp ? 'text-green-500' : 'text-red-500')}>
                          {isUp ? '+' : ''}₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will sell all units of {holding.name}. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleSellFund(holding.id)} className="bg-red-600 hover:bg-red-700">Sell All</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFunds.map(fund => (
                <Card key={fund.id} className="flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <CardTitle className="text-lg leading-tight">{fund.name}</CardTitle>
                             <Badge variant="outline" className={cn("shrink-0", riskColor(fund.risk))}>{fund.risk}</Badge>
                        </div>
                        <CardDescription>{fund.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{fund.description}</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4" />1Y Return</span>
                                <span className={cn("font-semibold", fund.return1Y >= 0 ? "text-green-500" : "text-red-500")}>{fund.return1Y.toFixed(2)}%</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground flex items-center gap-2"><ArrowUp className="h-4 w-4" /> 3Y Return</span>
                                <span className={cn("font-semibold", fund.return3Y >= 0 ? "text-green-500" : "text-red-500")}>{fund.return3Y.toFixed(2)}%</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleInvestClick(fund)}>
                            <Zap className="mr-2" /> Invest Now
                        </Button>
                    </CardFooter>
                </Card>
            ))}
             {filteredFunds.length === 0 && (
                <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No funds found for your search.</p>
                </div>
            )}
        </div>
      </main>
      {selectedFund && (
        <InvestDialog 
            isOpen={isInvestDialogOpen}
            onOpenChange={setInvestDialogOpen}
            fund={selectedFund}
            onSubmit={handleInvestmentSubmit}
        />
      )}
    </>
  );
}
