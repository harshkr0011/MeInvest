
import type { Cryptocurrency } from '@/types';
import { format } from 'date-fns';


function generatePriceHistory(basePrice: number, points: number): { date: string, price: number }[] {
  const history = [];
  let currentDate = new Date();
  for (let i = 0; i < points; i++) {
    const date = new Date(currentDate);
    date.setSeconds(currentDate.getSeconds() - (points - 1 - i) * 2); // 2 seconds interval
    
    // Use a deterministic pseudo-random generator for consistency across renders
    const pseudoRandom = (Math.sin(date.getTime() / 1000) + 1) / 2;
    const fluctuation = (pseudoRandom - 0.5) * basePrice * 0.02; // Crypto volatility
    const trend = (i / points) * basePrice * 0.03; // Upward trend
    const price = Math.max(0, basePrice + fluctuation + trend);
    history.push({
      date: format(date, 'HH:mm:ss'),
      price: parseFloat(price.toFixed(2)),
    });
  }
  return history;
}

export const cryptos: Cryptocurrency[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 5800000,
    change: 120000,
    changePercent: 2.11,
    marketCap: 114_000_00_00_00_000, // 114 Trillion INR
    volume: 2_500_00_00_00_000, // 2.5 Trillion INR
    history: generatePriceHistory(5500000, 30),
    type: 'crypto',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 315000,
    change: -5000,
    changePercent: -1.56,
    marketCap: 37_800_00_00_00_000, // 37.8 Trillion INR
    volume: 1_200_00_00_00_000, // 1.2 Trillion INR
    history: generatePriceHistory(320000, 30),
    type: 'crypto',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 14000,
    change: 800,
    changePercent: 6.06,
    marketCap: 6_300_00_00_00_000, // 6.3 Trillion INR
    volume: 300_00_00_00_000, // 300 Billion INR
    history: generatePriceHistory(13000, 30),
    type: 'crypto',
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 13.50,
    change: 0.75,
    changePercent: 5.88,
    marketCap: 1_900_00_00_00_000, // 1.9 Trillion INR
    volume: 150_00_00_00_000, // 150 Billion INR
    history: generatePriceHistory(12.5, 30),
    type: 'crypto',
  },
  {
    symbol: 'SHIB',
    name: 'Shiba Inu',
    price: 0.0021,
    change: -0.0001,
    changePercent: -4.55,
    marketCap: 1_200_00_00_00_000, // 1.2 Trillion INR
    volume: 80_00_00_00_000, // 80 Billion INR
    history: generatePriceHistory(0.0022, 30),
    type: 'crypto',
  },
  {
    symbol: 'XRP',
    name: 'XRP',
    price: 45.20,
    change: 1.10,
    changePercent: 2.49,
    marketCap: 2_500_00_00_00_000, // 2.5 Trillion INR
    volume: 100_00_00_00_000, // 100 Billion INR
    history: generatePriceHistory(44, 30),
    type: 'crypto',
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 38.50,
    change: -0.50,
    changePercent: -1.28,
    marketCap: 1_350_00_00_00_000, // 1.35 Trillion INR
    volume: 40_00_00_00_000, // 40 Billion INR
    history: generatePriceHistory(39, 30),
    type: 'crypto',
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    price: 60.10,
    change: 2.50,
    changePercent: 4.34,
    marketCap: 560_00_00_00_000, // 560 Billion INR
    volume: 30_00_00_00_000, // 30 Billion INR
    history: generatePriceHistory(58, 30),
    type: 'crypto',
  },
];

    