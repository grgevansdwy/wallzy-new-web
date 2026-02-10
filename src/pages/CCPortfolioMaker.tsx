import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, RotateCcw, X, Check, Plus, Search, Sparkles, TrendingUp, DollarSign, CreditCard as CreditCardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { studentCards, CreditCard } from "@/lib/studentCards";
import logo from "@/assets/logo.png";
import { commonCards } from "@/lib/commonCards";

// Spending categories
const CATEGORIES = [
  { key: "grocery", label: "Groceries", icon: "🛒" },
  { key: "dining", label: "Dining", icon: "🍽️" },
  { key: "rent", label: "Rent", icon: "🏠" },
  { key: "gas", label: "Gas", icon: "⛽" },
  { key: "online", label: "Online Shopping", icon: "📦" },
  { key: "travel", label: "Travel", icon: "✈️" },
  { key: "streaming", label: "Streaming/Subscriptions", icon: "📺" },
  { key: "transit", label: "Transit", icon: "🚌" },
] as const;

type CategoryKey = "grocery" | "dining" | "rent" | "gas" | "online" | "travel" | "streaming" | "transit";

interface SpendingData {
  grocery: number;
  dining: number;
  rent: number;
  gas: number;
  online: number;
  travel: number;
  streaming: number;
  transit: number;
}

interface CustomCardRates {
  general: number;
  grocery?: number;
  dining?: number;
  rent?: number;
  gas?: number;
  online?: number;
  travel?: number;
  streaming?: number;
  transit?: number;
}

interface UserCard {
  name: string;
  rates: CustomCardRates;
  isCustom?: boolean;
  usesApplePay?: boolean;
  usesPayPal?: boolean;
  bofaChoiceCategory?: CategoryKey;
}

type ChatStep =
  | "welcome"
  | "card-selection"
  | "custom-card-input"
  | "follow-up-apple"
  | "follow-up-paypal"
  | "follow-up-bofa"
  | "spending-input"
  | "calculating"
  | "results"
  | "email-capture"
  | "complete";

// Cards that require follow-up questions
const APPLE_CARD_NAME = "Apple Card";
const PAYPAL_CARD_NAME = "PayPal Cashback Mastercard®";
const BOFA_CUSTOM_CARD_NAME = "BofA Customized Cash Rewards";

// BofA Custom category choices (6% promo for first year, then 3%)
const BOFA_CHOICE_CATEGORIES = [
  { key: "online", label: "Online Shopping", icon: "📦" },
  { key: "dining", label: "Dining", icon: "🍽️" },
  { key: "gas", label: "Gas & EV Charging", icon: "⛽" },
  { key: "travel", label: "Travel", icon: "✈️" },
  { key: "drugstores", label: "Drugstores", icon: "💊" },
  { key: "home", label: "Home Improvement & Furnishings", icon: "🏠" },
] as const;

// Cards with quarterly/rotating bonuses (don't use as primary recommendations)
const QUARTERLY_BONUS_CARDS = [
  "Chase Freedom Flex®",
  "Discover it® Student Cash Back",
];

const ChatBubble = ({
  children,
  isUser = false,
  delay = 0,
}: {
  children: React.ReactNode;
  isUser?: boolean;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3, delay }}
    className="w-full"
  >
    <div
      className={`rounded-2xl px-4 py-3 ${
        isUser
          ? "bg-wallzy-yellow text-wallzy-darkBlue"
          : "bg-white/10 text-wallzy-white border border-white/20"
      }`}
    >
      {children}
    </div>
  </motion.div>
);

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex space-x-1 p-4 bg-white/10 rounded-2xl w-fit border border-white/20"
  >
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-wallzy-lightBlue rounded-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </motion.div>
);

