

const currentPricePerTenGrams = 73800;

export const goldData = {
    pricePerGram: currentPricePerTenGrams / 10,
};

export const investmentOptions = [
    {
        title: 'Gold ETFs',
        description: 'Gold Exchange Traded Funds are units representing physical gold which may be in paper or dematerialised form. One Gold ETF unit is equal to 1 gram of gold and is backed by physical gold of very high purity.',
        color: 'bg-blue-500',
        icon: 'Award'
    },
    {
        title: 'Sovereign Gold Bonds (SGBs)',
        description: 'SGBs are government securities denominated in grams of gold. They are substitutes for holding physical gold. Investors have to pay the issue price and the bonds will be redeemed upon maturity.',
        color: 'bg-green-500',
        icon: 'Gem'
    },
    {
        title: 'Digital Gold',
        description: 'An online method of buying and accumulating gold in small fractions, anytime and anywhere. You can buy 24K gold for as low as ₹1 and it is stored in insured vaults on your behalf.',
        color: 'bg-purple-500',
        icon: 'ShoppingCart'
    }
];
