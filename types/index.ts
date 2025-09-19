


export type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string | number;
  volume: string | number;
  history: { date: string; price: number }[];
  type: 'stock' | 'crypto';
};

export type Cryptocurrency = Omit<Stock, 'marketCap' | 'volume' | 'type'> & {
    marketCap: number;
    volume: number;
    type: 'crypto';
}

export type PortfolioHolding = {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
};

export type CryptoHolding = {
  symbol: string;
  name: string;
  amount: number;
  avgPrice: number;
}

export type FundHolding = {
  id: string; // Corresponds to MutualFund id
  name: string;
  units: number;
  avgNav: number;
  investedAmount: number;
};

export type NewsArticle = {
  id: string;
  source: string;
  headline: string;
  summary: string;
  imageUrl: string;
  imageHint: string;
  link: string;
};

export type MarketIndex = {
  name: string;
  value: number;
  change: number;
  changePercent: number;
};

export type UserProfile = {
    name: string;
    email: string;
    bio?: string;
    phone?: string;
    address?: string;
    gender?: "male" | "female" | "other";
    avatar?: string;
    notifications?: {
        marketNews: boolean;
        portfolioSummary: boolean;
        productUpdates: boolean;
    };
    enable2FA?: boolean;
};

export type Transaction = {
    id: string;
    symbol: string;
    name: string;
    shares: number;
    price: number;
    type: 'buy' | 'sell';
    date: string;
    total: number;
    source?: 'stock' | 'savings-plan';
};

export type CryptoTransaction = {
    id: string;
    symbol: string;
    name: string;
    amount: number;
    price: number;
    type: 'buy' | 'sell';
    date: string;
    total: number;
};

export type GoldTransaction = {
  id: string;
  grams: number;
  pricePerGram: number;
  type: 'buy' | 'sell';
  date: string;
  total: number;
}

export type FundTransaction = {
  id: string;
  symbol: string;
  name: string;
  units: number;
  price: number;
  type: 'buy' | 'sell';
  date: string;
  total: number;
}

export type SavingsPlan = {
  id: string;
  name: string;
  stockSymbol: string;
  amount: number;
  createdAt: string;
};

export type PaymentMethod = {
  id: string;
  type: 'card' | 'upi' | 'netbanking';
  provider: string; // Visa, HDFC Bank, etc.
  displayInfo: string; // 'ending in 1234', 'yourname@bank', 'HDFC Bank'
  expiry?: string;
};

export type WalletTransaction = {
  id: string;
  date: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'trade';
};

export type UnifiedTransaction = {
  id: string;
  assetType: 'stock' | 'crypto' | 'fund' | 'gold' | 'savings-plan';
  date: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
}

    