
"use client";

import React, { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { usePortfolio } from '@/context/portfolio-context';
import type { Stock, PaymentMethod } from '@/types';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Download, Trash2, MoreVertical, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddPaymentMethodDialog, type PaymentMethodData } from '@/components/dashboard/add-payment-method-dialog';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const initialBillingHistory = [
    { invoice: "INV-2023-001", date: "July 1, 2024", amount: "₹1,200.00", status: "Paid" },
    { invoice: "INV-2023-002", date: "June 1, 2024", amount: "₹1,200.00", status: "Paid" },
    { invoice: "INV-2023-003", date: "May 1, 2024", amount: "₹1,200.00", status: "Paid" },
];

const initialPaymentMethods: PaymentMethod[] = [
    { id: 'pm_1', type: 'card', provider: 'Visa', displayInfo: 'ending in 1234', expiry: '08/2026' }
]

type PlanStatus = 'pro' | 'free';

export default function BillingPage() {
    const { setSelectedStock } = usePortfolio();
    const router = useRouter();
    const { toast } = useToast();
    const [isAddPaymentOpen, setAddPaymentOpen] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
    const [planStatus, setPlanStatus] = useState<PlanStatus>('pro');
    const [billingHistory, setBillingHistory] = useState(initialBillingHistory);


    const handleStockSelect = (stock: Stock) => {
        setSelectedStock(stock);
        router.push('/');
    };
    
    const handleComingSoon = () => {
        toast({
            title: "Feature Coming Soon",
            description: "This functionality is under development.",
        });
    }
    
    const handleChangePlan = () => {
        toast({
            title: "Feature Coming Soon",
            description: "Changing plans is not yet implemented.",
        });
    }
    
    const handleCancelSubscription = () => {
        setPlanStatus('free');
        toast({
            variant: "destructive",
            title: "Subscription Canceled",
            description: "Your Pro Plan subscription has been canceled. You are now on the Free Plan.",
        });
    }
    
    const handleUpgradePlan = () => {
        setPlanStatus('pro');
        toast({
            title: "Plan Upgraded",
            description: "Welcome back to the Pro Plan!",
        });
    }

    const handleEditPayment = (methodId: string) => {
        const newExpiry = window.prompt("Enter new expiry date (MM/YY):");
        if (newExpiry && /^(0[1-9]|1[0-2])\/\d{2}$/.test(newExpiry)) {
            const year = newExpiry.split('/')[1];
            const fullYear = `20${year}`;
            setPaymentMethods(methods => methods.map(m => m.id === methodId ? { ...m, expiry: `${newExpiry.split('/')[0]}/${fullYear}` } : m));
            toast({
                title: "Payment Method Updated",
                description: `Expiration date updated.`,
            });
        } else if (newExpiry) {
            toast({
                variant: "destructive",
                title: "Invalid Date",
                description: "Please use MM/YY format.",
            });
        }
    };

    const handleRemovePayment = (methodId: string) => {
        setPaymentMethods(methods => methods.filter(m => m.id !== methodId));
        toast({
            variant: "destructive",
            title: "Payment Method Removed",
            description: "The selected payment method has been removed.",
        });
    }
    
    const handleAddPaymentSubmit = (data: PaymentMethodData) => {
        const newMethod: PaymentMethod = {
            id: `pm_${Date.now()}`,
            ...data
        };
        setPaymentMethods(prev => [...prev, newMethod]);
        setAddPaymentOpen(false);
        toast({
            title: "Payment Method Added",
            description: `Successfully added your new payment method.`,
        });
    };

    return (
        <>
            <Header onStockSelect={handleStockSelect} />
            <main className="flex-1 space-y-6 p-4 md:p-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">Subscription</h1>
                    <p className="text-muted-foreground">Manage your subscription details.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                    <div className="lg:col-span-3 space-y-6">
                       {planStatus === 'pro' ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Current Plan</CardTitle>
                                    <CardDescription>You are currently on the Pro Plan.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-4xl font-bold">₹1,200<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                                            <p className="text-sm text-muted-foreground">Billed monthly. Your next bill is on August 1, 2024.</p>
                                        </div>
                                        <Badge variant="secondary" className="text-base">Pro Plan</Badge>
                                    </div>
                                    <Separator />
                                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                                        <li>Unlimited stock analysis</li>
                                        <li>AI-powered trend predictions</li>
                                        <li>Priority support</li>
                                        <li>Advanced charting tools</li>
                                    </ul>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                     <Button variant="outline" onClick={handleChangePlan}>Change Plan</Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">Cancel Subscription</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. You will lose access to Pro features at the end of your current billing cycle.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleCancelSubscription} className="bg-red-600 hover:bg-red-700">Cancel Subscription</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        ) : (
                             <Card>
                                <CardHeader>
                                    <CardTitle>Current Plan</CardTitle>
                                    <CardDescription>You are currently on the Free Plan.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-4xl font-bold">₹0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                                        </div>
                                        <Badge variant="outline" className="text-base">Free Plan</Badge>
                                    </div>
                                    <Separator />
                                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                                        <li>Basic stock analysis</li>
                                        <li>Limited news feed</li>
                                        <li>Community support</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleUpgradePlan} className="w-full">
                                        <Star className="mr-2 h-4 w-4" />
                                        Upgrade to Pro
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Methods</CardTitle>
                                <CardDescription>Manage your saved payment methods.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {paymentMethods.map(method => (
                                    <div key={method.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
                                        <div className="flex items-center gap-4">
                                            <CreditCard className="h-8 w-8 text-muted-foreground" />
                                            <div>
                                                <p className="font-semibold">{method.provider} {method.displayInfo}</p>
                                                {method.expiry && <p className="text-sm text-muted-foreground">Expires {method.expiry.split('/')[0]}/{method.expiry.split('/')[1]}</p>}
                                            </div>
                                        </div>
                                        <AlertDialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditPayment(method.id)}>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Remove
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently remove this payment method.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleRemovePayment(method.id)} className="bg-red-600 hover:bg-red-700">Remove</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))}
                                {paymentMethods.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">No payment methods saved.</p>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button variant="secondary" onClick={() => setAddPaymentOpen(true)}>Add New Payment Method</Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                         <Card>
                            <CardHeader>
                                <CardTitle>Billing History</CardTitle>
                                <CardDescription>View and download your past invoices.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {planStatus === 'pro' && billingHistory.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Invoice</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {billingHistory.map((item) => (
                                                <TableRow key={item.invoice}>
                                                    <TableCell className="font-medium">{item.invoice}</TableCell>
                                                    <TableCell>{item.date}</TableCell>
                                                    <TableCell>{item.amount}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" onClick={handleComingSoon}>
                                                            <Download className="h-4 w-4" />
                                                            <span className="sr-only">Download invoice</span>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center text-sm text-muted-foreground py-10">
                                        <p>No billing history to display.</p>
                                        <p>Invoices are generated for Pro plan subscriptions.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <AddPaymentMethodDialog
                isOpen={isAddPaymentOpen}
                onOpenChange={setAddPaymentOpen}
                onSubmit={handleAddPaymentSubmit}
            />
        </>
    );
}

    