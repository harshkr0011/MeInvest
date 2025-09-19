
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Stock, PortfolioHolding, UserProfile, Transaction, SavingsPlan, FundHolding, WalletTransaction, GoldTransaction, Cryptocurrency, CryptoHolding, CryptoTransaction, FundTransaction, UnifiedTransaction } from '@/types';
import { stocks as initialStocks } from '@/lib/data';
import { cryptos as initialCryptos } from '@/lib/crypto-data';
import { mutualFunds as initialMutualFunds } from '@/lib/funds-data';
import type { MutualFund } from '@/lib/funds-data';
import { goldData as initialGoldData } from '@/lib/gold-data';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';


export type TradeType = 'buy' | 'sell';

interface PortfolioContextType {
  portfolio: PortfolioHolding[];
  transactions: Transaction[];
  handleTrade: (stock: Stock, shares: number, tradeType: TradeType, source?: 'stock' | 'savings-plan') => boolean;
  selectedStock: Stock;
  setSelectedStock: (stock: Stock) => void;
  stocks: Stock[];
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isStockInWatchlist: (symbol: string) => boolean;
  profile: UserProfile;
  updateProfile: (newProfile: UserProfile) => void;
  savingsPlans: SavingsPlan[];
  addSavingsPlan: (plan: Omit<SavingsPlan, 'id' | 'createdAt'>) => boolean;
  removeSavingsPlan: (planId: string) => void;
  fundHoldings: FundHolding[];
  investInFund: (fund: MutualFund, amount: number) => boolean;
  sellFund: (holdingId: string) => void;
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  addFundsToWallet: (amount: number) => void;
  goldBalanceGrams: number;
  goldTransactions: GoldTransaction[];
  transactGold: (grams: number, type: 'buy' | 'sell') => boolean;
  cryptos: Cryptocurrency[];
  cryptoHoldings: CryptoHolding[];
  cryptoTransactions: CryptoTransaction[];
  handleCryptoTrade: (crypto: Cryptocurrency, amount: number, tradeType: TradeType) => boolean;
  fundTransactions: FundTransaction[];
  allTransactions: UnifiedTransaction[];
  mutualFunds: MutualFund[];
  goldData: { pricePerGram: number };
}

