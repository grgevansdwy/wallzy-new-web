/**
 * cardsData.ts - 2026 Comprehensive Credit Card Database
 * Includes: Custom Choice, Rotating (Q1 2026), and Paypal categories.
 * Total Cards: 34
 */

export interface RewardRates {
  general: number;
  rent?: number;
  dining?: number;
  grocery?: number;
  travel?: number;
  travel_portal?: number;
  gas?: number;
  online?: number;
  streaming?: number;
  transit?: number;
  amazon?: number;
  apple_pay?: number;
  paypal?: number;
  drugstores?: number;
  entertainment?: number;
  select_merchants?: number;
  utilities?: number;
  wellness?: number;
  fitness?: number;
  wholesale_clubs?: number;
  cruise?: number;
  charity?: number;
  choice?: number; // BofA / US Bank Choice logic
}

export interface CreditCard {
  name: string;
  bestFor: string;
  annualFee: number;
  rates: RewardRates;
  special: string;
  isStudent?: boolean;
}

export const commonCards: CreditCard[] = [
  // --- CORE UTILITY ---
  {
    name: "Bilt Mastercard",
    bestFor: "Rent & Dining",
    annualFee: 0,
    rates: { rent: 0.01, dining: 0.03, travel: 0.02, general: 0.01 },
    special: "Points on rent. 2x points on 'Rent Day'.",
  },

  // --- AMERICAN EXPRESS ---
  {
    name: "Amex Blue Cash Everyday®",
    bestFor: "Online Shopping & Groceries",
    annualFee: 0,
    rates: { grocery: 0.03, online: 0.03, gas: 0.03, general: 0.01 },
    special: "3% on U.S. online retail. Includes Disney Bundle credits.",
  },
  {
    name: "Amex Blue Cash Preferred®",
    bestFor: "High-Spend Groceries",
    annualFee: 95,
    rates: {
      grocery: 0.06,
      streaming: 0.06,
      gas: 0.03,
      transit: 0.03,
      general: 0.01,
    },
    special: "Industry-leading 6% on groceries (up to $6k/year).",
  },
  {
    name: "American Express® Gold Card",
    bestFor: "Dining & Groceries",
    annualFee: 325,
    rates: { dining: 0.04, grocery: 0.04, travel: 0.03, general: 0.01 },
    special: "4x points at restaurants and U.S. supermarkets.",
  },
  {
    name: "The Platinum Card® from American Express",
    bestFor: "Luxury Travel",
    annualFee: 695,
    rates: { travel: 0.05, travel_portal: 0.05, general: 0.01 },
    special: "Best-in-class lounge access and global travel credits.",
  },
  {
    name: "Amex Delta SkyMiles® Blue",
    bestFor: "Delta Flyers",
    annualFee: 0,
    rates: { dining: 0.02, general: 0.01 },
    special: "No annual fee and 20% back on Delta in-flight purchases.",
  },

  // --- BANK OF AMERICA ---
  {
    name: "BofA Customized Cash Rewards",
    bestFor: "3% Choice Category",
    annualFee: 0,
    rates: {
      choice: 0.03,
      grocery: 0.02,
      wholesale_clubs: 0.02,
      general: 0.01,
    },
    special:
      "Choose your 3% category (Online Shopping is usually best for students).",
  },
  {
    name: "BofA Travel Rewards",
    bestFor: "International No-Fee",
    annualFee: 0,
    rates: { general: 0.015 },
    special: "Fixed 1.5 points on everything. No foreign transaction fees.",
  },
  {
    name: "BofA Unlimited Cash Rewards",
    bestFor: "Flat-Rate Cash Back",
    annualFee: 0,
    rates: { general: 0.015 },
    special: "1.5% back on all purchases with no caps.",
  },

  // --- CAPITAL ONE ---
  {
    name: "Capital One Quicksilver for Students",
    bestFor: "Student Flat-Rate",
    annualFee: 0,
    isStudent: true,
    rates: { general: 0.015 },
    special: "Earn 1.5% cash back. Great for first-time credit building.",
  },
  {
    name: "Capital One SavorOne Card",
    bestFor: "Dining & Entertainment",
    annualFee: 0,
    rates: { dining: 0.03, grocery: 0.03, entertainment: 0.03, general: 0.01 },
    special: "Solid no-fee choice for food and movies.",
  },
  {
    name: "Capital One Savor Student",
    bestFor: "Student Dining",
    annualFee: 0,
    isStudent: true,
    rates: { dining: 0.03, grocery: 0.03, streaming: 0.03, general: 0.01 },
    special: "High food rewards for students. No foreign transaction fees.",
  },
  {
    name: "Capital One Venture X Rewards",
    bestFor: "Premium Travel",
    annualFee: 395,
    rates: { travel_portal: 0.1, travel: 0.02, general: 0.02 },
    special: "$300 annual travel credit and 10k anniversary miles.",
  },

  // --- CHASE ---
  {
    name: "Chase Freedom Flex®",
    bestFor: "Q1 Dining (7%)",
    annualFee: 0,
    rates: {
      dining: 0.07,
      drugstores: 0.03,
      cruise: 0.05,
      charity: 0.05,
      general: 0.01,
    },
    special:
      "Q1 2026: 7% on Dining! Also 5% on Norwegian Cruise Line and AHA donations.",
  },
  {
    name: "Chase Freedom Rise℠",
    bestFor: "First-Time Approval",
    annualFee: 0,
    rates: { general: 0.015 },
    special: "Easiest starter card for students to enter Chase.",
  },
  {
    name: "Chase Freedom Unlimited®",
    bestFor: "Everyday Spending",
    annualFee: 0,
    rates: {
      general: 0.015,
      dining: 0.03,
      drugstores: 0.03,
      travel_portal: 0.05,
    },
    special: "Strong base rate with high bonus categories.",
  },
  {
    name: "Prime Visa",
    bestFor: "Amazon Shoppers",
    annualFee: 0,
    rates: { amazon: 0.05, dining: 0.02, gas: 0.02, general: 0.01 },
    special: "5% back at Amazon and Whole Foods.",
  },
  {
    name: "Chase Sapphire Preferred®",
    bestFor: "Travel Point Transfer",
    annualFee: 95,
    rates: {
      travel: 0.02,
      travel_portal: 0.05,
      dining: 0.03,
      streaming: 0.03,
      general: 0.01,
    },
    special: "Redeem points for 25% more value on Chase Travel.",
  },

  // --- CITI & WELLS FARGO ---
  {
    name: "Citi® Double Cash Card",
    bestFor: "Flat 2% Back",
    annualFee: 0,
    rates: { general: 0.02 },
    special: "Earn 1% when you buy and 1% when you pay.",
  },
  {
    name: "Wells Fargo Active Cash®",
    bestFor: "Simple 2% Cash",
    annualFee: 0,
    rates: { general: 0.02 },
    special: "Unlimited 2% cash back. No category tracking.",
  },
  {
    name: "Wells Fargo Autograph®",
    bestFor: "Commuting & Transit",
    annualFee: 0,
    rates: {
      transit: 0.03,
      travel: 0.03,
      dining: 0.03,
      gas: 0.03,
      general: 0.01,
    },
    special: "Includes 3% on phone plans and EV charging.",
  },
  {
    name: "Wells Fargo Attune℠",
    bestFor: "Wellness & Life",
    annualFee: 0,
    rates: {
      wellness: 0.04,
      fitness: 0.04,
      entertainment: 0.04,
      general: 0.01,
    },
    special: "4% back on gym memberships, salons, and sports.",
  },

  // --- TECH & FINTECH ---
  {
    name: "Apple Card",
    bestFor: "Apple Pay",
    annualFee: 0,
    rates: { apple_pay: 0.02, select_merchants: 0.03, general: 0.01 },
    special: "Daily Cash back straight into your Apple Wallet.",
  },
  {
    name: "PayPal Cashback Mastercard®",
    bestFor: "PayPal Checkout (3%)",
    annualFee: 0,
    rates: { paypal: 0.03, general: 0.015 },
    special: "3% back when using PayPal at checkout.",
  },
  {
    name: "Robinhood Gold Card",
    bestFor: "Universal 3%",
    annualFee: 0,
    rates: { general: 0.03 },
    special: "Unlimited 3% back on everything (Requires Robinhood Gold).",
  },
  {
    name: "Verizon Visa® Card",
    bestFor: "Grocery & Gas (4%)",
    annualFee: 0,
    rates: { grocery: 0.04, gas: 0.04, dining: 0.03, general: 0.01 },
    special: "4% back on gas and groceries. Best for Verizon users.",
  },

  // --- DISCOVER ---
  {
    name: "Discover it® Student Cash Back",
    bestFor: "Q1 Groceries (5%)",
    annualFee: 0,
    isStudent: true,
    rates: {
      grocery: 0.05,
      wholesale_clubs: 0.05,
      streaming: 0.05,
      general: 0.01,
    },
    special: "Q1 2026: 5% at Grocery Stores, Wholesale Clubs, and Streaming.",
  },
  {
    name: "Discover it® Student Chrome",
    bestFor: "Gas & Dining Starter",
    annualFee: 0,
    isStudent: true,
    rates: { gas: 0.02, dining: 0.02, general: 0.01 },
    special: "Simple 2% for commuters. Year 1 match makes it 4%.",
  },
  {
    name: "Discover it® Miles",
    bestFor: "Travel Flex",
    annualFee: 0,
    rates: { general: 0.015 },
    special: "1.5 miles on everything, matched at the end of year one.",
  },

  // --- U.S. BANK ---
  {
    name: "U.S. Bank Cash+®",
    bestFor: "5% Choice Categories",
    annualFee: 0,
    rates: { choice: 0.05, grocery: 0.02, general: 0.01 },
    special: "Pick two 5% categories like Utilities or Fast Food.",
  },
  {
    name: "U.S. Bank Altitude® Connect",
    bestFor: "Travel & Gas",
    annualFee: 0,
    rates: { travel: 0.04, gas: 0.04, general: 0.01 },
    special: "High 4x points for commuters. No annual fee.",
  },
  {
    name: "U.S. Bank Altitude® Go",
    bestFor: "Dining Lovers",
    annualFee: 0,
    rates: { dining: 0.04, grocery: 0.02, gas: 0.02, general: 0.01 },
    special: "Top choice for 4% back on dining with no fee.",
  },
  {
    name: "U.S. Bank Smartly® Visa Signature®",
    bestFor: "High-Balance Savers",
    annualFee: 0,
    rates: { general: 0.02 },
    special: "Potential for 4% flat rate with high account balances.",
  },
];