export default function CCPortfolioMaker() {
  const [step, setStep] = useState<ChatStep>("welcome");
  const [selectedCards, setSelectedCards] = useState<UserCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customCardName, setCustomCardName] = useState("");
  const [customCardRates, setCustomCardRates] = useState<CustomCardRates>({
    general: 1,
  });
  const [spending, setSpending] = useState<SpendingData>({
    grocery: 200,
    dining: 150,
    rent: 0,
    gas: 100,
    online: 100,
    travel: 50,
    streaming: 30,
    transit: 50,
  });
  const [showTyping, setShowTyping] = useState(false);
  const [email, setEmail] = useState("");
  const [results, setResults] = useState<{
    annualLoss: number;
    recommendedCards: CreditCard[];
    breakdown: { category: string; currentRate: number; optimalRate: number; monthlySaving: number }[];
    explanation: string;
  } | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Check if user has BILT card (for rent category logic)
  const hasBiltCard = selectedCards.some((c) => c.name === "Bilt Mastercard");

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [step, showTyping, selectedCards]);

  const simulateTyping = (callback: () => void, delay = 800) => {
    setShowTyping(true);
    setTimeout(() => {
      setShowTyping(false);
      callback();
    }, delay);
  };

  const handleStart = () => {
    simulateTyping(() => setStep("card-selection"));
  };

  const filteredCards = commonCards.filter((card) =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCard = (card: CreditCard) => {
    const exists = selectedCards.find((c) => c.name === card.name);
    if (exists) {
      setSelectedCards(selectedCards.filter((c) => c.name !== card.name));
    } else {
      setSelectedCards([
        ...selectedCards,
        { name: card.name, rates: card.rates as CustomCardRates },
      ]);
    }
  };

  const determineNextStep = (): ChatStep => {
    // Check if we need follow-up questions
    const appleCard = selectedCards.find((c) => c.name === APPLE_CARD_NAME);
    const paypalCard = selectedCards.find((c) => c.name === PAYPAL_CARD_NAME);
    const bofaCard = selectedCards.find((c) => c.name === BOFA_CUSTOM_CARD_NAME);

    if (appleCard && appleCard.usesApplePay === undefined) {
      return "follow-up-apple";
    }
    if (paypalCard && paypalCard.usesPayPal === undefined) {
      return "follow-up-paypal";
    }
    if (bofaCard && bofaCard.bofaChoiceCategory === undefined) {
      return "follow-up-bofa";
    }
    return "spending-input";
  };

  const handleCardSelectionDone = () => {
    simulateTyping(() => {
      const nextStep = determineNextStep();
      setStep(nextStep);
    });
  };

  const handleAddCustomCard = () => {
    setStep("custom-card-input");
  };

  const handleCustomCardSubmit = () => {
    if (customCardName.trim()) {
      setSelectedCards([
        ...selectedCards,
        { name: customCardName, rates: customCardRates, isCustom: true },
      ]);
      setCustomCardName("");
      setCustomCardRates({ general: 1 });
      simulateTyping(() => setStep("card-selection"));
    }
  };

  const handleApplePayResponse = (usesApplePay: boolean) => {
    setSelectedCards((cards) =>
      cards.map((card) =>
        card.name === APPLE_CARD_NAME
          ? {
              ...card,
              usesApplePay,
              rates: usesApplePay
                ? { ...card.rates, general: 0.02 } // Boost general to 2% if using Apple Pay
                : card.rates,
            }
          : card
      )
    );
    simulateTyping(() => {
      // Check remaining follow-ups
      const paypalCard = selectedCards.find((c) => c.name === PAYPAL_CARD_NAME);
      const bofaCard = selectedCards.find((c) => c.name === BOFA_CUSTOM_CARD_NAME);
      if (paypalCard && paypalCard.usesPayPal === undefined) {
        setStep("follow-up-paypal");
      } else if (bofaCard && bofaCard.bofaChoiceCategory === undefined) {
        setStep("follow-up-bofa");
      } else {
        setStep("spending-input");
      }
    });
  };

  const handlePayPalResponse = (usesPayPal: boolean) => {
    setSelectedCards((cards) =>
      cards.map((card) =>
        card.name === PAYPAL_CARD_NAME
          ? {
              ...card,
              usesPayPal,
              rates: usesPayPal
                ? { ...card.rates, general: 0.03 } // Boost general to 3% if using PayPal checkout
                : card.rates,
            }
          : card
      )
    );
    simulateTyping(() => {
      // Check remaining follow-ups
      const bofaCard = selectedCards.find((c) => c.name === BOFA_CUSTOM_CARD_NAME);
      if (bofaCard && bofaCard.bofaChoiceCategory === undefined) {
        setStep("follow-up-bofa");
      } else {
        setStep("spending-input");
      }
    });
  };

  const handleBofaChoiceResponse = (category: string) => {
    // Map the category to the actual rate key
    const categoryKey = category as CategoryKey;
    setSelectedCards((cards) =>
      cards.map((card) =>
        card.name === BOFA_CUSTOM_CARD_NAME
          ? {
              ...card,
              bofaChoiceCategory: categoryKey,
              rates: {
                ...card.rates,
                [categoryKey]: 0.06, // 6% promo rate for first year
              },
            }
          : card
      )
    );
    simulateTyping(() => setStep("spending-input"));
  };

  const handleSpendingDone = () => {
    setStep("calculating");
    setTimeout(() => {
      calculateResults();
    }, 1500);
  };

  const getCardRateForCategory = (
    card: UserCard,
    category: CategoryKey
  ): number => {
    const rates = card.rates;
    // Check for direct category match
    if (rates[category] !== undefined) return rates[category]!;
    // Fall back to general rate
    return rates.general || 0;
  };

  const getBestStudentCardForCategory = (
    category: CategoryKey,
    excludeQuarterlyCards = true
  ): { card: CreditCard; rate: number } | null => {
    let bestCard: CreditCard | null = null;
    let bestRate = 0;

    for (const card of studentCards) {
      // Skip quarterly bonus cards for primary recommendations
      if (excludeQuarterlyCards && QUARTERLY_BONUS_CARDS.includes(card.name)) {
        continue;
      }

      const rates = card.rates;
      let rate = rates.general || 0;

      // Check direct category
      if (category === "grocery" && rates.grocery) rate = Math.max(rate, rates.grocery);
      if (category === "dining" && rates.dining) rate = Math.max(rate, rates.dining);
      if (category === "rent" && rates.rent) rate = Math.max(rate, rates.rent);
      if (category === "gas" && rates.gas) rate = Math.max(rate, rates.gas);
      if (category === "online" && rates.online) rate = Math.max(rate, rates.online);
      if (category === "travel" && rates.travel) rate = Math.max(rate, rates.travel);
      if (category === "streaming" && rates.streaming) rate = Math.max(rate, rates.streaming);
      if (category === "transit" && rates.transit) rate = Math.max(rate, rates.transit);

      if (rate > bestRate) {
        bestRate = rate;
        bestCard = card;
      }
    }

    return bestCard ? { card: bestCard, rate: bestRate } : null;
  };

  const calculateResults = () => {
    const breakdown: {
      category: string;
      currentRate: number;
      optimalRate: number;
      monthlySaving: number;
    }[] = [];
    let totalMonthlyLoss = 0;
    const recommendedCardsSet = new Set<string>();
    const cardReasons: Record<string, string[]> = {};

    // Get categories based on BILT ownership
    const categoriesToCalculate = CATEGORIES;

    for (const cat of categoriesToCalculate) {
      const categoryKey = cat.key as CategoryKey;
      const monthlySpend = spending[categoryKey];
      if (monthlySpend === 0) continue;

      // Skip rent calculation if user doesn't have BILT (they pay via checking)
      if (categoryKey === "rent" && !hasBiltCard) continue;

      // Get best current rate from user's cards
      let currentBestRate = 0;
      for (const card of selectedCards) {
        const rate = getCardRateForCategory(card, categoryKey);
        if (rate > currentBestRate) currentBestRate = rate;
      }

      // Get best rate from student cards
      const optimalResult = getBestStudentCardForCategory(categoryKey);
      const optimalRate = optimalResult?.rate || 0;
      const optimalCard = optimalResult?.card;

      // Calculate monthly difference
      const currentReward = monthlySpend * currentBestRate;
      const optimalReward = monthlySpend * optimalRate;
      const monthlySaving = optimalReward - currentReward;

      if (monthlySaving > 0 && optimalCard) {
        totalMonthlyLoss += monthlySaving;
        recommendedCardsSet.add(optimalCard.name);
        if (!cardReasons[optimalCard.name]) cardReasons[optimalCard.name] = [];
        cardReasons[optimalCard.name].push(
          `${(optimalRate * 100).toFixed(0)}% on ${cat.label}`
        );
      }

      breakdown.push({
        category: cat.label,
        currentRate: currentBestRate * 100,
        optimalRate: optimalRate * 100,
        monthlySaving,
      });
    }

    // Always include BILT if user pays rent and doesn't have it
    if (spending.rent > 0 && !hasBiltCard) {
      const biltCard = studentCards.find((c) => c.name === "Bilt Mastercard");
      if (biltCard) {
        recommendedCardsSet.add(biltCard.name);
        if (!cardReasons[biltCard.name]) cardReasons[biltCard.name] = [];
        cardReasons[biltCard.name].unshift("1% on Rent (the only card that does this without fees!)");
        // Add potential rent rewards to total loss
        totalMonthlyLoss += spending.rent * 0.01;
        breakdown.unshift({
          category: "Rent",
          currentRate: 0,
          optimalRate: 1,
          monthlySaving: spending.rent * 0.01,
        });
      }
    }

    // Get the top 3-5 recommended cards
    const sortedCards = Array.from(recommendedCardsSet)
      .map((name) => studentCards.find((c) => c.name === name)!)
      .filter(Boolean)
      .slice(0, 5);

    // Generate explanation
    let explanation = "";
    if (sortedCards.length === 0) {
      explanation =
        "Great news! Your current card setup is already well-optimized. However, consider adding a flat-rate card like the Wells Fargo Active Cash for purchases that don't fall into bonus categories.";
    } else {
      explanation = `Based on your spending habits, we recommend building a portfolio of ${sortedCards.length} strategic cards. `;

      // BILT recommendation for renters
      if (spending.rent > 0 && !hasBiltCard) {
        explanation +=
          "**The Bilt Mastercard is essential** since it's the only card that earns rewards on rent payments without transaction fees—most people leave this money on the table by paying rent from a checking account. ";
      }

      const topCategories = breakdown
        .filter((b) => b.monthlySaving > 5)
        .sort((a, b) => b.monthlySaving - a.monthlySaving)
        .slice(0, 3);

      if (topCategories.length > 0) {
        explanation += `Your biggest opportunities for savings are in **${topCategories.map((c) => c.category).join(", ")}**. `;
      }

      // Flat rate card advice
      const hasFlatRate = sortedCards.some((c) =>
        c.name === "Wells Fargo Active Cash®" || c.name === "Citi Double Cash®"
      );
      if (!hasFlatRate && sortedCards.length < 5) {
        explanation +=
          "We also recommend adding a **2% flat-rate card** like Wells Fargo Active Cash for purchases that don't fit bonus categories. ";
      }

      // Quarterly bonus tips (not primary recommendations, but worth mentioning)
      const quarterlyTips: string[] = [];
      if (spending.dining > 0) {
        quarterlyTips.push("**Chase Freedom Flex** is offering 7% on dining this quarter (Q1 2026)");
      }
      if (spending.grocery > 0 || spending.streaming > 0) {
        quarterlyTips.push("**Discover it® Student** has 5% on groceries and streaming this quarter, plus first-year cashback match");
      }

      if (quarterlyTips.length > 0) {
        explanation += `**Quarterly Bonus Tip:** ${quarterlyTips.join(". Also, ")}. These rotate every 3 months, so we didn't include them in your annual calculation—but they're great for extra savings when the categories align! `;
      }
    }

    setResults({
      annualLoss: totalMonthlyLoss * 12,
      recommendedCards: sortedCards,
      breakdown: breakdown.filter((b) => b.monthlySaving > 0),
      explanation,
    });
    setStep("results");
  };

  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailSubmit = async () => {
    if (!email.trim() || !results) return;

    setIsSendingEmail(true);
    setEmailError(null);

    try {
      const response = await fetch("/api/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          annualLoss: results.annualLoss,
          recommendedCards: results.recommendedCards.map((card) => ({
            name: card.name,
            bestFor: card.bestFor,
            special: card.special,
          })),
          breakdown: results.breakdown,
          explanation: results.explanation,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      simulateTyping(() => setStep("complete"));
    } catch (error) {
      console.error("Email error:", error);
      setEmailError("Failed to send email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleReset = () => {
    setStep("welcome");
    setSelectedCards([]);
    setSearchQuery("");
    setCustomCardName("");
    setCustomCardRates({ general: 1 });
    setSpending({
      grocery: 200,
      dining: 150,
      rent: 0,
      gas: 100,
      online: 100,
      travel: 50,
      streaming: 30,
      transit: 50,
    });
    setEmail("");
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-wallzy-darkBlue flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <Link
          to="/"
          className="flex items-center text-primary-foreground font-black text-xl tracking-tight hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="Wallzy" className="h-12 w-12 -mr-4" />
          <span>allzy</span>
        </Link>
        <h1 className="text-wallzy-white font-bold text-xl md:text-2xl">Credit Card Portfolio Builder</h1>
        {/* Spacer to keep title centered */}
        <div className="w-12" />
      </header>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full"
      >
        {/* Welcome Message */}
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] relative"
            >
              {/* Background glow effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-wallzy-lightBlue/10 blur-[100px]"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-wallzy-yellow/8 blur-[80px]"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </div>

              {/* Floating credit card illustrations */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Card 1 - top right */}
                <motion.div
                  className="absolute top-[8%] right-[5%] md:right-[10%] w-32 md:w-44 h-20 md:h-28 rounded-xl bg-gradient-to-br from-wallzy-lightBlue/40 to-wallzy-lightBlue/20 border border-white/20 shadow-lg backdrop-blur-sm"
                  initial={{ opacity: 0, x: 50, rotate: 12 }}
                  animate={{ opacity: 1, x: 0, rotate: 12, y: [0, -15, 0] }}
                  transition={{ opacity: { duration: 0.8, delay: 0.2 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                >
                  <div className="absolute top-3 left-3 w-6 md:w-8 h-6 md:h-8 rounded-full bg-white/20" />
                  <div className="absolute bottom-3 right-3 w-10 md:w-14 h-2 md:h-3 rounded-full bg-white/25" />
                  <div className="absolute bottom-3 left-3 w-6 md:w-8 h-2 md:h-3 rounded-full bg-white/15" />
                </motion.div>

                {/* Card 2 - top left */}
                <motion.div
                  className="absolute top-[12%] left-[2%] md:left-[8%] w-28 md:w-40 h-18 md:h-24 rounded-xl bg-gradient-to-br from-wallzy-yellow/50 to-wallzy-yellow/25 border border-wallzy-yellow/30 shadow-lg"
                  initial={{ opacity: 0, x: -50, rotate: -8 }}
                  animate={{ opacity: 1, x: 0, rotate: -8, y: [0, -12, 0] }}
                  transition={{ opacity: { duration: 0.8, delay: 0.4 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
                >
                  <div className="absolute top-3 left-3 w-5 md:w-7 h-5 md:h-7 rounded-full bg-wallzy-darkBlue/30" />
                  <div className="absolute bottom-2 right-3 w-8 md:w-12 h-2 rounded-full bg-wallzy-darkBlue/20" />
                </motion.div>

                {/* Card 3 - bottom left */}
                <motion.div
                  className="absolute bottom-[15%] left-[3%] md:left-[12%] w-24 md:w-36 h-16 md:h-22 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/15 shadow-lg backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30, rotate: 6 }}
                  animate={{ opacity: 1, y: [0, -10, 0], rotate: 6 }}
                  transition={{ opacity: { duration: 0.8, delay: 0.6 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 } }}
                >
                  <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-white/20" />
                </motion.div>

                {/* Card 4 - bottom right */}
                <motion.div
                  className="absolute bottom-[18%] right-[3%] md:right-[8%] w-26 md:w-38 h-16 md:h-24 rounded-xl bg-gradient-to-br from-emerald-400/30 to-emerald-600/15 border border-emerald-400/20 shadow-lg"
                  initial={{ opacity: 0, y: 30, rotate: -10 }}
                  animate={{ opacity: 1, y: [0, -14, 0], rotate: -10 }}
                  transition={{ opacity: { duration: 0.8, delay: 0.8 }, y: { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
                >
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/15" />
                  <div className="absolute bottom-2 left-2 w-8 h-2 rounded-full bg-white/20" />
                </motion.div>

                {/* Floating sparkle particles */}
                {[
                  { top: "20%", left: "20%", delay: 0, duration: 3 },
                  { top: "30%", right: "25%", delay: 1, duration: 4 },
                  { top: "60%", left: "15%", delay: 2, duration: 3.5 },
                  { top: "70%", right: "18%", delay: 0.5, duration: 4.5 },
                  { top: "45%", left: "80%", delay: 1.5, duration: 3 },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-wallzy-yellow/60 rounded-full"
                    style={{ top: pos.top, left: pos.left, right: (pos as { right?: string }).right }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: pos.duration,
                      repeat: Infinity,
                      delay: pos.delay,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Main content */}
              <div className="relative z-10 text-center max-w-xl mx-auto px-4">
                {/* Icon badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-wallzy-yellow to-wallzy-yellow/80 shadow-lg shadow-wallzy-yellow/25 mb-6"
                >
                  <CreditCardIcon className="w-8 h-8 md:w-10 md:h-10 text-wallzy-darkBlue" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight"
                >
                  Maximize Your{" "}
                  <span className="text-wallzy-yellow">Rewards</span>
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-base md:text-lg text-white/70 mb-8 max-w-md mx-auto"
                >
                  Find out how much you're leaving on the table and get a
                  personalized student-friendly card portfolio.
                </motion.p>

                {/* Feature pills */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap justify-center gap-3 mb-10"
                >
                  {[
                    { icon: TrendingUp, label: "Savings Analysis" },
                    { icon: Sparkles, label: "Smart Recommendations" },
                    { icon: DollarSign, label: "No Annual Fees" },
                  ].map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 text-sm"
                    >
                      <Icon className="w-3.5 h-3.5 text-wallzy-yellow" />
                      {label}
                    </span>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <Button
                    onClick={handleStart}
                    className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-bold px-10 py-6 text-lg rounded-full shadow-lg shadow-wallzy-yellow/20 hover:shadow-wallzy-yellow/30 transition-all hover:scale-105 group"
                  >
                    Let's Go!
                    <motion.span
                      className="ml-2 inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.span>
                  </Button>
                </motion.div>

                {/* Trust line */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-xs text-white/40 mt-6"
                >
                  Takes about 2 minutes — no sign-up required
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Card Selection */}
          {step === "card-selection" && (
            <motion.div
              key="card-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium mb-1">
                  Which credit cards do you currently use?
                </p>
                <p className="text-sm text-wallzy-white/70">
                  Select all that apply. If you don't see your card, you can add
                  it manually.
                </p>
              </ChatBubble>

              {selectedCards.length > 0 && (
                <ChatBubble isUser delay={0.1}>
                  <div className="flex flex-wrap gap-2">
                    {selectedCards.map((card) => (
                      <span
                        key={card.name}
                        className="inline-flex items-center gap-1 bg-wallzy-darkBlue/30 px-2 py-1 rounded-full text-sm"
                      >
                        {card.name}
                        <button
                          onClick={() =>
                            setSelectedCards(
                              selectedCards.filter((c) => c.name !== card.name)
                            )
                          }
                          className="hover:bg-wallzy-darkBlue/50 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </ChatBubble>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/10"
              >
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wallzy-white/50" />
                  <Input
                    type="text"
                    placeholder="Search cards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-wallzy-white placeholder:text-wallzy-white/50"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredCards.map((card) => {
                    const isSelected = selectedCards.some(
                      (c) => c.name === card.name
                    );
                    return (
                      <button
                        key={card.name}
                        onClick={() => toggleCard(card)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                          isSelected
                            ? "bg-wallzy-yellow/20 border border-wallzy-yellow"
                            : "bg-white/5 hover:bg-white/10 border border-transparent"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center ${
                            isSelected
                              ? "bg-wallzy-yellow"
                              : "border border-white/30"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-wallzy-darkBlue" />
                          )}
                        </div>
                        <div>
                          <p className="text-wallzy-white font-medium text-sm">
                            {card.name}
                          </p>
                          <p className="text-wallzy-white/60 text-xs">
                            {card.bestFor}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleAddCustomCard}
                  className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/30 text-wallzy-white/70 hover:bg-white/5 hover:text-wallzy-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add a card not listed</span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center gap-3"
              >
                <Button
                  onClick={handleCardSelectionDone}
                  className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full"
                >
                  {selectedCards.length === 0
                    ? "I don't have any cards"
                    : "Continue"}
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Custom Card Input */}
          {step === "custom-card-input" && (
            <motion.div
              key="custom-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium mb-1">Tell me about your card</p>
                <p className="text-sm text-wallzy-white/70">
                  Enter the card name and its reward rates so I can calculate
                  accurately.
                </p>
              </ChatBubble>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-4"
              >
                <div>
                  <label className="text-wallzy-white/70 text-sm mb-1 block">
                    Card Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., My Bank Rewards Card"
                    value={customCardName}
                    onChange={(e) => setCustomCardName(e.target.value)}
                    className="bg-white/10 border-white/20 text-wallzy-white placeholder:text-wallzy-white/50"
                  />
                </div>

                <div>
                  <label className="text-wallzy-white/70 text-sm mb-1 block">
                    Base Cashback Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    value={customCardRates.general * 100}
                    onChange={(e) =>
                      setCustomCardRates({
                        ...customCardRates,
                        general: parseFloat(e.target.value) / 100 || 0,
                      })
                    }
                    className="bg-white/10 border-white/20 text-wallzy-white"
                  />
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-wallzy-white/70 text-sm mb-3">
                    Category Bonuses (optional - enter % values)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map((cat) => (
                      <div key={cat.key}>
                        <label className="text-wallzy-white/60 text-xs mb-1 block">
                          {cat.icon} {cat.label} (%)
                        </label>
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          placeholder="0"
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val > 0) {
                              setCustomCardRates({
                                ...customCardRates,
                                [cat.key]: val / 100,
                              });
                            }
                          }}
                          className="bg-white/10 border-white/20 text-wallzy-white text-sm h-9"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => setStep("card-selection")}
                  variant="outline"
                  className="border-wallzy-lightBlue text-wallzy-lightBlue hover:bg-wallzy-lightBlue/20 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCustomCardSubmit}
                  disabled={!customCardName.trim()}
                  className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full disabled:opacity-50"
                >
                  Add Card
                </Button>
              </div>
            </motion.div>
          )}

          {/* Follow-up: Apple Pay */}
          {step === "follow-up-apple" && (
            <motion.div
              key="follow-up-apple"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium mb-1">Quick question about your Apple Card!</p>
                <p className="text-sm text-wallzy-white/70">
                  Do you primarily use Apple Pay for your purchases? The Apple Card gives 2% back when you use Apple Pay, but only 1% for regular swipes.
                </p>
              </ChatBubble>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center gap-3"
              >
                <Button
                  onClick={() => handleApplePayResponse(true)}
                  className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full"
                >
                  Yes, I use Apple Pay
                </Button>
                <Button
                  onClick={() => handleApplePayResponse(false)}
                  variant="outline"
                  className="border-white/20 text-wallzy-white hover:bg-white/10 rounded-full"
                >
                  No, I swipe/insert
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Follow-up: PayPal */}
          {step === "follow-up-paypal" && (
            <motion.div
              key="follow-up-paypal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium mb-1">Quick question about your PayPal Card!</p>
                <p className="text-sm text-wallzy-white/70">
                  Do you frequently use PayPal checkout when shopping online? The PayPal Cashback card gives 3% back on PayPal purchases, but only 1.5% otherwise.
                </p>
              </ChatBubble>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center gap-3"
              >
                <Button
                  onClick={() => handlePayPalResponse(true)}
                  className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full"
                >
                  Yes, I use PayPal often
                </Button>
                <Button
                  onClick={() => handlePayPalResponse(false)}
                  variant="outline"
                  className="border-white/20 text-wallzy-white hover:bg-white/10 rounded-full"
                >
                  No, not really
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Follow-up: BofA Custom Category */}
          {step === "follow-up-bofa" && (
            <motion.div
              key="follow-up-bofa"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium mb-1">Which category did you choose for your BofA Customized Cash?</p>
                <p className="text-sm text-wallzy-white/70">
                  BofA is currently offering 6% back on your chosen category for the first year (then 3%). Select which category you picked:
                </p>
              </ChatBubble>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/10"
              >
                <div className="grid grid-cols-2 gap-2">
                  {BOFA_CHOICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => handleBofaChoiceResponse(cat.key)}
                      className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-wallzy-yellow/20 hover:border-wallzy-yellow border border-transparent transition-colors text-left"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-wallzy-white text-sm font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Spending Input */}
          {step === "spending-input" && (
            <motion.div
              key="spending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium mb-1">
                  How much do you spend monthly in each category?
                </p>
                <p className="text-sm text-wallzy-white/70">
                  Adjust the sliders or type exact amounts. This helps me
                  calculate your potential rewards.
                </p>
              </ChatBubble>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-6"
              >
                {CATEGORIES.map((cat) => {
                  const categoryKey = cat.key as CategoryKey;
                  return (
                    <div key={cat.key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-wallzy-white flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span className="text-sm font-medium">{cat.label}</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-wallzy-white/70">$</span>
                          <Input
                            type="number"
                            min="0"
                            max="5000"
                            value={spending[categoryKey]}
                            onChange={(e) =>
                              setSpending({
                                ...spending,
                                [categoryKey]: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20 h-8 text-right bg-white/10 border-white/20 text-wallzy-white text-sm"
                          />
                        </div>
                      </div>
                      <Slider
                        value={[spending[categoryKey]]}
                        onValueChange={([value]) =>
                          setSpending({ ...spending, [categoryKey]: value })
                        }
                        max={categoryKey === "rent" ? 3000 : 1000}
                        step={10}
                        className="[&_[role=slider]]:bg-wallzy-yellow [&_[role=slider]]:border-wallzy-yellow [&_.bg-primary]:bg-wallzy-lightBlue"
                      />
                    </div>
                  );
                })}

              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center"
              >
                <Button
                  onClick={handleSpendingDone}
                  className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-8 rounded-full"
                >
                  Calculate My Savings
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Calculating */}
          {step === "calculating" && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p>Analyzing your spending patterns...</p>
              </ChatBubble>
              <TypingIndicator />
            </motion.div>
          )}

          {/* Results */}
          {step === "results" && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium">Here's what I found:</p>
              </ChatBubble>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-wallzy-yellow/20 to-wallzy-lightBlue/20 rounded-2xl p-6 border border-wallzy-yellow/30 text-center"
              >
                <p className="text-wallzy-white/70 text-sm mb-2">
                  You're leaving on the table annually:
                </p>
                <p className="text-5xl md:text-6xl font-bold text-wallzy-yellow mb-2">
                  ${results.annualLoss.toFixed(0)}
                </p>
                <p className="text-wallzy-white/60 text-sm">
                  That's ${(results.annualLoss / 12).toFixed(0)}/month in lost rewards
                </p>
              </motion.div>

              {results.breakdown.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 rounded-2xl p-4 border border-white/10"
                >
                  <p className="text-wallzy-white font-medium mb-3">
                    Savings Breakdown
                  </p>
                  <div className="space-y-2">
                    {results.breakdown.map((item) => (
                      <div
                        key={item.category}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-wallzy-white/70">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-wallzy-white/50">
                            {item.currentRate.toFixed(0)}%
                          </span>
                          <span className="text-wallzy-white/30">→</span>
                          <span className="text-wallzy-lightBlue">
                            {item.optimalRate.toFixed(0)}%
                          </span>
                          <span className="text-wallzy-yellow font-medium">
                            +${item.monthlySaving.toFixed(0)}/mo
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {results.recommendedCards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/5 rounded-2xl p-4 border border-white/10"
                >
                  <p className="text-wallzy-white font-medium mb-3">
                    Your Recommended Portfolio
                  </p>
                  <div className="space-y-3">
                    {results.recommendedCards.map((card, index) => (
                      <motion.div
                        key={card.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="bg-white/5 rounded-xl p-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-wallzy-yellow flex items-center justify-center text-wallzy-darkBlue font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-wallzy-white font-medium">
                              {card.name}
                            </p>
                            <p className="text-wallzy-lightBlue text-sm">
                              {card.bestFor}
                            </p>
                            <p className="text-wallzy-white/60 text-xs mt-1">
                              {card.special}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <ChatBubble delay={0.8}>
                <div
                  className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: results.explanation
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-wallzy-yellow">$1</strong>')
                  }}
                />
              </ChatBubble>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex justify-center"
              >
                <Button
                  onClick={() => setStep("email-capture")}
                  className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-8 rounded-full"
                >
                  Save My Results
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Email Capture */}
          {step === "email-capture" && (
            <motion.div
              key="email"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium mb-1">Almost done!</p>
                <p className="text-sm text-wallzy-white/70">
                  Enter your email to receive your personalized portfolio
                  recommendations and get notified when Wallzy launches.
                </p>
              </ChatBubble>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/10"
              >
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(null);
                  }}
                  disabled={isSendingEmail}
                  className="bg-white/10 border-white/20 text-wallzy-white placeholder:text-wallzy-white/50 mb-3 disabled:opacity-50"
                />
                {emailError && (
                  <p className="text-red-400 text-sm mb-3">{emailError}</p>
                )}
                <Button
                  onClick={handleEmailSubmit}
                  disabled={!email.trim() || !email.includes("@") || isSendingEmail}
                  className="w-full bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold rounded-full disabled:opacity-50"
                >
                  {isSendingEmail ? "Sending..." : "Send My Results"}
                </Button>
              </motion.div>

              <button
                onClick={() => setStep("complete")}
                disabled={isSendingEmail}
                className="w-full text-center text-wallzy-white/50 text-sm hover:text-wallzy-white/70 disabled:opacity-30"
              >
                Skip for now
              </button>
            </motion.div>
          )}

          {/* Complete */}
          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium mb-2">You're all set!</p>
                <p className="text-sm text-wallzy-white/70">
                  Start building your optimized credit card portfolio today. Each
                  card you add is a step towards maximizing your rewards.
                </p>
              </ChatBubble>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-3 items-center"
              >
                <Button
                  onClick={handleReset}
                  className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-8 py-6 text-lg rounded-full"
                >
                  Start Over
                </Button>
                <Link
                  to="/"
                  className="text-wallzy-lightBlue hover:text-wallzy-yellow text-sm"
                >
                  Learn more about Wallzy →
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showTyping && <TypingIndicator />}
      </div>

      {/* Floating Reset Button */}
      {step !== "welcome" && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleReset}
          className="fixed bottom-6 right-6 w-12 h-12 bg-wallzy-yellow text-wallzy-darkBlue rounded-full shadow-lg flex items-center justify-center hover:bg-wallzy-yellow/90 transition-colors z-50"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
