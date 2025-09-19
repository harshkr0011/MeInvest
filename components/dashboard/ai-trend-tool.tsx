"use client";

import React, { useState, useTransition } from 'react';
import { getMarketTrendSummaries } from '@/ai/flows/market-trend-summaries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export function AiTrendTool() {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [marketData, setMarketData] = useState('Global markets are showing signs of volatility as the tech sector experiences a slight downturn. Inflation concerns are rising, but consumer spending remains strong. The EV market continues its upward trajectory.');

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSummary('');

    startTransition(async () => {
      try {
        const result = await getMarketTrendSummaries({ marketData });
        setSummary(result.trendSummary);
      } catch (err) {
        console.error(err);
        setError('Failed to generate trend summary. Please try again.');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not generate AI summary.",
        });
      }
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          <CardTitle>AI-Powered Trend Tool</CardTitle>
        </div>
        <CardDescription>Analyze market data to predict potential trends.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <CardContent className="flex-1 flex flex-col gap-4">
          <div className="grid w-full gap-2">
            <label htmlFor="market-data" className="text-sm font-medium">Market Data Input</label>
            <Textarea
              id="market-data"
              placeholder="Enter current market data here..."
              value={marketData}
              onChange={(e) => setMarketData(e.target.value)}
              rows={5}
            />
          </div>
          {summary && (
            <Alert>
              <Wand2 className="h-4 w-4" />
              <AlertTitle>AI Trend Summary</AlertTitle>
              <AlertDescription>{summary}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Generate Summary'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