const defaultProfile: UserProfile = {
  name: "User",
  email: "user@example.com",
  bio: "I'm an investor interested in tech and renewable energy in India.",
  phone: "",
  address: "123, MG Road, Bangalore, India",
  avatar: "https://picsum.photos/seed/ua1/100/100"
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [savingsPlans, setSavingsPlans] = useState<SavingsPlan[]>([]);
  const [fundHoldings, setFundHoldings] = useState<FundHolding[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(50000);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [goldBalanceGrams, setGoldBalanceGrams] = useState<number>(0);
  const [goldTransactions, setGoldTransactions] = useState<GoldTransaction[]>([]);
  const [cryptoHoldings, setCryptoHoldings] = useState<CryptoHolding[]>([]);
  const [cryptoTransactions, setCryptoTransactions] = useState<CryptoTransaction[]>([]);
  const [fundTransactions, setFundTransactions] = useState<FundTransaction[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>(initialCryptos);
  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>(initialMutualFunds);
  const [goldData, setGoldData] = useState(initialGoldData);
  const [selectedStock, setSelectedStock] = useState<Stock>(initialStocks[0]);


  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Data loading from localStorage
  useEffect(() => {
    if (isClient) {
      try {
        const savedPortfolio = window.localStorage.getItem('userPortfolio');
        if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));

        const savedTransactions = window.localStorage.getItem('userTransactions');
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

        const savedWatchlist = window.localStorage.getItem('userWatchlist');
        if (savedWatchlist) {
          setWatchlist(JSON.parse(savedWatchlist));
        } else {
          setWatchlist(['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'BTC', 'ETH']);
        }

        const savedProfile = window.localStorage.getItem('userProfile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          setProfile(defaultProfile);
        }

        const savedSavingsPlans = window.localStorage.getItem('userSavingsPlans');
        if (savedSavingsPlans) setSavingsPlans(JSON.parse(savedSavingsPlans));

        const savedFundHoldings = window.localStorage.getItem('userFundHoldings');
        if (savedFundHoldings) setFundHoldings(JSON.parse(savedFundHoldings));
        
        const savedWalletBalance = window.localStorage.getItem('userWalletBalance');
        if (savedWalletBalance) setWalletBalance(JSON.parse(savedWalletBalance));

        const savedWalletTransactions = window.localStorage.getItem('userWalletTransactions');
        if (savedWalletTransactions) setWalletTransactions(JSON.parse(savedWalletTransactions));
        
        const savedGoldBalance = window.localStorage.getItem('userGoldBalance');
        if (savedGoldBalance) setGoldBalanceGrams(JSON.parse(savedGoldBalance));
        
        const savedGoldTransactions = window.localStorage.getItem('userGoldTransactions');
        if (savedGoldTransactions) setGoldTransactions(JSON.parse(savedGoldTransactions));

        const savedCryptoHoldings = window.localStorage.getItem('userCryptoHoldings');
        if (savedCryptoHoldings) setCryptoHoldings(JSON.parse(savedCryptoHoldings));
        
        const savedCryptoTransactions = window.localStorage.getItem('userCryptoTransactions');
        if (savedCryptoTransactions) setCryptoTransactions(JSON.parse(savedCryptoTransactions));

        const savedFundTransactions = window.localStorage.getItem('userFundTransactions');
        if (savedFundTransactions) setFundTransactions(JSON.parse(savedFundTransactions));


      } catch (error) {
        console.error("Failed to load data from localStorage", error);
      }
    }
  }, [isClient]);

  const saveDataToLocalStorage = (key: string, data: any) => {
    if (isClient) {
      try {
        window.localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(`Failed to save ${key} to localStorage`, error);
      }
    }
  };
  
  // Data saving to localStorage
  useEffect(() => { saveDataToLocalStorage('userPortfolio', portfolio); }, [portfolio, isClient]);
  useEffect(() => { saveDataToLocalStorage('userTransactions', transactions); }, [transactions, isClient]);
  useEffect(() => { saveDataToLocalStorage('userWatchlist', watchlist); }, [watchlist, isClient]);
  useEffect(() => { saveDataToLocalStorage('userProfile', profile); }, [profile, isClient]);
  useEffect(() => { saveDataToLocalStorage('userSavingsPlans', savingsPlans); }, [savingsPlans, isClient]);
  useEffect(() => { saveDataToLocalStorage('userFundHoldings', fundHoldings); }, [fundHoldings, isClient]);
  useEffect(() => { saveDataToLocalStorage('userWalletBalance', walletBalance); }, [walletBalance, isClient]);
  useEffect(() => { saveDataToLocalStorage('userWalletTransactions', walletTransactions); }, [walletTransactions, isClient]);
  useEffect(() => { saveDataToLocalStorage('userGoldBalance', goldBalanceGrams); }, [goldBalanceGrams, isClient]);
  useEffect(() => { saveDataToLocalStorage('userGoldTransactions', goldTransactions); }, [goldTransactions, isClient]);
  useEffect(() => { saveDataToLocalStorage('userCryptoHoldings', cryptoHoldings); }, [cryptoHoldings, isClient]);
  useEffect(() => { saveDataToLocalStorage('userCryptoTransactions', cryptoTransactions); }, [cryptoTransactions, isClient]);
  useEffect(() => { saveDataToLocalStorage('userFundTransactions', fundTransactions); }, [fundTransactions, isClient]);

  // Real-time data simulation
  useEffect(() => {
    if (!isClient) return;

    const intervalId = setInterval(() => {
        const now = new Date();
        const newDateLabel = format(now, 'HH:mm:ss');

        const updatePriceAndHistory = <T extends { price: number; history: { date: string; price: number }[] }>(item: T, volatility: number): T => {
            const oldPrice = item.price;
            const changePercent = (Math.random() - 0.5) * volatility;
            const newPrice = Math.max(0.01, parseFloat((oldPrice * (1 + changePercent)).toFixed(2)));
            const newChange = newPrice - oldPrice;
            const newChangePercent = (newChange / oldPrice) * 100;
            
            const newHistory = [...item.history.slice(1), { date: newDateLabel, price: newPrice }];

            return {
                ...item,
                price: newPrice,
                change: newChange,
                changePercent: newChangePercent,
                history: newHistory,
            };
        };

        setStocks(currentStocks => currentStocks.map(stock => updatePriceAndHistory(stock, 0.01)));
        setCryptos(currentCryptos => currentCryptos.map(crypto => updatePriceAndHistory(crypto, 0.02)));

        setMutualFunds(currentFunds =>
            currentFunds.map(fund => ({
                ...fund,
                nav: Math.max(0.01, parseFloat((fund.nav * (1 + (Math.random() - 0.5) * 0.002)).toFixed(2))),
            }))
        );

        setGoldData(currentGold => ({
            pricePerGram: Math.max(0.01, parseFloat((currentGold.pricePerGram * (1 + (Math.random() - 0.5) * 0.003)).toFixed(2))),
        }));

    }, 2000);

    return () => clearInterval(intervalId);
}, [isClient]);

  // Update selectedStock whenever stocks/cryptos list changes
  useEffect(() => {
    if (!selectedStock) return;
    if (selectedStock.type === 'stock') {
        const updated = stocks.find(s => s.symbol === selectedStock.symbol);
        if (updated) setSelectedStock(updated);
    } else if (selectedStock.type === 'crypto') {
        const updated = cryptos.find(c => c.symbol === selectedStock.symbol);
        if (updated) setSelectedStock(updated as Stock);
    }
  }, [stocks, cryptos, selectedStock]);


  const handleTrade = useCallback((stock: Stock, shares: number, tradeType: TradeType, source: 'stock' | 'savings-plan' = 'stock'): boolean => {
    const totalCost = shares * stock.price;

    if (tradeType === 'buy' && walletBalance < totalCost) {
      return false; 
    }

    const existingHolding = portfolio.find(h => h.symbol === stock.symbol);

    if (tradeType === 'buy') {
      setWalletBalance(prev => prev - totalCost);
      let newPortfolio: PortfolioHolding[];
      if (existingHolding) {
        newPortfolio = portfolio.map(h => {
          if (h.symbol === stock.symbol) {
            const totalShares = h.shares + shares;
            const totalCost = (h.avgPrice * h.shares) + (stock.price * shares);
            const newAvgPrice = totalCost / totalShares;
            return { ...h, shares: totalShares, avgPrice: newAvgPrice, currentPrice: stock.price };
          }
          return h;
        });
      } else {
        const newHolding: PortfolioHolding = {
          symbol: stock.symbol,
          name: stock.name,
          shares: shares,
          avgPrice: stock.price,
          currentPrice: stock.price,
        };
        newPortfolio = [...portfolio, newHolding];
      }
      setPortfolio(newPortfolio);
    } else { // 'sell'
      if (!existingHolding || existingHolding.shares < shares) {
        return false;
      }

      setWalletBalance(prev => prev + totalCost);
      let newPortfolio: PortfolioHolding[];
      const newShares = existingHolding.shares - shares;
      if (newShares > 0) {
        newPortfolio = portfolio.map(h => 
          h.symbol === stock.symbol 
            ? { ...h, shares: newShares, currentPrice: stock.price }
            : h
        );
      } else {
        newPortfolio = portfolio.filter(h => h.symbol !== stock.symbol);
      }
      setPortfolio(newPortfolio);
    }

    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      symbol: stock.symbol,
      name: stock.name,
      shares,
      price: stock.price,
      type: tradeType,
      date: new Date().toISOString(),
      total: shares * stock.price,
      source: source,
    };
    setTransactions(prev => [newTransaction, ...prev]);

    return true; 
  }, [portfolio, transactions, walletBalance]);
  
  const handleCryptoTrade = useCallback((crypto: Cryptocurrency, amount: number, tradeType: TradeType): boolean => {
    const totalCost = amount * crypto.price;

    if (tradeType === 'buy' && walletBalance < totalCost) {
      return false;
    }

    const existingHolding = cryptoHoldings.find(h => h.symbol === crypto.symbol);

    if (tradeType === 'buy') {
        setWalletBalance(prev => prev - totalCost);
        let newHoldings: CryptoHolding[];
        if (existingHolding) {
            newHoldings = cryptoHoldings.map(h => {
                if (h.symbol === crypto.symbol) {
                    const totalAmount = h.amount + amount;
                    const newInvested = (h.avgPrice * h.amount) + (crypto.price * amount);
                    return { ...h, amount: totalAmount, avgPrice: newInvested / totalAmount };
                }
                return h;
            });
        } else {
            newHoldings = [...cryptoHoldings, {
                symbol: crypto.symbol,
                name: crypto.name,
                amount: amount,
                avgPrice: crypto.price,
            }];
        }
        setCryptoHoldings(newHoldings);
    } else { // sell
        if (!existingHolding || existingHolding.amount < amount) {
            return false;
        }
        setWalletBalance(prev => prev + totalCost);
        const newAmount = existingHolding.amount - amount;
        if (newAmount > 1e-9) { // Use a small epsilon for float comparison
            setCryptoHoldings(cryptoHoldings.map(h => 
                h.symbol === crypto.symbol ? { ...h, amount: newAmount } : h
            ));
        } else {
            setCryptoHoldings(cryptoHoldings.filter(h => h.symbol !== crypto.symbol));
        }
    }

    const newTx: CryptoTransaction = {
      id: `ctxn_${Date.now()}`,
      symbol: crypto.symbol,
      name: crypto.name,
      amount,
      price: crypto.price,
      type: tradeType,
      date: new Date().toISOString(),
      total: totalCost
    };
    setCryptoTransactions(prev => [newTx, ...prev]);
    
    return true;
  }, [cryptoHoldings, cryptoTransactions, walletBalance]);


  const addToWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      if (!prev.includes(symbol)) {
        const newWatchlist = [...prev, symbol];
        return newWatchlist;
      }
      return prev;
    });
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      const newWatchlist = prev.filter((s) => s !== symbol);
      return newWatchlist;
    });
  };
  
  const isStockInWatchlist = (symbol: string) => {
    return watchlist.includes(symbol);
  }

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };
  
  const addSavingsPlan = (plan: Omit<SavingsPlan, 'id' | 'createdAt'>): boolean => {
    const stockToBuy = stocks.find(s => s.symbol === plan.stockSymbol);

    if (!stockToBuy) {
        console.error("Stock for savings plan not found");
        return false;
    }

    if (plan.amount > walletBalance) {
        toast({
            variant: "destructive",
            title: "Insufficient Funds",
            description: `You need at least ₹${plan.amount.toLocaleString()} to start this plan.`,
        });
        return false;
    }

    // Calculate how many shares can be bought
    const sharesToBuy = plan.amount / stockToBuy.price;
    
    // Execute the first trade
    const tradeSuccess = handleTrade(stockToBuy, sharesToBuy, 'buy', 'savings-plan');

    if (tradeSuccess) {
        const newPlan: SavingsPlan = {
            ...plan,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        setSavingsPlans(prev => [...prev, newPlan]);
        return true;
    }
    
    // handleTrade would have failed due to balance, though we check above.
    // This is a safeguard.
    return false;
  };

  const removeSavingsPlan = (planId: string) => {
    setSavingsPlans(prev => prev.filter(p => p.id !== planId));
  };
  
  const investInFund = (fund: MutualFund, amount: number) => {
    if (walletBalance < amount) {
        return false;
    }
    setWalletBalance(prev => prev - amount);

    const currentNav = fund.nav; 
    const units = amount / currentNav;

    setFundHoldings(prevHoldings => {
      const existingHolding = prevHoldings.find(h => h.id === fund.id);
      if (existingHolding) {
        return prevHoldings.map(h => {
          if (h.id === fund.id) {
            const newInvestedAmount = h.investedAmount + amount;
            const newUnits = h.units + units;
            const newAvgNav = newInvestedAmount / newUnits;
            return { ...h, investedAmount: newInvestedAmount, units: newUnits, avgNav: newAvgNav };
          }
          return h;
        });
      } else {
        const newHolding: FundHolding = {
          id: fund.id,
          name: fund.name,
          units: units,
          avgNav: currentNav,
          investedAmount: amount,
        };
        return [...prevHoldings, newHolding];
      }
    });

    const newTx: FundTransaction = {
        id: `ftxn_${Date.now()}`,
        symbol: fund.id,
        name: fund.name,
        units,
        price: currentNav,
        type: 'buy',
        date: new Date().toISOString(),
        total: amount,
    };
    setFundTransactions(prev => [newTx, ...prev]);

    return true;
  };

  const sellFund = (holdingId: string) => {
    const holdingToSell = fundHoldings.find(h => h.id === holdingId);
    const fundData = mutualFunds.find(f => f.id === holdingId);
    if (holdingToSell && fundData) {
        const saleValue = holdingToSell.units * fundData.nav;
        setWalletBalance(prev => prev + saleValue);
        setFundHoldings(prevHoldings => prevHoldings.filter(h => h.id !== holdingId));

        const newTx: FundTransaction = {
            id: `ftxn_${Date.now()}`,
            symbol: fundData.id,
            name: fundData.name,
            units: holdingToSell.units,
            price: fundData.nav,
            type: 'sell',
            date: new Date().toISOString(),
            total: saleValue,
        };
        setFundTransactions(prev => [newTx, ...prev]);
    }
  };
  
  const addFundsToWallet = (amount: number) => {
    setWalletBalance(prev => prev + amount);
    const newTransaction: WalletTransaction = {
      id: `wt_${Date.now()}`,
      amount,
      date: new Date().toISOString(),
      type: 'deposit'
    };
    setWalletTransactions(prev => [newTransaction, ...prev]);
  };
  
  const transactGold = (grams: number, type: 'buy' | 'sell'): boolean => {
    const totalCost = grams * goldData.pricePerGram;
    if (type === 'buy') {
      if (walletBalance < totalCost) return false;
      setWalletBalance(prev => prev - totalCost);
      setGoldBalanceGrams(prev => prev + grams);
    } else { // sell
      if (goldBalanceGrams < grams) return false;
      setWalletBalance(prev => prev + totalCost);
      setGoldBalanceGrams(prev => prev - grams);
    }
    
    const newTx: GoldTransaction = {
      id: `gtxn_${Date.now()}`,
      grams,
      pricePerGram: goldData.pricePerGram,
      type,
      date: new Date().toISOString(),
      total: totalCost
    };
    setGoldTransactions(prev => [newTx, ...prev]);

    return true;
  }

  const allTransactions = React.useMemo(() => {
    const unified: UnifiedTransaction[] = [];
    
    transactions.forEach(tx => unified.push({
        id: tx.id,
        assetType: tx.source === 'savings-plan' ? 'savings-plan' : 'stock',
        date: tx.date,
        name: tx.name,
        symbol: tx.symbol,
        price: tx.price,
        quantity: tx.shares,
        total: tx.total,
        type: tx.type
    }));

    cryptoTransactions.forEach(tx => unified.push({
        id: tx.id,
        assetType: 'crypto',
        date: tx.date,
        name: tx.name,
        symbol: tx.symbol,
        price: tx.price,
        quantity: tx.amount,
        total: tx.total,
        type: tx.type
    }));

    fundTransactions.forEach(tx => unified.push({
        id: tx.id,
        assetType: 'fund',
        date: tx.date,
        name: tx.name,
        symbol: tx.symbol,
        price: tx.price,
        quantity: tx.units,
        total: tx.total,
        type: tx.type
    }));

    goldTransactions.forEach(tx => unified.push({
        id: tx.id,
        assetType: 'gold',
        date: tx.date,
        name: 'Gold',
        symbol: 'GOLD',
        price: tx.pricePerGram,
        quantity: tx.grams,
        total: tx.total,
        type: tx.type
    }));

    return unified.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, cryptoTransactions, fundTransactions, goldTransactions]);


  const contextValue: PortfolioContextType = {
    portfolio,
    transactions,
    handleTrade,
    selectedStock,
    setSelectedStock,
    stocks: stocks,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isStockInWatchlist,
    profile,
    updateProfile,
    savingsPlans,
    addSavingsPlan,
    removeSavingsPlan,
    fundHoldings,
    investInFund,
    sellFund,
    walletBalance,
    walletTransactions,
    addFundsToWallet,
    goldBalanceGrams,
    goldTransactions,
    transactGold,
    cryptos: cryptos,
    cryptoHoldings,
    cryptoTransactions,
    handleCryptoTrade,
    fundTransactions,
    allTransactions,
    mutualFunds,
    goldData,
  };
  
  const emptyContext: PortfolioContextType = {
      portfolio: [],
      transactions: [],
      handleTrade: () => false,
      selectedStock: initialStocks[0],
      setSelectedStock: () => {},
      stocks: initialStocks,
      watchlist: [],
      addToWatchlist: () => {},
      removeFromWatchlist: () => {},
      isStockInWatchlist: () => false,
      profile: defaultProfile,
      updateProfile: () => {},
      savingsPlans: [],
      addSavingsPlan: () => false,
      removeSavingsPlan: () => {},
      fundHoldings: [],
      investInFund: () => false,
      sellFund: () => {},
      walletBalance: 0,
      walletTransactions: [],
      addFundsToWallet: () => {},
      goldBalanceGrams: 0,
      goldTransactions: [],
      transactGold: () => false,
      cryptos: initialCryptos,
      cryptoHoldings: [],
      cryptoTransactions: [],
      handleCryptoTrade: () => false,
      fundTransactions: [],
      allTransactions: [],
      mutualFunds: initialMutualFunds,
      goldData: initialGoldData,
  };

  return (
    <PortfolioContext.Provider value={isClient ? contextValue : emptyContext}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

    