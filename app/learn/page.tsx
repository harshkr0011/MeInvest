
"use client";

import { Header } from '@/components/dashboard/header';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { usePortfolio } from '@/context/portfolio-context';
import { useRouter } from 'next/navigation';
import type { Stock } from '@/types';

const learningTopics = [
  {
    title: 'Introduction to the Indian Stock Market',
    description: 'Start with the basics of stock market investing.',
    items: [
      {
        question: 'What is a stock?',
        answer:
          'A stock (also known as a share or equity) represents a fraction of ownership in a company. When you buy a stock, you become a shareholder, which means you own a small piece of that company.',
      },
      {
        question: 'What is the stock market?',
        answer:
          'The stock market is where stocks are bought and sold. In India, the two main stock exchanges are the National Stock Exchange (NSE) and the Bombay Stock Exchange (BSE).',
      },
      {
        question: 'Why do companies issue stocks?',
        answer:
          'Companies issue stocks to raise capital to fund their operations, expansion, or new projects. It allows the public to invest in the company\'s growth.',
      },
    ],
  },
  {
    title: 'Key Concepts for Investors',
    description: 'Understand important terms and ideas.',
    items: [
      {
        question: 'What are NIFTY 50 and SENSEX?',
        answer:
          'NIFTY 50 and SENSEX are the benchmark indices of the NSE and BSE, respectively. They represent the performance of the top 50 (NIFTY) or 30 (SENSEX) large and actively traded stocks, providing a snapshot of the overall market health.',
      },
      {
        question: 'What is the difference between a Bull and Bear Market?',
        answer:
          'A "bull market" is a period when stock prices are generally rising, and market sentiment is optimistic. A "bear market" is the opposite, characterized by falling prices and pessimistic sentiment.',
      },
      {
        question: 'What are dividends?',
        answer:
          'Dividends are a portion of a company\'s profits distributed to its shareholders. Not all companies pay dividends; growth-oriented companies often reinvest their profits back into the business.',
      },
    ],
  },
  {
    title: 'How to Start Investing',
    description: 'A simple guide to your first investment.',
    items: [
      {
        question: 'What do I need to start?',
        answer:
          'To invest in the Indian stock market, you need a PAN card, a bank account, and a Demat & Trading account. A Demat account holds your shares in electronic format, and a Trading account is used to place buy/sell orders.',
      },
      {
        question: 'How do I analyze a stock?',
        answer:
          'There are two main approaches: 1) Fundamental Analysis involves evaluating a company\'s financial health, management, and industry position to determine its intrinsic value. 2) Technical Analysis involves studying price charts and market statistics to predict future price movements.',
      },
      {
        question: 'What is diversification?',
        answer:
          'Diversification is the strategy of investing in a variety of assets across different sectors to reduce risk. The idea is that if one investment performs poorly, others may perform well, balancing out your portfolio. Don\'t put all your eggs in one basket!',
      },
    ],
  },
  {
    title: 'Advanced Analysis Techniques',
    description: 'Dive deeper into stock analysis methods.',
    items: [
      {
        question: 'What is Fundamental Analysis in depth?',
        answer:
          'Fundamental analysis involves examining a company\'s financial health by looking at its financial statements (balance sheet, income statement, cash flow statement), its management, competitive advantages, and the overall economy. The goal is to determine a stock\'s "intrinsic value" to see if it\'s overvalued or undervalued compared to its current market price.',
      },
      {
        question: 'What is Technical Analysis in depth?',
        answer:
          'Technical analysis focuses on statistical trends gathered from trading activity, such as price movement and volume. Technical analysts use charts and other tools to identify patterns and trends that might suggest future price movements, without looking at the company\'s financial health.',
      },
      {
        question: 'What are some key financial ratios?',
        answer:
          'Important ratios include: Price-to-Earnings (P/E) Ratio (market price per share / earnings per share), Debt-to-Equity Ratio (total debt / shareholder equity), and Return on Equity (ROE) (net income / shareholder equity). These help in comparing companies and assessing their financial stability and profitability.',
      },
    ],
  },
  {
    title: 'Investment Strategies',
    description: 'Learn about different approaches to investing.',
    items: [
      {
        question: 'What is Growth Investing?',
        answer:
          'Growth investing focuses on buying stocks of companies that are expected to grow at an above-average rate compared to other companies in the market. These are often newer companies in expanding industries. They typically do not pay dividends, as they reinvest earnings to fuel further growth.',
      },
      {
        question: 'What is Value Investing?',
        answer:
          'Value investing is the strategy of picking stocks that appear to be trading for less than their intrinsic or book value. Value investors actively seek out stocks they believe the market has undervalued. The most famous proponent of value investing is Warren Buffett.',
      },
      {
        question: 'What is SIP (Systematic Investment Plan)?',
        answer:
          'A SIP is a method of investing a fixed amount of money at regular intervals (e.g., monthly) in mutual funds or stocks. It helps in rupee cost averaging and disciplines investing, making it an ideal strategy for long-term wealth creation, especially for retail investors.',
      },
    ],
  },
];

export default function LearnPage() {
    const { setSelectedStock } = usePortfolio();
    const router = useRouter();

    const handleStockSelect = (stock: Stock) => {
        setSelectedStock(stock);
        router.push('/');
    }

  return (
    <>
      <Header onStockSelect={handleStockSelect} />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Learn to Invest</h1>
            <p className="text-muted-foreground">Your guide to navigating the Indian stock market.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {learningTopics.map((topic) => (
            <Card key={topic.title}>
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {topic.items.map((item) => (
                     <AccordionItem key={item.question} value={item.question}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

    