
export type MutualFund = {
    id: string;
    name: string;
    category: 'Equity' | 'Debt' | 'Hybrid' | 'Other';
    description: string;
    risk: 'Low' | 'Medium' | 'High';
    return1Y: number;
    return3Y: number;
    nav: number;
};

export const mutualFunds: MutualFund[] = [
  {
    id: 'mf-1',
    name: 'Quant Small Cap Fund',
    category: 'Equity',
    description: 'An equity scheme predominantly investing in small-cap stocks for high growth potential.',
    risk: 'High',
    return1Y: 67.9,
    return3Y: 34.2,
    nav: 264.49,
  },
  {
    id: 'mf-2',
    name: 'Parag Parikh Flexi Cap Fund',
    category: 'Equity',
    description: 'A diversified equity fund investing across large-cap, mid-cap, and small-cap stocks.',
    risk: 'Medium',
    return1Y: 38.4,
    return3Y: 21.5,
    nav: 79.99,
  },
  {
    id: 'mf-3',
    name: 'ICICI Prudential Bluechip Fund',
    category: 'Equity',
    description: 'Invests in large-cap stocks with a track record of stable performance.',
    risk: 'Medium',
    return1Y: 28.5,
    return3Y: 18.9,
    nav: 101.44,
  },
  {
    id: 'mf-4',
    name: 'HDFC Short Term Debt Fund',
    category: 'Debt',
    description: 'Aims to provide regular income through investment in debt and money market instruments.',
    risk: 'Low',
    return1Y: 7.2,
    return3Y: 5.8,
    nav: 29.98,
  },
  {
    id: 'mf-5',
    name: 'SBI Equity Hybrid Fund',
    category: 'Hybrid',
    description: 'A balanced fund that invests in a mix of equity and debt to balance risk and returns.',
    risk: 'Medium',
    return1Y: 25.1,
    return3Y: 15.3,
    nav: 257.02,
  },
  {
    id: 'mf-6',
    name: 'Nippon India Small Cap Fund',
    category: 'Equity',
    description: 'Focuses on generating long-term capital appreciation from a portfolio of small-cap companies.',
    risk: 'High',
    return1Y: 55.4,
    return3Y: 31.9,
    nav: 183.56
  },
  {
    id: 'mf-7',
    name: 'Aditya Birla Sun Life Liquid Fund',
    category: 'Debt',
    description: 'Ideal for parking surplus funds for a short period with high liquidity.',
    risk: 'Low',
    return1Y: 7.3,
    return3Y: 5.2,
    nav: 377.94
  },
  {
    id: 'mf-8',
    name: 'Mirae Asset Large & Midcap Fund',
    category: 'Equity',
    description: 'A fund that invests in a mix of promising large-cap and mid-cap companies.',
    risk: 'Medium',
    return1Y: 35.8,
    return3Y: 19.5,
    nav: 125.15
  }
];
