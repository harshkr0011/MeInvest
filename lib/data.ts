
import type { Stock, PortfolioHolding, NewsArticle, MarketIndex } from '@/types';
import { format } from 'date-fns';

function generatePriceHistory(basePrice: number, points: number): { date: string, price: number }[] {
  const history = [];
  let currentDate = new Date();
  for (let i = 0; i < points; i++) {
    const date = new Date(currentDate);
    date.setSeconds(currentDate.getSeconds() - (points - 1 - i) * 2); // 2 seconds interval
    
    // Use a deterministic pseudo-random generator for consistency across renders
    const pseudoRandom = (Math.sin(date.getTime() / 1000) + 1) / 2;
    const fluctuation = (pseudoRandom - 0.5) * basePrice * 0.01; // Reduced fluctuation
    const trend = (i / points - 0.5) * basePrice * 0.02; // Reduced trend
    const price = Math.max(0, basePrice + fluctuation + trend);
    history.push({
      date: format(date, 'HH:mm:ss'),
      price: parseFloat(price.toFixed(2)),
    });
  }
  return history;
}

export const stocks: Stock[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    price: 2850.50,
    change: 30.15,
    changePercent: 1.07,
    marketCap: '19.3T',
    volume: '7.8M',
    history: generatePriceHistory(2820, 30),
    type: 'stock',
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3800.75,
    change: -25.40,
    changePercent: -0.66,
    marketCap: '13.7T',
    volume: '2.1M',
    history: generatePriceHistory(3825, 30),
    type: 'stock',
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    price: 1550.20,
    change: 12.80,
    changePercent: 0.83,
    marketCap: '11.8T',
    volume: '15.2M',
    history: generatePriceHistory(1538, 30),
    type: 'stock',
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    price: 1605.90,
    change: -8.10,
    changePercent: -0.50,
    marketCap: '6.7T',
    volume: '6.5M',
    history: generatePriceHistory(1614, 30),
    type: 'stock',
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    price: 1100.45,
    change: 5.60,
    changePercent: 0.51,
    marketCap: '7.7T',
    volume: '18.9M',
    history: generatePriceHistory(1095, 30),
    type: 'stock',
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd.',
    price: 1385.00,
    change: -10.25,
    changePercent: -0.73,
    marketCap: '7.8T',
    volume: '5.4M',
    history: generatePriceHistory(1395, 30),
    type: 'stock',
  },
  {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Ltd.',
    price: 2540.80,
    change: 15.20,
    changePercent: 0.60,
    marketCap: '6.0T',
    volume: '1.8M',
    history: generatePriceHistory(2525, 30),
    type: 'stock',
  },
  {
    symbol: 'ITC',
    name: 'ITC Ltd.',
    price: 430.10,
    change: -2.55,
    changePercent: -0.59,
    marketCap: '5.4T',
    volume: '12.3M',
    history: generatePriceHistory(432, 30),
    type: 'stock',
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    price: 830.25,
    change: 11.50,
    changePercent: 1.40,
    marketCap: '7.4T',
    volume: '25.1M',
    history: generatePriceHistory(819, 30),
    type: 'stock',
  },
  {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance Ltd.',
    price: 7250.60,
    change: -50.10,
    changePercent: -0.69,
    marketCap: '4.5T',
    volume: '0.9M',
    history: generatePriceHistory(7300, 30),
    type: 'stock',
  },
  {
    symbol: 'WIPRO',
    name: 'Wipro Ltd.',
    price: 480.75,
    change: 3.10,
    changePercent: 0.65,
    marketCap: '2.5T',
    volume: '8.2M',
    history: generatePriceHistory(477, 30),
    type: 'stock',
  },
  {
    symbol: 'ASIANPAINT',
    name: 'Asian Paints Ltd.',
    price: 2880.40,
    change: -18.90,
    changePercent: -0.65,
    marketCap: '2.8T',
    volume: '1.1M',
    history: generatePriceHistory(2900, 30),
    type: 'stock',
  },
  {
    symbol: 'KOTAKBANK',
    name: 'Kotak Mahindra Bank Ltd.',
    price: 1755.00,
    change: 22.30,
    changePercent: 1.29,
    marketCap: '3.5T',
    volume: '4.5M',
    history: generatePriceHistory(1733, 30),
    type: 'stock',
  },
  {
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd.',
    price: 3600.00,
    change: 45.00,
    changePercent: 1.27,
    marketCap: '4.9T',
    volume: '1.9M',
    history: generatePriceHistory(3555, 30),
    type: 'stock',
  },
  {
    symbol: 'MARUTI',
    name: 'Maruti Suzuki India Ltd.',
    price: 12500.00,
    change: -150.00,
    changePercent: -1.19,
    marketCap: '3.9T',
    volume: '0.5M',
    history: generatePriceHistory(12650, 30),
    type: 'stock',
  },
  {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical Industries Ltd.',
    price: 1500.50,
    change: 10.20,
    changePercent: 0.68,
    marketCap: '3.6T',
    volume: '2.5M',
    history: generatePriceHistory(1490, 30),
    type: 'stock',
  },
  {
    symbol: 'TITAN',
    name: 'Titan Company Ltd.',
    price: 3500.00,
    change: 25.00,
    changePercent: 0.72,
    marketCap: '3.1T',
    volume: '1.2M',
    history: generatePriceHistory(3475, 30),
    type: 'stock',
  },
  {
    symbol: 'AXISBANK',
    name: 'Axis Bank Ltd.',
    price: 1200.00,
    change: -5.50,
    changePercent: -0.46,
    marketCap: '3.7T',
    volume: '9.8M',
    history: generatePriceHistory(1205, 30),
    type: 'stock',
  }
];

