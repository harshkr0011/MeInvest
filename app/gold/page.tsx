
"use client";

import React, { useState, useMemo } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Header } from '@/components/dashboard/header';
import { usePortfolio } from '@/context/portfolio-context';
import type { Stock } from '@/types';
import { useRouter } from 'next/navigation';
import { investmentOptions } from '@/lib/gold-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Award, Gem, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function generateGoldPriceHistory(basePrice: number, days: number): { date: string, price: number }[] {
  const history = [];
  const endDate = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (days - 1 - i));
    const pseudoRandom = (Math.sin(date.getTime()) + 1) / 2;
    const fluctuation = (pseudoRandom - 0.5) * basePrice * 0.05; // Fluctuation of +/- 5%
    const trend = (i / days - 0.5) * basePrice * 0.1; // Trend component
    const price = basePrice + fluctuation + trend;
    history.push({
      date: format(date, 'HH:mm:ss'),
      price: parseFloat(price.toFixed(2)),
    });
  }
  return history;
}


export default function GoldPage() {
  const { setSelectedStock, walletBalance, goldBalanceGrams, transactGold, goldData } = usePortfolio();
  const router = useRouter();
  const { toast } = useToast();
  const [grams, setGrams] = useState('1');
  
  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    router.push('/');
  };
  
  const goldPriceHistory = useMemo(() => generateGoldPriceHistory(goldData.pricePerGram * 10, 30), [goldData.pricePerGram]);


  const handleTransaction = (type: 'buy' | 'sell') => {
    const amountGrams = parseFloat(grams);
    if (isNaN(amountGrams) || amountGrams <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid number of grams.",
      });
      return;
    }
    
    const success = transactGold(amountGrams, type);

    if (success) {
      toast({
        title: `Transaction Successful`,
        description: `You have ${type === 'buy' ? 'bought' : 'sold'} ${amountGrams} gram(s) of gold.`,
      });
      setGrams('1');
    } else {
        if (type === 'buy' && walletBalance < amountGrams * goldData.pricePerGram) {
             toast({
                variant: "destructive",
                title: "Purchase Failed",
                description: `Insufficient funds in your wallet.`,
            });
        } else if (type === 'sell' && goldBalanceGrams < amountGrams) {
            toast({
                variant: "destructive",
                title: "Sale Failed",
                description: `You do not have enough gold to sell.`,
            });
        }
    }
  };

  const totalCost = useMemo(() => {
    const numGrams = parseFloat(grams) || 0;
    return numGrams * goldData.pricePerGram;
  }, [grams, goldData.pricePerGram]);

  const currentGoldValue = useMemo(() => {
    return goldBalanceGrams * goldData.pricePerGram;
  }, [goldBalanceGrams, goldData.pricePerGram]);
  
  return (
    <>
      <Header onStockSelect={handleStockSelect} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Invest in Gold</h1>
          <p className="text-muted-foreground">The timeless asset for a stable portfolio.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-yellow-500" />
                        <CardTitle>Gold Price Trend (24K)</CardTitle>
                        </div>
                        <div className="flex justify-between items-baseline">
                           <CardDescription>Price for 10 grams in INR.</CardDescription>
                           <p className="text-2xl font-bold text-yellow-500">₹{(goldData.pricePerGram * 10).toLocaleString('en-IN')}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                            data={goldPriceHistory}
                            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                            >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                            <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
                            <YAxis domain={['dataMin - 50', 'dataMax + 50']} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                            <Tooltip
                                content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                    <div className="rounded-lg border bg-background/80 backdrop-blur p-2 shadow-sm">
                                        <div className="font-bold text-foreground">
                                            ₹{payload[0].value?.toLocaleString('en-IN')}
                                        </div>
                                        <div className="text-xs uppercase text-muted-foreground">
                                            {payload[0].payload.date}
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
                                stroke="hsl(48, 95%, 52%)"
                                dot={false}
                            />
                            </LineChart>
                        </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Gold Holding</CardTitle>
                        <CardDescription>
                            Current value of your gold investment.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">Balance</p>
                            <p className="font-bold">{goldBalanceGrams.toFixed(4)} grams</p>
                        </div>
                         <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-muted-foreground">Current Value</p>
                            <p className="font-bold text-lg">₹{currentGoldValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            <CardTitle>Buy or Sell Gold</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="grams">Grams</Label>
                            <Input id="grams" type="number" value={grams} onChange={e => setGrams(e.target.value)} placeholder="e.g., 10" />
                        </div>
                        <div className="rounded-md border bg-muted p-3 text-center">
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="text-xl font-bold">₹{totalCost.toLocaleString('en-IN')}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 gap-4">
                        <Button onClick={() => handleTransaction('buy')} className="bg-green-600 hover:bg-green-700">Buy</Button>
                        <Button onClick={() => handleTransaction('sell')} variant="destructive">Sell</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>

        <div className="space-y-4 pt-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Ways to Invest in Gold</h2>
                <p className="text-muted-foreground">Explore different methods to add gold to your portfolio.</p>
            </div>
            <div className="lg:hidden">
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent>
                  {investmentOptions.map((option, index) => (
                    <CarouselItem key={index} className="basis-full">
                      <div className="h-full">
                        <Card key={option.title} className="flex flex-col h-full">
                          <CardHeader className="flex flex-col items-start gap-4">
                            <div className={cn("p-3 rounded-full flex-shrink-0", option.color)}>
                              {option.icon === 'Award' && <Award className="h-6 w-6 text-white" />}
                              {option.icon === 'Gem' && <Gem className="h-6 w-6 text-white" />}
                              {option.icon === 'ShoppingCart' && <ShoppingCart className="h-6 w-6 text-white" />}
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-lg leading-tight">{option.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {investmentOptions.map(option => (
                <Card key={option.title} className="flex flex-col h-full">
                  <CardHeader className="flex flex-col items-start gap-4">
                    <div className={cn("p-3 rounded-full flex-shrink-0", option.color)}>
                      {option.icon === 'Award' && <Award className="h-6 w-6 text-white" />}
                      {option.icon === 'Gem' && <Gem className="h-6 w-6 text-white" />}
                      {option.icon === 'ShoppingCart' && <ShoppingCart className="h-6 w-6 text-white" />}
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{option.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
        </div>
      </main>
    </>
  );
}
