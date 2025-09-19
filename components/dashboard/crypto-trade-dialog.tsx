
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Cryptocurrency } from '@/types';
import { cn } from '@/lib/utils';
import type { TradeType } from '@/context/portfolio-context';
import { useToast } from '@/hooks/use-toast';
import { usePortfolio } from '@/context/portfolio-context';
import Image from 'next/image';


type CryptoTradeDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  crypto: Cryptocurrency;
  tradeType: TradeType;
  onTrade: (crypto: Cryptocurrency, amount: number, tradeType: TradeType) => boolean;
};

export function CryptoTradeDialog({
  isOpen,
  onOpenChange,
  crypto,
  tradeType,
  onTrade,
}: CryptoTradeDialogProps) {
  const [amount, setAmount] = useState('0.01');
  const [total, setTotal] = useState(0);
  const { toast } = useToast();
  const { cryptoHoldings, walletBalance } = usePortfolio();

  useEffect(() => {
    if (crypto) {
        const numAmount = parseFloat(amount) || 0;
        setTotal(numAmount * crypto.price);
    }
  }, [amount, crypto]);
  
  useEffect(() => {
    if (isOpen && crypto) {
      setAmount('0.01');
      setTotal(0.01 * crypto.price);
    }
  }, [isOpen, crypto, tradeType]);
  
  if (!crypto || !isOpen) return null;

  const handleTrade = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
         toast({
            variant: "destructive",
            title: "Invalid Quantity",
            description: "Please enter a valid amount.",
        });
        return;
    }

    const success = onTrade(crypto, numAmount, tradeType);
    if (success) {
      toast({
        title: `${tradeType === 'buy' ? 'Purchase' : 'Sale'} Successful`,
        description: `You ${tradeType} ${numAmount} ${crypto.symbol}.`,
      });
      onOpenChange(false);
    } else {
        const existingHolding = cryptoHoldings.find(h => h.symbol === crypto.symbol);
        if (tradeType === 'buy' && walletBalance < total) {
             toast({
                variant: "destructive",
                title: "Purchase Failed",
                description: `Insufficient funds in your wallet.`,
            });
        }
        else if (tradeType === 'sell' && (!existingHolding || existingHolding.amount < numAmount)) {
             toast({
              variant: "destructive",
              title: "Sale Failed",
              description: `You don't have enough ${crypto.symbol} to sell. You only have ${existingHolding?.amount || 0}.`,
            });
        }
        else {
            toast({
                variant: "destructive",
                title: "Trade Failed",
                description: "An unexpected error occurred.",
            });
        }
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize flex items-center gap-2">
            {tradeType} {crypto.symbol}
          </DialogTitle>
          <DialogDescription>
            {crypto.name} - ₹{crypto.price.toLocaleString('en-IN')} per coin
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="col-span-3"
              min="0"
              step="0.001"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Total</Label>
            <div className="col-span-3 font-bold text-lg">
              ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
           <div className="grid grid-cols-4 items-center gap-4 mt-2 border-t pt-4">
            <Label className="text-right">Wallet Balance</Label>
            <div className="col-span-3 text-sm text-muted-foreground">
              ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleTrade} className={cn(tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')}>
            Confirm {tradeType === 'buy' ? 'Purchase' : 'Sale'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