export const portfolio: PortfolioHolding[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    shares: 10,
    avgPrice: 2500.00,
    currentPrice: 2850.50,
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    shares: 20,
    avgPrice: 1400.00,
    currentPrice: 1550.20,
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    shares: 15,
    avgPrice: 1500.00,
    currentPrice: 1605.90,
  },
];

export const news: NewsArticle[] = [
  {
    id: '1',
    source: 'The Economic Times',
    headline: 'RBI holds repo rate steady, markets show mixed reaction.',
    summary: 'Investors weigh the central bank\'s stance on inflation and future growth outlook.',
    imageUrl: 'https://picsum.photos/seed/n1/64/64',
    imageHint: 'stock market',
    link: '#',
  },
  {
    id: '2',
    source: 'Livemint',
    headline: 'SEBI introduces new framework for SME listing.',
    summary: 'The move aims to boost capital access for small and medium enterprises in India.',
    imageUrl: 'https://picsum.photos/seed/n2/64/64',
    imageHint: 'financial data',
    link: '#',
  },
  {
    id: '3',
    source: 'Business Standard',
    headline: 'Indian IT sector expects strong Q3 results amid global demand.',
    summary: 'Major IT firms are optimistic about their performance in the upcoming quarter.',
    imageUrl: 'https://picsum.photos/seed/n3/64/64',
    imageHint: 'laptop finance',
    link: '#',
  },
  {
    id: '4',
    source: 'Moneycontrol',
    headline: 'FIIs turn net buyers in Indian market after a month of outflows.',
    summary: 'Foreign institutional investors show renewed confidence in the Indian economy.',
    imageUrl: 'https://picsum.photos/seed/n4/64/64',
    imageHint: 'wall street',
    link: '#',
  },
];

export const marketIndices: MarketIndex[] = [
  {
    name: 'NIFTY 50',
    value: 23500.15,
    change: 150.70,
    changePercent: 0.65,
  },
  {
    name: 'SENSEX',
    value: 77200.40,
    change: -210.20,
    changePercent: -0.27,
  },
  {
    name: 'NIFTY Bank',
    value: 51700.80,
    change: 350.45,
    changePercent: 0.68,
  },
  {
    name: 'BSE MidCap',
    value: 45200.90,
    change: -90.10,
    changePercent: -0.20,
  },
];

    