
"use client";

import { Header } from '@/components/dashboard/header';
import { usePortfolio } from '@/context/portfolio-context';
import type { Stock } from '@/types';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export default function WalletPage() {
  const { setSelectedStock, walletBalance, addFundsToWallet, walletTransactions } = usePortfolio();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    router.push('/');
  };
  
  const handleAddMoney = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        toast({
            variant: "destructive",
            title: "Invalid Amount",
            description: "Please enter a valid amount to add.",
        });
        return;
    }
    addFundsToWallet(numericAmount);
    toast({
        title: "Success!",
        description: `Successfully added ₹${numericAmount.toLocaleString()} to your wallet.`,
    });
    setAmount('');
  }

  return (
    <>
      <Header onStockSelect={handleStockSelect} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Wallet</h1>
            <p className="text-muted-foreground">Manage your funds and view transaction history.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Add Money to Wallet</CardTitle>
                    <CardDescription>Your current balance: <span className="font-bold text-lg text-foreground">₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (INR)</Label>
                        <Input 
                            id="amount" 
                            type="number" 
                            placeholder="Enter amount to add" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleAddMoney}>Add Money</Button>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Wallet History</CardTitle>
                    <CardDescription>Your recent wallet transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {walletTransactions.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {walletTransactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>{format(new Date(tx.date), "dd MMM, yyyy")}</TableCell>
                                        <TableCell className="capitalize text-green-500">{tx.type}</TableCell>
                                        <TableCell className="text-right font-medium">+ ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No wallet transactions yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
