
"use client";

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SavingsPlan } from '@/types';
import { usePortfolio } from '@/context/portfolio-context';
import { useToast } from '@/hooks/use-toast';


const planFormSchema = z.object({
  name: z.string().min(3, "Plan name must be at least 3 characters."),
  stockSymbol: z.string().min(1, "Please select a stock."),
  amount: z.coerce.number().min(100, "Minimum investment is ₹100."),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

type CreatePlanDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (plan: Omit<SavingsPlan, 'id' | 'createdAt'>) => boolean;
};

export function CreatePlanDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: CreatePlanDialogProps) {
  const { stocks, walletBalance } = usePortfolio();
  const { toast } = useToast();

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: "",
      stockSymbol: "",
      amount: 1000,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        stockSymbol: "",
        amount: 1000,
      });
    }
  }, [isOpen, form]);

  function handleFormSubmit(data: PlanFormValues) {
    if (data.amount > walletBalance) {
        toast({
            variant: "destructive",
            title: "Insufficient Funds",
            description: `You need ₹${data.amount.toLocaleString()} to start this plan, but your wallet only has ₹${walletBalance.toLocaleString()}.`,
        });
        return;
    }
    const success = onSubmit(data);
    if(success) {
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Savings Plan</DialogTitle>
          <DialogDescription>
            Set up a recurring investment. The first investment will be made immediately.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'My Tech Stocks Plan'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stockSymbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock to Invest In</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a stock" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stocks.map(stock => (
                        <SelectItem key={stock.symbol} value={stock.symbol}>
                          {stock.name} ({stock.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Investment Amount (INR)</FormLabel>
                  <FormControl>
                    <Input type="number" min="100" step="100" {...field} />
                  </FormControl>
                   <FormDescription>
                        This amount will be invested immediately upon plan creation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Plan & Invest</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
