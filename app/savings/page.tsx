
"use client";

import React, { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { usePortfolio } from '@/context/portfolio-context';
import { useRouter } from 'next/navigation';
import type { Stock, SavingsPlan } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, PiggyBank, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreatePlanDialog } from '@/components/dashboard/create-plan-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function SavingsPage() {
  const { setSelectedStock, savingsPlans, addSavingsPlan, removeSavingsPlan } = usePortfolio();
  const router = useRouter();
  const { toast } = useToast();
  const [isCreatePlanOpen, setCreatePlanOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SavingsPlan | null>(null);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    router.push('/');
  }

  const handleCreatePlanClick = () => {
    setEditingPlan(null);
    setCreatePlanOpen(true);
  };
  
  const handleEditPlanClick = (plan: SavingsPlan) => {
    toast({
        title: "Feature Coming Soon",
        description: "Editing plans is not yet supported.",
    });
  }

  const handleCreatePlan = (plan: Omit<SavingsPlan, 'id' | 'createdAt'>) => {
    const success = addSavingsPlan(plan);
    if (success) {
        toast({
            title: "Plan Created & First Investment Made",
            description: `Your new plan "${plan.name}" has been created and ₹${plan.amount} has been invested in ${plan.stockSymbol}.`,
        });
        setCreatePlanOpen(false);
        return true;
    }
    // The context handles the error toast for insufficient funds
    return false;
  }
  
  const handleDeletePlan = (planId: string) => {
    removeSavingsPlan(planId);
    toast({
        variant: "destructive",
        title: "Plan Deleted",
        description: "The savings plan has been removed.",
    });
  }

  return (
    <>
      <Header onStockSelect={handleStockSelect} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Saving Plans</h1>
                <p className="text-muted-foreground">Automate your investments and grow your wealth.</p>
            </div>
            <Button onClick={handleCreatePlanClick}>
                <PlusCircle className="mr-2" />
                Create New Plan
            </Button>
        </div>

        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Plans</CardTitle>
                    <CardDescription>
                      {savingsPlans.length > 0 ? `You have ${savingsPlans.length} active saving plan(s).` : 'No active saving plans. Create one to get started!'}
                    </CardDescription>
                </CardHeader>
                {savingsPlans.length === 0 ? (
                    <CardContent className="flex flex-col items-center justify-center text-center p-12 h-[40vh]">
                        <div className="rounded-full bg-muted p-4">
                            <PiggyBank className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No Saving Plans Yet</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Create a systematic investment plan (SIP) to invest a fixed amount regularly.
                        </p>
                        <Button className="mt-4" onClick={handleCreatePlanClick}>
                            <PlusCircle className="mr-2" />
                            Create Your First Plan
                        </Button>
                    </CardContent>
                ) : (
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {savingsPlans.map(plan => (
                        <Card key={plan.id} className="flex flex-col">
                           <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                                    <CardDescription>For {plan.stockSymbol}</CardDescription>
                                </div>
                                 <AlertDialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                             <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditPlanClick(plan)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                             <AlertDialogTrigger asChild>
                                                <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                             </AlertDialogTrigger>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your savings plan.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeletePlan(plan.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                              </div>
                           </CardHeader>
                          <CardContent className="flex-1">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-muted-foreground">Monthly Investment</span>
                                <span className="text-xl font-bold">₹{plan.amount.toLocaleString()}</span>
                            </div>
                             <div className="flex justify-between items-baseline mt-2">
                                <span className="text-sm text-muted-foreground">Created On</span>
                                <span className="text-sm">{new Date(plan.createdAt).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                          <CardFooter>
                              <Button variant="outline" className="w-full" onClick={() => toast({title: "Coming Soon!", description: "This feature is under development."})}>View History</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                )}
            </Card>
        </div>
      </main>
      <CreatePlanDialog
        isOpen={isCreatePlanOpen}
        onOpenChange={setCreatePlanOpen}
        onSubmit={handleCreatePlan}
       />
    </>
  );
}
