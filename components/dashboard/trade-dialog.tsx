

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
import type { Stock } from '@/types';
import { cn } from '@/lib/utils';
import type { TradeType } from '@/context/portfolio-context';
import { useToast } from '@/hooks/use-toast';
import { usePortfolio } from '@/context/portfolio-context';


type TradeDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  stock: Stock;
  tradeType: TradeType;
  onTrade: (stock: Stock, shares: number, tradeType: TradeType, source?: 'stock' | 'savings-plan') => boolean;
};

export function TradeDialog({
  isOpen,
  onOpenChange,
  stock,
  tradeType,
  onTrade,
}: TradeDialogProps) {
  const [shares, setShares] = useState('1');
  const [total, setTotal] = useState(stock.price);
  const { toast } = useToast();
  const { portfolio, walletBalance } = usePortfolio();

  useEffect(() => {
    if (stock) {
        const numShares = parseInt(shares, 10) || 0;
        setTotal(numShares * stock.price);
    }
  }, [shares, stock]);
  
  // Reset state when dialog opens for a new stock or trade type
  useEffect(() => {
    if (isOpen && stock) {
      setShares('1');
      setTotal(stock.price);
    }
  }, [isOpen, stock, tradeType]);
  
  if (!stock) return null;

  const handleTrade = () => {
    const numShares = parseInt(shares, 10);
    if (isNaN(numShares) || numShares <= 0) {
         toast({
            variant: "destructive",
            title: "Invalid Quantity",
            description: "Please enter a valid number of shares.",
        });
        return;
    }

    const success = onTrade(stock, numShares, tradeType, 'stock');
    if (success) {
      if (tradeType === 'buy') {
        toast({
          title: "Purchase Successful",
          description: `You bought ${numShares} share(s) of ${stock.symbol}.`,
        });
      } else {
        toast({
          title: "Sale Successful",
          description: `You sold ${numShares} share(s) of ${stock.symbol}.`,
        });
      }
      onOpenChange(false);
    } else {
        const existingHolding = portfolio.find(h => h.symbol === stock.symbol);
        if (tradeType === 'buy' && walletBalance < total) {
             toast({
                variant: "destructive",
                title: "Purchase Failed",
                description: `Insufficient funds in your wallet.`,
            });
        }
        else if (tradeType === 'sell' && existingHolding && existingHolding.shares < numShares) {
             toast({
              variant: "destructive",
              title: "Sale Failed",
              description: `You don't have enough shares to sell. You only have ${existingHolding.shares}.`,
            });
        } else if (tradeType === 'sell' && !existingHolding) {
             toast({
                variant: "destructive",
                title: "Sale Failed",
                description: `You do not own any shares of ${stock.symbol}.`,
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
  
  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShares(e.target.value);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            {tradeType} {stock.symbol}
          </DialogTitle>
          <DialogDescription>
            {stock.name} - ₹{stock.price.toFixed(2)} per share
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shares" className="text-right">
              Shares
            </Label>
            <Input
              id="shares"
              type="number"
              value={shares}
              onChange={handleSharesChange}
              className="col-span-3"
              min="1"
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
