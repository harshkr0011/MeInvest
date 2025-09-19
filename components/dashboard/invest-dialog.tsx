

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
import { useToast } from '@/hooks/use-toast';
import type { MutualFund } from '@/lib/funds-data';
import { usePortfolio } from '@/context/portfolio-context';

type InvestDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  fund: MutualFund;
  onSubmit: (fund: MutualFund, amount: number) => boolean;
};

export function InvestDialog({
  isOpen,
  onOpenChange,
  fund,
  onSubmit,
}: InvestDialogProps) {
  const [amount, setAmount] = useState(5000);
  const { toast } = useToast();
  const { walletBalance } = usePortfolio();

  useEffect(() => {
    if (isOpen) {
      setAmount(5000);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (amount < 100) {
        toast({
            variant: "destructive",
            title: "Invalid Amount",
            description: "Minimum investment amount is ₹100.",
        });
        return;
    }
    if (walletBalance < amount) {
        toast({
            variant: "destructive",
            title: "Investment Failed",
            description: "Insufficient funds in your wallet.",
        });
        return;
    }
    const success = onSubmit(fund, amount);
    if(success) {
        onOpenChange(false);
    } else {
         toast({
            variant: "destructive",
            title: "Investment Failed",
            description: "Could not process your investment. Please try again.",
        });
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
     if (value > 0) {
        setAmount(value);
    } else if (e.target.value === '') {
        setAmount(0);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invest in {fund.name}</DialogTitle>
          <DialogDescription>
            Enter the amount you would like to invest.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (₹)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="col-span-3"
              min="100"
              step="100"
            />
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
          <Button onClick={handleSubmit}>
            Confirm Investment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
