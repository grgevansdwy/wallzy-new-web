/**
 * cardsData.ts - 2026 Student & "Power Starter" Card Database
 * Hardcoded: Q1 2026 (Jan-Mar) Rotating Categories.
 * Included: Custom and Choice category cards for high-value optimization.
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
  fitness?: number;
  wellness?: number;
  wholesale_clubs?: number;
  charity?: number;
  cruise?: number;
  choice?: number; // For BofA Choice logic
}

export interface CreditCard {
  name: string;
  bestFor: string;
  annualFee: number;
  rates: RewardRates;
  special: string;
  referralLink?: string;
}

export const studentCards: CreditCard[] = [
  {
    name: "Bilt Mastercard",
    bestFor: "Rent & Dining",
    annualFee: 0,
    rates: { rent: 0.01, dining: 0.03, travel: 0.02, general: 0.01 },
    special:
      "The only card that earns points on rent. 2x points on 'Rent Day' (1st of the month).",
  },
  {
    name: "Chase Freedom Flex®",
    bestFor: "Q1 Dining (7%)",
    annualFee: 0,
    // 3% base dining + 4% Q1 bonus = 7%
    rates: {
      dining: 0.07,
      drugstores: 0.03,
      cruise: 0.05,
      charity: 0.05,
      travel_portal: 0.05,
      general: 0.01,
    },
    special:
      "Q1 2026: 7% on Dining! Also 5% on Norwegian Cruise Line and American Heart Assoc. donations.",
  },
  {
    name: "Discover it® Student Cash Back",
    bestFor: "Q1 Groceries & Wholesale",
    annualFee: 0,
    rates: {
      grocery: 0.05,
      wholesale_clubs: 0.05,
      streaming: 0.05,
      general: 0.01,
    },
    special:
      "Q1 2026: 5% at Grocery Stores, Wholesale Clubs, and Streaming. Year 1 cashback match effectively makes these 10%.",
  },
  {
    name: "Bank of America® Customized Cash (Student)",
    bestFor: "Online Shopping Choice",
    annualFee: 0,
    rates: {
      choice: 0.03,
      grocery: 0.02,
      wholesale_clubs: 0.02,
      general: 0.01,
    },
    special:
      "Choose your 3% category. 'Online Shopping' is the strongest choice for students. Includes 2% at Groceries/Wholesale.",
  },
  {
    name: "Amex Blue Cash Everyday®",
    bestFor: "Online Shopping & Groceries",
    annualFee: 0,
    rates: { online: 0.03, grocery: 0.03, gas: 0.03, general: 0.01 },
    special:
      "Fixed 3% on U.S. online retail. Perfect for Amazon, Nike, and Walmart.com.",
  },
  {
    name: "Capital One Savor Student",
    bestFor: "Dining & Entertainment",
    annualFee: 0,
    rates: {
      dining: 0.03,
      grocery: 0.03,
      streaming: 0.03,
      entertainment: 0.08,
      general: 0.01,
    },
    special:
      "8% back on Capital One Entertainment. No foreign fees—great for studying abroad.",
  },
  {
    name: "Wells Fargo Autograph®",
    bestFor: "Transit & Travel",
    annualFee: 0,
    rates: {
      transit: 0.03,
      travel: 0.03,
      dining: 0.03,
      gas: 0.03,
      general: 0.01,
    },
    special:
      "Also includes 3% on EV charging / gas and phone plans. A heavy-hitter for students who drive.",
  },
  {
    name: "Wells Fargo Attune℠",
    bestFor: "Wellness & Lifestyle",
    annualFee: 0,
    rates: {
      wellness: 0.04,
      fitness: 0.04,
      entertainment: 0.04,
      transit: 0.04,
      general: 0.01,
    },
    special: "4% back on gym memberships, salons, and sports/concert tickets.",
  },
  {
    name: "Prime Visa",
    bestFor: "Amazon Power Users",
    annualFee: 0,
    rates: {
      amazon: 0.05,
      dining: 0.02,
      gas: 0.02,
      transit: 0.02,
      general: 0.01,
    },
    special:
      "5% back on Amazon and Whole Foods. Includes an instant $150 gift card upon approval.",
  },
  {
    name: "Wells Fargo Active Cash®",
    bestFor: "Flat 2% Catch-all",
    annualFee: 0,
    rates: { general: 0.02 },
    special:
      "$200 sign-up bonus. The standard for spending that doesn't fit a category.",
  },
  {
    name: "Citi Double Cash®",
    bestFor: "Simple 2% Rewards",
    annualFee: 0,
    rates: { general: 0.02 },
    special:
      "Earn 1% when you buy and 1% when you pay. Very stable for building credit.",
  },
  {
    name: "Apple Card",
    bestFor: "Apple Pay (2%)",
    annualFee: 0,
    rates: { apple_pay: 0.02, select_merchants: 0.03, general: 0.01 },
    special: "3% back at Nike, Uber, and T-Mobile using Apple Pay.",
  },
  {
    name: "Chase Freedom Unlimited®",
    bestFor: "Everyday Chase Spend",
    annualFee: 0,
    rates: {
      dining: 0.03,
      drugstores: 0.03,
      travel_portal: 0.05,
      general: 0.015,
    },
    special: "Unlimited 1.5% base rate with strong 3% bonus categories.",
  },
  {
    name: "SoFi Credit Card",
    bestFor: "Automated Investing",
    annualFee: 0,
    rates: { general: 0.02 },
    special: "2% back when deposited into SoFi savings or investing accounts.",
  },
  {
    name: "Chase Freedom Rise®",
    bestFor: "First-Time Approval",
    annualFee: 0,
    rates: { general: 0.015 },
    special:
      "Designed for zero history. Easier approval with a $250 Chase balance.",
  },
  {
    name: "Capital One Quicksilver Student",
    bestFor: "Flat 1.5% Rate",
    annualFee: 0,
    rates: { general: 0.015, travel_portal: 0.05 },
    special: "Straightforward 1.5% back on everything.",
  },
  {
    name: "Bank of America® Travel Rewards (Student)",
    bestFor: "Fixed Travel Earning",
    annualFee: 0,
    rates: { travel: 0.015, travel_portal: 0.03, general: 0.015 },
    special: "No foreign transaction fees. 25k bonus points after $1k spend.",
  },
  {
    name: "Discover it® Student Chrome",
    bestFor: "Simple Gas & Dining",
    annualFee: 0,
    rates: { gas: 0.02, dining: 0.02, general: 0.01 },
    special:
      "Fixed 2% at gas stations and restaurants. Year 1 match makes this 4%.",
  },
  {
    name: "Gemini Credit Card®",
    bestFor: "High Gas & Transit (4%)",
    annualFee: 0,
    rates: {
      gas: 0.04,
      transit: 0.04,
      dining: 0.03,
      grocery: 0.02,
      general: 0.01,
    },
    special:
      "Instant crypto rewards. The 4% on gas/transit is one of the highest fixed rates.",
  },
];
