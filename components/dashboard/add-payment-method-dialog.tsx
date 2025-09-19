
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Landmark, Wallet } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import type { PaymentMethod } from '@/types';

export type PaymentMethodData = Omit<PaymentMethod, 'id'>;

type AddPaymentMethodDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: PaymentMethodData) => void;
};

const indianBanks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Punjab National Bank",
    "Axis Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Kotak Mahindra Bank",
];

export function AddPaymentMethodDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: AddPaymentMethodDialogProps) {
  const [activeTab, setActiveTab] = useState("card");
  const { toast } = useToast();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('card');
      setCardNumber('');
      setExpiry('');
      setCvc('');
      setCardName('');
      setUpiId('');
      setSelectedBank('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    let data: PaymentMethodData | null = null;
    
    if (activeTab === 'card') {
      if (!cardNumber || !expiry || !cvc || !cardName) {
        toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill all card details.' });
        return;
      }
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        toast({ variant: 'destructive', title: 'Invalid Card Number', description: 'Card number must be 16 digits.' });
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        toast({ variant: 'destructive', title: 'Invalid Expiry Date', description: 'Use MM/YY format.' });
        return;
      }
      if (!/^\d{3}$/.test(cvc)) {
        toast({ variant: 'destructive', title: 'Invalid CVC', description: 'CVC must be 3 digits.' });
        return;
      }
      data = {
          type: 'card',
          provider: 'Visa', // Mock provider
          displayInfo: `ending in ${cardNumber.slice(-4)}`,
          expiry: expiry,
      };
    } else if (activeTab === 'upi') {
      if (!upiId || !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
        toast({ variant: 'destructive', title: 'Invalid UPI ID', description: 'Please enter a valid UPI ID (e.g., yourname@bank).' });
        return;
      }
      data = {
          type: 'upi',
          provider: upiId.split('@')[1] || 'UPI',
          displayInfo: upiId
      };
    } else if (activeTab === 'netbanking') {
      if (!selectedBank) {
        toast({ variant: 'destructive', title: 'No Bank Selected', description: 'Please select a bank.' });
        return;
      }
      data = {
          type: 'netbanking',
          provider: selectedBank,
          displayInfo: ''
      };
    }

    if (data) {
        onSubmit(data);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Payment Method</DialogTitle>
          <DialogDescription>
            Choose your preferred method to add funds.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4" /> Card</TabsTrigger>
                <TabsTrigger value="upi"><Wallet className="mr-2 h-4 w-4" /> UPI</TabsTrigger>
                <TabsTrigger value="netbanking"><Landmark className="mr-2 h-4 w-4" /> Net Banking</TabsTrigger>
            </TabsList>
            <TabsContent value="card" className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input id="card-name" placeholder="Your Name" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                </div>
            </TabsContent>
            <TabsContent value="upi" className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input id="upi-id" placeholder="yourname@bank" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                </div>
                <p className="text-xs text-muted-foreground">A payment request will be sent to your UPI app.</p>
            </TabsContent>
            <TabsContent value="netbanking" className="space-y-4 pt-4">
                 <div className="space-y-2">
                    <Label htmlFor="bank">Select Bank</Label>
                    <Select onValueChange={setSelectedBank} value={selectedBank}>
                        <SelectTrigger id="bank">
                            <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                            {indianBanks.map(bank => (
                                <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-xs text-muted-foreground">You will be redirected to your bank's website to authorize the payment.</p>
            </TabsContent>
        </Tabs>

        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Add Method</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
