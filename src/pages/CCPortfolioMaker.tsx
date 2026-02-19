import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  MessageCircle,
  X,
  Check,
  Plus,
  Search,
  Sparkles,
  DollarSign,
  CreditCard as CreditCardIcon,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  User,
  ChevronUp,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logo from "@/assets/logo.png";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import cardDB from "@/lib/cardDB.json";
import {
  type CardDBEntry,
  type CategoryKey,
  type UserCreditProfile,
  type UserOwnedCard,
  type PortfolioStrategy,
  type FollowUpQuestion,
  getFollowUpQuestions,
  applyFollowUpAnswer,
  generatePortfolioStrategy,
  EXTRA_CATEGORY_OPTIONS,
  EXTRA_CATEGORY_GROUP_LABELS,
  REWARD_KEY_LABELS,
  CATEGORY_MAP,
} from "@/lib/portfolioEngine";

// ── Constants ──────────────────────────────────────────────────────────

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
  [key: string]: number | undefined;
}

type ChatStep =
  | "welcome"
  | "credit-profile"
  | "card-selection"
  | "custom-card-input"
  | "oldest-card-select"
  | "follow-up-special"
  | "spending-input"
  | "calculating"
  | "results"
  | "email-capture"
  | "complete";

const allCards = cardDB as unknown as CardDBEntry[];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // 1-indexed
const YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i);

// ── Shared UI Components ───────────────────────────────────────────────

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

// ── Main Component ─────────────────────────────────────────────────────

// ── Cards Table Component ─────────────────────────────────────────────

type SortKey = "name" | "annual_fee" | "base" | "bonus_value";
type SortDir = "asc" | "desc";

function CardsTable() {
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [feeFilter, setFeeFilter] = useState<
    "" | "no_fee" | "under_100" | "100_plus"
  >("");
  const [networkFilter, setNetworkFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const brands = useMemo(
    () => [...new Set(allCards.map((c) => c.brand))].sort(),
    [],
  );
  const networks = useMemo(
    () =>
      [
        ...new Set(allCards.map((c) => c.metadata?.network).filter(Boolean)),
      ].sort() as string[],
    [],
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 text-white/20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-wallzy-yellow" />
    ) : (
      <ChevronDown className="w-3 h-3 text-wallzy-yellow" />
    );
  };

  const filtered = useMemo(() => {
    let cards = [...allCards];

    if (search) {
      const q = search.toLowerCase();
      cards = cards.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q),
      );
    }
    if (brandFilter) {
      cards = cards.filter((c) => c.brand === brandFilter);
    }
    if (networkFilter) {
      cards = cards.filter((c) => c.metadata?.network === networkFilter);
    }
    if (feeFilter === "no_fee") {
      cards = cards.filter((c) => c.annual_fee === 0);
    } else if (feeFilter === "under_100") {
      cards = cards.filter((c) => c.annual_fee > 0 && c.annual_fee < 100);
    } else if (feeFilter === "100_plus") {
      cards = cards.filter((c) => c.annual_fee >= 100);
    }

    cards.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "annual_fee":
          cmp = a.annual_fee - b.annual_fee;
          break;
        case "base":
          cmp = (a.rewards.base ?? 0) - (b.rewards.base ?? 0);
          break;
        case "bonus_value":
          cmp = (a.metadata?.bonus_value ?? 0) - (b.metadata?.bonus_value ?? 0);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return cards;
  }, [search, brandFilter, networkFilter, feeFilter, sortKey, sortDir]);

  const formatRate = (rate: number) => {
    const pct = rate * 100;
    // Remove trailing zeros but keep necessary decimals (1.25% stays 1.25%, not 1.3%)
    return `${parseFloat(pct.toPrecision(10))}%`;
  };

  const getAllRewards = (card: CardDBEntry) => {
    const lines: { label: string; rate: string }[] = [];

    // Special category types first
    if (card.rewards.top_category !== undefined) {
      lines.push({
        label: "Top Category",
        rate: formatRate(card.rewards.top_category),
      });
    }
    if (card.rewards.custom !== undefined) {
      lines.push({
        label: "Custom Category",
        rate: formatRate(card.rewards.custom),
      });
    }
    if (card.rewards.rotating_categories !== undefined) {
      lines.push({
        label: "Rotating Categories",
        rate: formatRate(card.rewards.rotating_categories),
      });
    }
    if (card.rewards.chosen_category !== undefined) {
      lines.push({
        label: "Chosen Category",
        rate: formatRate(card.rewards.chosen_category),
      });
    }
    if (card.rewards.second_category !== undefined) {
      lines.push({
        label: "2nd Category",
        rate: formatRate(card.rewards.second_category),
      });
    }

    // Regular bonus categories (exclude base and specials)
    const specials = new Set([
      "base",
      "top_category",
      "custom",
      "rotating_categories",
      "chosen_category",
      "second_category",
    ]);
    Object.entries(card.rewards)
      .filter(([k]) => !specials.has(k))
      .sort(([, a], [, b]) => b - a)
      .forEach(([k, v]) => {
        const label = REWARD_KEY_LABELS[k] || k.replace(/_/g, " ");
        lines.push({ label, rate: formatRate(v) });
      });

    return lines;
  };

  return (
    <div className="min-h-screen bg-wallzy-darkBlue flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <Link
          to="/"
          className="flex items-center text-primary-foreground font-black text-xl tracking-tight hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="Wallzy" className="h-12 w-12 -mr-4" />
          <span>allzy</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/byw"
            className="text-white/50 hover:text-white text-sm font-medium transition-colors"
          >
            Build Wallet
          </Link>
          <Link
            to="/byw/cards"
            className="text-wallzy-yellow text-sm font-semibold border-b-2 border-wallzy-yellow pb-0.5"
          >
            Supported Cards
          </Link>
        </div>
        <div className="w-12" />
      </header>

      <div className="flex-1 overflow-y-auto p-4 max-w-6xl mx-auto w-full">
        <h2 className="text-white text-2xl font-bold mb-4">
          All Supported Cards
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              type="text"
              placeholder="Search cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <Select
            value={brandFilter || "all_issuers"}
            onValueChange={(v) => setBrandFilter(v === "all_issuers" ? "" : v)}
          >
            <SelectTrigger className="w-[160px] bg-white/10 border-white/20 text-white text-sm">
              <SelectValue placeholder="All Issuers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_issuers">All Issuers</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={networkFilter || "all_networks"}
            onValueChange={(v) =>
              setNetworkFilter(v === "all_networks" ? "" : v)
            }
          >
            <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white text-sm">
              <SelectValue placeholder="All Networks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_networks">All Networks</SelectItem>
              {networks.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fee chips */}
        <div className="flex gap-2 mb-4">
          {[
            { value: "" as const, label: "All Fees" },
            { value: "no_fee" as const, label: "No Fee" },
            { value: "under_100" as const, label: "Under $100" },
            { value: "100_plus" as const, label: "$100+" },
          ].map((chip) => (
            <button
              key={chip.value}
              onClick={() => setFeeFilter(chip.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                feeFilter === chip.value
                  ? "bg-wallzy-yellow text-wallzy-darkBlue"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-white/70">
                <th
                  className="text-left p-3 font-medium cursor-pointer select-none w-[220px] max-w-[220px]"
                  onClick={() => toggleSort("name")}
                >
                  <span className="inline-flex items-center gap-1">
                    Card <SortIcon col="name" />
                  </span>
                </th>
                <th
                  className="text-right p-3 font-medium cursor-pointer select-none"
                  onClick={() => toggleSort("annual_fee")}
                >
                  <span className="inline-flex items-center gap-1 justify-end">
                    Fee <SortIcon col="annual_fee" />
                  </span>
                </th>
                <th
                  className="text-right p-3 font-medium cursor-pointer select-none"
                  onClick={() => toggleSort("base")}
                >
                  <span className="inline-flex items-center gap-1 justify-end">
                    Base <SortIcon col="base" />
                  </span>
                </th>
                <th className="text-left p-3 font-medium">Rewards</th>
                <th
                  className="text-right p-3 font-medium cursor-pointer select-none"
                  onClick={() => toggleSort("bonus_value")}
                >
                  <span className="inline-flex items-center gap-1 justify-end">
                    Bonus <SortIcon col="bonus_value" />
                  </span>
                </th>
                <th className="text-center p-3 font-medium hidden lg:table-cell">
                  Foreign Fee
                </th>
                <th className="text-center p-3 font-medium hidden lg:table-cell">
                  Network
                </th>
                <th className="text-center p-3 font-medium hidden xl:table-cell">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((card) => (
                <tr
                  key={card.id}
                  className="border-t border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-3 w-[300px] max-w-[300px]">
                    <p className="text-white font-medium">{card.name}</p>
                    <p className="text-white/40 text-xs">{card.brand}</p>
                    {card.metadata?.comment_general && (
                      <p className="text-amber-300/70 text-xs mt-0.5">
                        {card.metadata.comment_general}
                      </p>
                    )}
                  </td>
                  <td className="p-3 text-right text-white/80">
                    {card.annual_fee === 0 ? "$0" : `$${card.annual_fee}`}
                  </td>
                  <td className="p-3 text-right text-white/80">
                    {formatRate(card.rewards.base ?? 0)}
                  </td>
                  <td className="p-3 text-white/60 text-xs">
                    {(() => {
                      const rewards = getAllRewards(card);
                      if (rewards.length === 0) return "\u2014";
                      return (
                        <div className="flex flex-col gap-0.5">
                          {rewards.map((r, i) => (
                            <span key={i}>
                              {r.label}: {r.rate}
                            </span>
                          ))}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="p-3 text-right text-white/80">
                    {card.metadata?.bonus_value
                      ? `$${card.metadata.bonus_value}`
                      : "\u2014"}
                  </td>
                  <td className="p-3 text-center text-white/60 hidden lg:table-cell">
                    {card.metadata?.foreign_fee === false
                      ? "No"
                      : card.metadata?.foreign_fee === true
                        ? "Yes"
                        : "\u2014"}
                  </td>
                  <td className="p-3 text-center text-white/60 hidden lg:table-cell">
                    {card.metadata?.network ?? "\u2014"}
                  </td>
                  <td className="p-3 text-center text-white/60 hidden xl:table-cell">
                    {card.metadata?.rewards_type ?? "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-white/40">
              No cards match your filters.
            </div>
          )}
        </div>

        <p className="text-white/30 text-xs mt-4 text-center">
          {filtered.length} of {allCards.length} cards shown
        </p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────

export default function CCPortfolioMaker() {
  const location = useLocation();

  // If on /byw/cards, render the cards table
  if (location.pathname === "/byw/cards") {
    return <CardsTable />;
  }

  return <PortfolioBuilder />;
}

function PortfolioBuilder() {
  // Flow state
  const [step, setStep] = useState<ChatStep>("welcome");
  const [showTyping, setShowTyping] = useState(false);

  // Credit profile
  const [creditProfile, setCreditProfile] = useState<UserCreditProfile>({
    creditScore: 0,
    creditAge: 0,
    cardsOpened24mo: 0,
    feePreference: false,
  });
  const [feeSelected, setFeeSelected] = useState(false);
  const [profileTouched, setProfileTouched] = useState({
    creditScore: false,
    creditAge: false,
    cardsOpened24mo: false,
  });
  // Oldest card date (month/year dropdowns)
  const [oldestCardMonth, setOldestCardMonth] = useState(0);
  const [oldestCardYear, setOldestCardYear] = useState(0);

  // Card selection
  const [ownedCards, setOwnedCards] = useState<UserOwnedCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customCardName, setCustomCardName] = useState("");
  const [customCardFee, setCustomCardFee] = useState(0);
  const [customCardRates, setCustomCardRates] = useState<CustomCardRates>({
    general: 0,
  });
  const [customCardBonusKeys, setCustomCardBonusKeys] = useState<string[]>([]);
  const [showAddBonus, setShowAddBonus] = useState(false);
  const [bonusCategorySearch, setBonusCategorySearch] = useState("");

  // Oldest card selection
  const [oldestCardId, setOldestCardId] = useState<string | null>(null);

  // Follow-ups
  const [followUpQueue, setFollowUpQueue] = useState<FollowUpQuestion[]>([]);
  const [currentFollowUpIndex, setCurrentFollowUpIndex] = useState(0);
  const [followUpSelectedKey, setFollowUpSelectedKey] = useState<string | null>(
    null,
  );

  // Spending
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

  // Extra spending categories
  const [extraSpending, setExtraSpending] = useState<Record<string, number>>(
    {},
  );
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [extraCategorySearch, setExtraCategorySearch] = useState("");

  // Welcome animation
  const [walletClicked, setWalletClicked] = useState(false);

  // Disclaimer
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackError, setFeedbackError] = useState(false);

  // Results
  const [strategy, setStrategy] = useState<PortfolioStrategy | null>(null);

  // Email
  const [email, setEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Firebase progress tracking — doc ID persists across steps, resets on refresh
  const bywDocId = useRef<string | null>(null);

  const saveProgress = async (data: Record<string, any>) => {
    try {
      if (bywDocId.current) {
        await updateDoc(doc(db, "build-your-wallet", bywDocId.current), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      } else {
        const docRef = await addDoc(collection(db, "build-your-wallet"), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        bywDocId.current = docRef.id;
      }
    } catch (err) {
      console.error("BYW progress save error:", err);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [step, showTyping, ownedCards]);

  const simulateTyping = (callback: () => void, delay = 800) => {
    setShowTyping(true);
    setTimeout(() => {
      setShowTyping(false);
      callback();
    }, delay);
  };

  // ── Step handlers ──────────────────────────────────────────────────

  const handleStart = () => {
    setShowDisclaimer(true);
  };

  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false);
    simulateTyping(() => setStep("credit-profile"));
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim() || feedbackSending) return;
    setFeedbackSending(true);
    setFeedbackError(false);
    try {
      await addDoc(collection(db, "feedback-byw"), {
        feedback: feedbackText.trim(),
        timestamp: serverTimestamp(),
      });
      setFeedbackSent(true);
      setFeedbackText("");
    } catch (err) {
      console.error("Feedback submit error:", err);
      setFeedbackError(true);
    } finally {
      setFeedbackSending(false);
    }
  };

  const handleCreditProfileDone = () => {
    saveProgress({
      creditScore: creditProfile.creditScore,
      creditCardsCount: creditProfile.cardsOpened24mo,
      feePreference: creditProfile.feePreference,
    });
    simulateTyping(() => setStep("card-selection"));
  };

  // Card search
  const filteredCards = allCards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.brand.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleCard = (card: CardDBEntry) => {
    const exists = ownedCards.find((c) => c.cardId === card.id);
    if (exists) {
      setOwnedCards(ownedCards.filter((c) => c.cardId !== card.id));
      if (oldestCardId === card.id) setOldestCardId(null);
    } else {
      setOwnedCards([
        ...ownedCards,
        {
          cardId: card.id,
          name: card.name,
          resolvedRewards: { ...card.rewards },
          annual_fee: card.annual_fee,
        },
      ]);
    }
  };

  const handleCardSelectionDone = () => {
    saveProgress({
      creditCardsCount: ownedCards.length,
      ownedCardNames: ownedCards.map((c) => c.name),
    });
    if (ownedCards.length === 0) {
      // No cards: skip oldest card question, set creditAge to 0
      setCreditProfile((prev) => ({ ...prev, creditAge: 0 }));
      proceedAfterOldestCard();
    } else if (ownedCards.length === 1) {
      // 1 card: auto-select it, go to simplified oldest-card-select for date
      setOldestCardId(ownedCards[0].cardId);
      simulateTyping(() => setStep("oldest-card-select"));
    } else {
      // 2+ cards: go to oldest-card-select to pick card + date
      simulateTyping(() => setStep("oldest-card-select"));
    }
  };

  const handleOldestCardDone = () => {
    // Calculate creditAge from oldest card month/year
    let computedAge = 0;
    if (oldestCardMonth > 0 && oldestCardYear > 0) {
      const now = new Date();
      const opened = new Date(oldestCardYear, oldestCardMonth - 1, 1);
      const diffMs = now.getTime() - opened.getTime();
      const diffYears = Math.max(0, diffMs / (1000 * 60 * 60 * 24 * 365.25));
      computedAge = Math.round(diffYears * 2) / 2;
      setCreditProfile((prev) => ({
        ...prev,
        creditAge: computedAge,
      }));
    }
    saveProgress({ oldestCardAge: computedAge });
    proceedAfterOldestCard();
  };

  const proceedAfterOldestCard = () => {
    // Build follow-up queue
    const questions = getFollowUpQuestions(ownedCards, allCards);
    if (questions.length > 0) {
      setFollowUpQueue(questions);
      setCurrentFollowUpIndex(0);
      simulateTyping(() => setStep("follow-up-special"));
    } else {
      simulateTyping(() => setStep("spending-input"));
    }
  };

  const handleAddCustomCard = () => {
    setStep("custom-card-input");
  };

  const [customCardNameError, setCustomCardNameError] = useState(false);

  const handleCustomCardSubmit = () => {
    if (!customCardName.trim()) {
      setCustomCardNameError(true);
      return;
    }
    const baseRate = customCardRates.general > 0 ? customCardRates.general : 1;
    const resolvedRewards: Record<string, number> = {
      base: baseRate / 100,
    };
    const keyMap: Record<string, string> = {
      grocery: "groceries",
      dining: "dining",
      rent: "rent",
      gas: "gas",
      online: "online_shopping",
      travel: "travel",
      streaming: "streaming",
      transit: "transit",
    };
    for (const bonusKey of customCardBonusKeys) {
      const val = customCardRates[bonusKey];
      if (typeof val === "number" && val > 0) {
        if (keyMap[bonusKey]) {
          resolvedRewards[keyMap[bonusKey]] = val / 100;
        } else {
          const opt = EXTRA_CATEGORY_OPTIONS.find(
            (o: (typeof EXTRA_CATEGORY_OPTIONS)[number]) => o.key === bonusKey,
          );
          if (opt) {
            for (const rk of opt.rewardKeys) {
              resolvedRewards[rk] = val / 100;
            }
          }
        }
      }
    }
    setOwnedCards([
      ...ownedCards,
      {
        cardId: `custom-${Date.now()}`,
        name: customCardName,
        resolvedRewards,
        isCustom: true,
        annual_fee: customCardFee,
      },
    ]);
    setCustomCardName("");
    setCustomCardNameError(false);
    setCustomCardFee(0);
    setCustomCardRates({ general: 0 });
    setCustomCardBonusKeys([]);
    simulateTyping(() => setStep("card-selection"));
  };

  // Follow-up handling
  const handleFollowUpAnswer = (chosenKey: string) => {
    const question = followUpQueue[currentFollowUpIndex];
    setOwnedCards((cards) =>
      cards.map((c) =>
        c.cardId === question.cardId
          ? {
              ...c,
              resolvedRewards: applyFollowUpAnswer(
                c.resolvedRewards,
                question,
                chosenKey,
              ),
            }
          : c,
      ),
    );

    const nextIndex = currentFollowUpIndex + 1;
    if (nextIndex < followUpQueue.length) {
      setCurrentFollowUpIndex(nextIndex);
    } else {
      simulateTyping(() => setStep("spending-input"));
    }
  };

  // Spending / results
  const handleSpendingDone = () => {
    const totalMonthlySpending = Object.values(spending).reduce(
      (sum, v) => sum + v,
      0,
    );
    saveProgress({ totalMonthlySpending });
    setStep("calculating");
    setTimeout(() => {
      const result = generatePortfolioStrategy(
        allCards,
        ownedCards,
        creditProfile,
        spending,
        oldestCardId ?? undefined,
      );
      setStrategy(result);
      setStep("results");
      // Lock the Firebase doc — no more updates after strategy is calculated
      bywDocId.current = null;
    }, 1500);
  };

  const handleEmailSubmit = async () => {
    if (!email.trim() || !strategy) return;
    setIsSendingEmail(true);
    setEmailError(null);
    try {
      const response = await fetch("/api/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          strategy: {
            apply: strategy.apply.map((s) => ({
              name: s.card.name,
              reason: s.reason,
              anv: s.annualNetValue,
            })),
            keep: strategy.keep.map((s) => ({
              name: s.card.name,
              reason: s.reason,
            })),
            remove: strategy.remove.map((s) => ({
              name: s.card.name,
              reason: s.reason,
              downgrade: s.downgradeTarget,
            })),
            upgrade: strategy.upgrade.map((s) => ({
              name: s.card.name,
              reason: s.reason,
              anv: s.annualNetValue,
              upgradeFrom: s.upgradeFrom,
            })),
            improvement:
              strategy.totalOptimalRewards - strategy.totalCurrentRewards,
          },
        }),
      });
      if (!response.ok) throw new Error("Failed to send email");
      simulateTyping(() => setStep("complete"));
    } catch (error) {
      console.error("Email error:", error);
      setEmailError("Failed to send email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Revert follow-up resolved rewards to original DB rewards
  const revertFollowUpRewards = () => {
    setOwnedCards((cards) =>
      cards.map((c) => {
        if (c.isCustom) return c;
        const dbEntry = allCards.find((db) => db.id === c.cardId);
        return dbEntry ? { ...c, resolvedRewards: { ...dbEntry.rewards } } : c;
      }),
    );
    setFollowUpQueue([]);
    setCurrentFollowUpIndex(0);
  };

  const handleBack = () => {
    switch (step) {
      case "credit-profile":
        setStep("welcome");
        setWalletClicked(false);
        break;
      case "card-selection":
        setStep("credit-profile");
        break;
      case "custom-card-input":
        setCustomCardName("");
        setCustomCardNameError(false);
        setCustomCardFee(0);
        setCustomCardRates({ general: 0 });
        setCustomCardBonusKeys([]);
        setStep("card-selection");
        break;
      case "oldest-card-select":
        setOldestCardId(null);
        setStep("card-selection");
        break;
      case "follow-up-special":
        revertFollowUpRewards();
        if (ownedCards.length >= 1) {
          setOldestCardMonth(0);
          setOldestCardYear(0);
          setStep("oldest-card-select");
        } else {
          setStep("card-selection");
        }
        break;
      case "spending-input":
        // Go back through the flow
        revertFollowUpRewards();
        const questions = getFollowUpQuestions(ownedCards, allCards);
        if (questions.length > 0) {
          setFollowUpQueue(questions);
          setCurrentFollowUpIndex(0);
          setStep("follow-up-special");
        } else if (ownedCards.length >= 1) {
          setOldestCardMonth(0);
          setOldestCardYear(0);
          setStep("oldest-card-select");
        } else {
          setStep("card-selection");
        }
        break;
      case "email-capture":
        setStep("results");
        break;
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  // ── Validation ────────────────────────────────────────────────────

  const profileComplete =
    profileTouched.creditScore && profileTouched.cardsOpened24mo && feeSelected;

  const profileMissing: string[] = [];
  if (!profileTouched.creditScore) profileMissing.push("Credit Score");
  if (!profileTouched.cardsOpened24mo)
    profileMissing.push("Cards Opened in 24 Months");
  if (!feeSelected) profileMissing.push("Annual Fee Preference");

  // ── Step progress ────────────────────────────────────────────────

  const PROGRESS_STEPS = [
    { key: "credit-profile", icon: User, label: "Profile" },
    { key: "card-selection", icon: CreditCardIcon, label: "Cards" },
    { key: "spending-input", icon: DollarSign, label: "Spending" },
    { key: "results", icon: Sparkles, label: "Results" },
  ] as const;

  const stepToProgressIndex = (s: ChatStep): number => {
    if (s === "credit-profile") return 0;
    if (
      s === "card-selection" ||
      s === "custom-card-input" ||
      s === "oldest-card-select" ||
      s === "follow-up-special"
    )
      return 1;
    if (s === "spending-input") return 2;
    if (
      s === "calculating" ||
      s === "results" ||
      s === "email-capture" ||
      s === "complete"
    )
      return 3;
    return -1;
  };

  const currentProgressIndex = stepToProgressIndex(step);

  // ── Render ─────────────────────────────────────────────────────────

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
        <h1 className="text-wallzy-white font-bold text-xl md:text-2xl">
          Credit Card Portfolio Builder
        </h1>
        <div className="w-12" />
      </header>

      {/* Step Progress Indicator */}
      {step !== "welcome" && currentProgressIndex >= 0 && (
        <div className="px-4 pt-4 pb-2 max-w-md mx-auto w-full">
          <div className="flex items-center justify-between">
            {PROGRESS_STEPS.map((ps, i) => {
              const Icon = ps.icon;
              const isCompleted = i < currentProgressIndex;
              const isCurrent = i === currentProgressIndex;
              return (
                <div
                  key={ps.key}
                  className="flex items-center flex-1 last:flex-none"
                >
                  {/* Step circle */}
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? "bg-wallzy-yellow text-wallzy-darkBlue"
                          : isCurrent
                            ? "bg-wallzy-lightBlue text-white ring-2 ring-wallzy-lightBlue/40 ring-offset-2 ring-offset-wallzy-darkBlue"
                            : "bg-white/10 text-wallzy-white/40"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  {/* Connector line */}
                  {i < PROGRESS_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                        i < currentProgressIndex
                          ? "bg-wallzy-yellow"
                          : "bg-white/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full"
      >
        <AnimatePresence mode="wait">
          {/* ────────── WELCOME ────────── */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={
                walletClicked ? { opacity: 0, scale: 0.95 } : { opacity: 1 }
              }
              transition={
                walletClicked
                  ? { duration: 0.6, ease: "easeInOut" }
                  : { duration: 0.3 }
              }
              onAnimationComplete={() => {
                if (walletClicked) handleStart();
              }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-wallzy-darkBlue"
            >
              {/* Logo top-left */}
              <Link
                to="/"
                className="absolute top-5 left-5 z-20 flex items-center hover:opacity-70 transition-opacity"
              >
                <img src={logo} alt="Wallzy" className="h-10 w-10" />
                <span className="text-white font-black text-lg tracking-tight -ml-3">
                  allzy
                </span>
              </Link>

              {/* Tab links top-right */}
              <div className="absolute top-5 right-5 z-20 flex items-center gap-6">
                <Link
                  to="/byw"
                  className="text-wallzy-yellow text-sm font-semibold border-b-2 border-wallzy-yellow pb-0.5"
                >
                  Build Wallet
                </Link>
                <Link
                  to="/byw/cards"
                  className="text-white/50 hover:text-white text-sm font-medium transition-colors"
                >
                  Supported Cards
                </Link>
              </div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={
                  walletClicked ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }
                }
                transition={{ delay: walletClicked ? 0 : 0.2, duration: 0.5 }}
                className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 md:mb-4 text-center px-4"
              >
                Build Your <span className="text-wallzy-yellow">Wallet</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={
                  walletClicked ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }
                }
                transition={{ delay: walletClicked ? 0 : 0.3, duration: 0.5 }}
                className="relative z-10 text-white/60 text-sm md:text-base max-w-md mx-auto text-center mb-8 md:mb-10 px-6"
              >
                Find out how much you can save by having the right cards in your
                wallet
              </motion.p>

              {/* Wallet with stacking cards */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={
                  walletClicked
                    ? { scale: 0.9, y: -30, opacity: 0 }
                    : { opacity: 1, y: 0 }
                }
                transition={
                  walletClicked
                    ? { duration: 0.5, ease: "easeIn" }
                    : {
                        delay: 0.3,
                        duration: 0.7,
                        type: "spring",
                        stiffness: 100,
                        damping: 12,
                      }
                }
                className="relative z-10 w-[285px] md:w-[335px]"
              >
                {/* Wallet body — dark navy rounded rectangle */}
                <div
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    background: "#00438A",
                    boxShadow:
                      "0 30px 60px rgba(0,0,0,0.4), 0 10px 24px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* Darker flap / top half overlay */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[60%] rounded-t-2xl z-10"
                    style={{ background: "#003570" }}
                  />

                  <div className="relative pt-4 pb-6">
                    {/* Stacking credit cards */}
                    <div className="relative h-[200px] md:h-[220px] mx-auto w-[280px] md:w-[320px] z-20 mb-2">
                      {/* Lower wallet cover — hides bottom of cards */}
                      <div
                        className="absolute top-[70%] left-[-10px] right-[-10px] bottom-[-200px] z-30"
                        style={{ background: "#00438A" }}
                      />
                      {/* Card 3 (back) — Capital One Venture X */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          walletClicked
                            ? { x: 40, opacity: 0 }
                            : { opacity: 1, y: 0 }
                        }
                        transition={
                          walletClicked
                            ? { duration: 0.35, delay: 0 }
                            : { delay: 0.5, duration: 0.5 }
                        }
                        className="absolute top-0 left-0 right-0 mx-auto w-[260px] h-[164px] md:w-[300px] md:h-[189px] rounded-xl overflow-hidden z-0"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#2d1b4e]" />
                        <div className="relative h-full p-3 flex flex-col">
                          <div className="flex items-start justify-between">
                            <div className="w-8 h-6 rounded bg-yellow-400/80" />
                            <div className="text-right">
                              <p className="text-white/90 text-[10px] font-bold">
                                Capital One Venture X
                              </p>
                              <span className="text-white/40 text-[9px] font-medium tracking-wide">
                                VISA
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Card 2 (middle) — Amex Gold Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          walletClicked
                            ? { x: -40, opacity: 0 }
                            : { opacity: 1, y: 0 }
                        }
                        transition={
                          walletClicked
                            ? { duration: 0.35, delay: 0.05 }
                            : { delay: 0.6, duration: 0.5 }
                        }
                        className="absolute top-[50px] left-0 right-0 mx-auto w-[260px] h-[164px] md:w-[300px] md:h-[189px] rounded-xl overflow-hidden z-10"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c] to-[#a67c2e]" />
                        <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white/10 -translate-y-16 -translate-x-8" />
                        <div className="relative h-full p-3 flex flex-col">
                          <div className="flex items-start justify-between">
                            <div className="w-8 h-6 rounded bg-yellow-200/60" />
                            <div className="text-right">
                              <p className="text-white text-[10px] font-bold drop-shadow-sm">
                                Amex Gold Card
                              </p>
                              <span className="text-white/50 text-[9px] font-medium tracking-wide">
                                AMEX
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Card 1 (top) — Chase Sapphire Preferred */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          walletClicked
                            ? { y: -30, opacity: 0 }
                            : { opacity: 1, y: 0 }
                        }
                        transition={
                          walletClicked
                            ? { duration: 0.35, delay: 0.1 }
                            : { delay: 0.7, duration: 0.5 }
                        }
                        className="absolute top-[100px] left-0 right-0 mx-auto w-[260px] h-[164px] md:w-[300px] md:h-[189px] rounded-xl overflow-hidden z-20"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] to-[#0d2240]" />
                        <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/5 -translate-y-12 translate-x-8" />
                        <div className="relative h-full p-3 flex flex-col">
                          <div className="flex items-start justify-between">
                            <div className="w-8 h-6 rounded bg-yellow-400/70" />
                            <div className="text-right">
                              <p className="text-white text-[10px] font-bold">
                                Chase Sapphire Preferred
                              </p>
                              <span className="text-white/40 text-[9px] font-medium tracking-wide">
                                VISA
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Wallet lower section */}
                    <div className="relative text-center z-40">
                      {/* Stitched line — wallet pocket edge */}
                      <div
                        className="mx-4 mb-4 h-[1px]"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(to right, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 6px, transparent 6px, transparent 12px)",
                        }}
                      />
                      <p className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-3 font-medium">
                        Unlock Your Portfolio
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!walletClicked) setWalletClicked(true);
                        }}
                        className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-bold px-10 py-3.5 text-base rounded-full transition-colors z-50"
                        style={{ boxShadow: "0 4px 20px rgba(234,179,8,0.4)" }}
                      >
                        Let's Go!
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Animated arrow below wallet pointing up */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={walletClicked ? { opacity: 0 } : { opacity: 1 }}
                transition={{ delay: walletClicked ? 0 : 1.2, duration: 0.5 }}
                className="relative z-10 mt-8 pointer-events-none"
              >
                <motion.div
                  animate={{ y: [-6, 2, -6] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex flex-col items-center"
                >
                  <svg
                    width="24"
                    height="32"
                    viewBox="0 0 24 32"
                    fill="none"
                    className="text-white/25"
                  >
                    <path
                      d="M12 28 L12 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M5 11 L12 4 L19 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-white/35 text-[11px] font-medium mt-1">
                    Tap to start
                  </span>
                </motion.div>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={walletClicked ? { opacity: 0 } : { opacity: 1 }}
                transition={{ delay: walletClicked ? 0 : 0.9, duration: 0.5 }}
                className="relative z-10 text-white/30 text-xs mt-5"
              >
                Takes about 2 minutes — no sign-up required
              </motion.p>
            </motion.div>
          )}

          {/* ────────── CREDIT PROFILE ────────── */}
          {step === "credit-profile" && (
            <motion.div
              key="credit-profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium mb-1">
                  Let's start with your credit profile
                </p>
                <p className="text-sm text-wallzy-white/70">
                  This helps me recommend cards you can actually get approved
                  for.
                </p>
              </ChatBubble>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-6"
              >
                {/* Credit Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-wallzy-white text-sm font-medium">
                      Credit Score
                    </span>
                    <Input
                      type="number"
                      min={300}
                      max={850}
                      value={creditProfile.creditScore || ""}
                      placeholder="0"
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          setCreditProfile({
                            ...creditProfile,
                            creditScore: Math.min(850, Math.max(300, val)),
                          });
                          setProfileTouched((t) => ({
                            ...t,
                            creditScore: true,
                          }));
                        } else if (e.target.value === "") {
                          setCreditProfile({
                            ...creditProfile,
                            creditScore: 0,
                          });
                          setProfileTouched((t) => ({
                            ...t,
                            creditScore: false,
                          }));
                        }
                      }}
                      className="w-20 h-8 text-right bg-white/10 border-white/20 text-wallzy-white text-sm"
                    />
                  </div>
                  <Slider
                    value={[Math.max(300, creditProfile.creditScore)]}
                    onValueChange={([v]) => {
                      setCreditProfile({ ...creditProfile, creditScore: v });
                      setProfileTouched((t) => ({ ...t, creditScore: true }));
                    }}
                    min={300}
                    max={850}
                    step={10}
                    className="[&_[role=slider]]:bg-wallzy-yellow [&_[role=slider]]:border-wallzy-yellow [&_.bg-primary]:bg-wallzy-lightBlue"
                  />
                  <div className="flex justify-between text-xs text-wallzy-white/40 mt-1">
                    <span>300</span>
                    <span>850</span>
                  </div>
                </div>

                {/* Cards Opened in 24 months */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-wallzy-white text-sm font-medium">
                      Cards Opened in Last 24 Months
                    </span>
                    <Input
                      type="number"
                      min={0}
                      max={20}
                      value={
                        profileTouched.cardsOpened24mo
                          ? creditProfile.cardsOpened24mo
                          : ""
                      }
                      placeholder="0"
                      onChange={(e) => {
                        setCreditProfile({
                          ...creditProfile,
                          cardsOpened24mo: Math.max(
                            0,
                            parseInt(e.target.value) || 0,
                          ),
                        });
                        setProfileTouched((t) => ({
                          ...t,
                          cardsOpened24mo: true,
                        }));
                      }}
                      className="w-16 h-8 text-right bg-white/10 border-white/20 text-wallzy-white text-sm"
                    />
                  </div>
                  {creditProfile.cardsOpened24mo >= 5 && (
                    <p className="text-amber-400 text-xs mt-1">
                      You may be over 5/24 — Chase cards with 5/24 restrictions
                      will be excluded.
                    </p>
                  )}
                </div>

                {/* Fee Preference */}
                <div>
                  <p className="text-wallzy-white text-sm font-medium mb-3">
                    Annual Fee Preference
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setCreditProfile({
                          ...creditProfile,
                          feePreference: false,
                        });
                        setFeeSelected(true);
                      }}
                      className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-colors ${
                        feeSelected && !creditProfile.feePreference
                          ? "bg-wallzy-yellow/20 border-wallzy-yellow text-wallzy-yellow"
                          : "bg-white/5 border-white/10 text-wallzy-white/70 hover:bg-white/10"
                      }`}
                    >
                      No annual fees
                    </button>
                    <button
                      onClick={() => {
                        setCreditProfile({
                          ...creditProfile,
                          feePreference: true,
                        });
                        setFeeSelected(true);
                      }}
                      className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-colors ${
                        feeSelected && creditProfile.feePreference
                          ? "bg-wallzy-yellow/20 border-wallzy-yellow text-wallzy-yellow"
                          : "bg-white/5 border-white/10 text-wallzy-white/70 hover:bg-white/10"
                      }`}
                    >
                      Open to annual fees
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                {/* Validation alerts */}
                {!profileComplete && profileMissing.length > 0 && (
                  <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-300">
                      <p className="font-medium mb-1">
                        Please fill in the following:
                      </p>
                      <ul className="list-disc list-inside text-amber-300/80 space-y-0.5">
                        {profileMissing.map((field) => (
                          <li key={field}>{field}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="flex justify-center gap-3">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={handleCreditProfileDone}
                    disabled={!profileComplete}
                    className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ────────── CARD SELECTION ────────── */}
          {step === "card-selection" && (
            <motion.div
              key="card-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium mb-1">
                  Which credit cards do you currently have?
                </p>
                <p className="text-sm text-wallzy-white/70">
                  Select all that apply. If you don't see your card, you can add
                  it manually.
                </p>
              </ChatBubble>

              {ownedCards.length > 0 && (
                <ChatBubble isUser delay={0.1}>
                  <div className="flex flex-wrap gap-2">
                    {ownedCards.map((card) => (
                      <span
                        key={card.cardId}
                        className="inline-flex items-center gap-1 bg-wallzy-darkBlue/30 px-2 py-1 rounded-full text-sm"
                      >
                        {card.name}
                        <button
                          onClick={() => {
                            setOwnedCards(
                              ownedCards.filter(
                                (c) => c.cardId !== card.cardId,
                              ),
                            );
                            if (oldestCardId === card.cardId)
                              setOldestCardId(null);
                          }}
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
                    placeholder="Search by card name or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-wallzy-white placeholder:text-wallzy-white/50"
                  />
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {[...filteredCards]
                    .sort((a, b) => {
                      const aSelected = ownedCards.some(
                        (c) => c.cardId === a.id,
                      );
                      const bSelected = ownedCards.some(
                        (c) => c.cardId === b.id,
                      );
                      if (aSelected && !bSelected) return -1;
                      if (!aSelected && bSelected) return 1;
                      return 0;
                    })
                    .map((card) => {
                      const isSelected = ownedCards.some(
                        (c) => c.cardId === card.id,
                      );
                      return (
                        <div key={card.id}>
                          <button
                            onClick={() => toggleCard(card)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                              isSelected
                                ? "bg-wallzy-yellow/20 border border-wallzy-yellow"
                                : "bg-white/5 hover:bg-white/10 border border-transparent"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "bg-wallzy-yellow"
                                  : "border border-white/30"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-wallzy-darkBlue" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-wallzy-white font-medium text-sm truncate">
                                {card.name}
                              </p>
                              <p className="text-wallzy-white/60 text-xs">
                                {card.brand}
                                {card.annual_fee > 0 && (
                                  <span className="ml-2 text-amber-400">
                                    ${card.annual_fee}/yr
                                  </span>
                                )}
                              </p>
                            </div>
                          </button>
                        </div>
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
                className="space-y-3"
              >
                <div className="flex justify-center gap-3">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={handleCardSelectionDone}
                    className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full"
                  >
                    {ownedCards.length === 0
                      ? "I don't have any cards"
                      : "Continue"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ────────── CUSTOM CARD INPUT ────────── */}
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
                    onChange={(e) => {
                      setCustomCardName(e.target.value);
                      if (e.target.value.trim()) setCustomCardNameError(false);
                    }}
                    className={`bg-white/10 border-white/20 text-wallzy-white placeholder:text-wallzy-white/50 ${customCardNameError ? "border-red-500" : ""}`}
                  />
                  {customCardNameError && (
                    <p className="text-red-400 text-xs mt-1">
                      Please enter a card name.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-wallzy-white/70 text-sm mb-1 block">
                    Annual Fee ($)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="1000"
                    value={customCardFee || ""}
                    placeholder="0"
                    onChange={(e) =>
                      setCustomCardFee(
                        Math.max(0, parseInt(e.target.value) || 0),
                      )
                    }
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
                    value={customCardRates.general || ""}
                    placeholder="1"
                    onChange={(e) =>
                      setCustomCardRates({
                        ...customCardRates,
                        general: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-white/10 border-white/20 text-wallzy-white placeholder:text-wallzy-white/50"
                  />
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-wallzy-white/70 text-sm mb-3">
                    Category Bonuses (optional)
                  </p>
                  <div className="space-y-3">
                    {customCardBonusKeys.map((bonusKey) => {
                      const catMatch = CATEGORIES.find(
                        (c) => c.key === bonusKey,
                      );
                      const extraMatch = EXTRA_CATEGORY_OPTIONS.find(
                        (o: (typeof EXTRA_CATEGORY_OPTIONS)[number]) =>
                          o.key === bonusKey,
                      );
                      const icon = catMatch?.icon || extraMatch?.icon || "";
                      const label =
                        catMatch?.label || extraMatch?.label || bonusKey;
                      return (
                        <div key={bonusKey} className="flex items-center gap-2">
                          <span className="text-base">{icon}</span>
                          <span className="text-wallzy-white text-sm font-medium flex-1 truncate">
                            {label}
                          </span>
                          <Input
                            type="number"
                            step="0.5"
                            min="0"
                            max="30"
                            placeholder="0"
                            value={(customCardRates[bonusKey] ?? 0) * 100 || ""}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setCustomCardRates({
                                ...customCardRates,
                                [bonusKey]: !isNaN(val) ? val / 100 : 0,
                              });
                            }}
                            className="w-20 h-8 text-right bg-white/10 border-white/20 text-wallzy-white text-sm"
                          />
                          <span className="text-wallzy-white/50 text-xs">
                            %
                          </span>
                          <button
                            onClick={() => {
                              setCustomCardBonusKeys((prev) =>
                                prev.filter((k) => k !== bonusKey),
                              );
                              setCustomCardRates((prev) => {
                                const next = { ...prev };
                                delete next[bonusKey];
                                return next;
                              });
                            }}
                            className="p-1 rounded-full hover:bg-white/10 text-wallzy-white/50 hover:text-wallzy-white transition-colors"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => {
                        setBonusCategorySearch("");
                        setShowAddBonus(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-white/30 text-wallzy-white/70 hover:bg-white/5 hover:text-wallzy-white transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Category Bonus</span>
                    </button>
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
                  className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full"
                >
                  Add Card
                </Button>
              </div>
            </motion.div>
          )}

          {/* ────────── OLDEST CARD SELECT ────────── */}
          {step === "oldest-card-select" && (
            <motion.div
              key="oldest-card-select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                {ownedCards.length === 1 ? (
                  <>
                    <p className="font-medium mb-1">
                      When did you open your {ownedCards[0].name}?
                    </p>
                    <p className="text-sm text-wallzy-white/70">
                      This helps me understand your credit history length.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium mb-1">
                      Which card have you had the longest?
                    </p>
                    <p className="text-sm text-wallzy-white/70">
                      This helps me protect your credit history when making
                      recommendations.
                    </p>
                  </>
                )}
              </ChatBubble>

              {/* Card picker — only for 2+ cards */}
              {ownedCards.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2"
                >
                  {ownedCards.map((card) => (
                    <button
                      key={card.cardId}
                      onClick={() => setOldestCardId(card.cardId)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                        oldestCardId === card.cardId
                          ? "bg-wallzy-yellow/20 border border-wallzy-yellow"
                          : "bg-white/5 hover:bg-white/10 border border-transparent"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                          oldestCardId === card.cardId
                            ? "bg-wallzy-yellow border-wallzy-yellow"
                            : "border-white/30"
                        }`}
                      >
                        {oldestCardId === card.cardId && (
                          <div className="w-2 h-2 rounded-full bg-wallzy-darkBlue" />
                        )}
                      </div>
                      <p className="text-wallzy-white font-medium text-sm">
                        {card.name}
                      </p>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Month/Year dropdowns — always shown */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ownedCards.length >= 2 ? 0.3 : 0.2 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/10"
              >
                <span className="text-wallzy-white text-sm font-medium block mb-2">
                  {oldestCardId
                    ? `When did you open this card?`
                    : `When was it opened?`}
                </span>
                <div className="flex items-center gap-2">
                  <Select
                    value={oldestCardMonth > 0 ? String(oldestCardMonth) : ""}
                    onValueChange={(v) => setOldestCardMonth(parseInt(v))}
                  >
                    <SelectTrigger
                      className={`flex-1 h-9 bg-white/10 border-white/20 text-sm ${oldestCardMonth > 0 ? "text-wallzy-white" : "text-wallzy-white/40"}`}
                    >
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m, i) => {
                        const monthNum = i + 1;
                        if (
                          oldestCardYear === currentYear &&
                          monthNum > currentMonth
                        )
                          return null;
                        return (
                          <SelectItem key={i} value={String(monthNum)}>
                            {m}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Select
                    value={oldestCardYear > 0 ? String(oldestCardYear) : ""}
                    onValueChange={(v) => {
                      const yr = parseInt(v);
                      setOldestCardYear(yr);
                      if (
                        yr === currentYear &&
                        oldestCardMonth > currentMonth
                      ) {
                        setOldestCardMonth(0);
                      }
                    }}
                  >
                    <SelectTrigger
                      className={`flex-1 h-9 bg-white/10 border-white/20 text-sm ${oldestCardYear > 0 ? "text-wallzy-white" : "text-wallzy-white/40"}`}
                    >
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {oldestCardMonth > 0 && oldestCardYear > 0 && (
                  <p className="text-wallzy-white/50 text-xs mt-1.5">
                    ~
                    {(() => {
                      const now = new Date();
                      const opened = new Date(
                        oldestCardYear,
                        oldestCardMonth - 1,
                        1,
                      );
                      const diffYears = Math.max(
                        0,
                        (now.getTime() - opened.getTime()) /
                          (1000 * 60 * 60 * 24 * 365.25),
                      );
                      return diffYears < 1
                        ? "< 1 year"
                        : `${Math.round(diffYears * 2) / 2} years`;
                    })()}{" "}
                    of credit history
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center"
              >
                <div className="flex gap-3">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={handleOldestCardDone}
                    disabled={
                      !oldestCardId ||
                      oldestCardMonth === 0 ||
                      oldestCardYear === 0
                    }
                    className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ────────── FOLLOW-UP SPECIAL ────────── */}
          {step === "follow-up-special" && followUpQueue.length > 0 && (
            <motion.div
              key={`follow-up-${currentFollowUpIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium mb-1">
                  Quick question about your{" "}
                  {followUpQueue[currentFollowUpIndex].cardName}
                </p>
                <p className="text-sm text-wallzy-white/70">
                  {followUpQueue[currentFollowUpIndex].type ===
                  "custom_category"
                    ? `This card lets you pick one category for ${(followUpQueue[currentFollowUpIndex].rate * 100).toFixed(0)}% cash back. Which category did you choose?`
                    : followUpQueue[currentFollowUpIndex].type ===
                        "chosen_category"
                      ? `This card lets you pick one category for ${(followUpQueue[currentFollowUpIndex].rate * 100).toFixed(0)}% cash back. Which category did you choose?`
                      : followUpQueue[currentFollowUpIndex].type ===
                          "top_category"
                        ? `This card automatically earns ${(followUpQueue[currentFollowUpIndex].rate * 100).toFixed(0)}% on your top spending category each cycle. Which category do you spend the most on?`
                        : `This card has ${(followUpQueue[currentFollowUpIndex].rate * 100).toFixed(0)}% rotating quarterly categories. Which spending category best matches this quarter's bonus?`}
                </p>
              </ChatBubble>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/10"
              >
                <div className="grid grid-cols-2 gap-2">
                  {followUpQueue[currentFollowUpIndex].choices
                    ? /* Render card-specific choices */
                      Object.entries(
                        followUpQueue[currentFollowUpIndex].choices!,
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setFollowUpSelectedKey(key)}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-colors text-left ${
                            followUpSelectedKey === key
                              ? "bg-wallzy-yellow/20 border-wallzy-yellow"
                              : "bg-white/5 hover:bg-white/10 border-transparent"
                          }`}
                        >
                          <span className="text-wallzy-white text-sm font-medium">
                            {label}
                          </span>
                        </button>
                      ))
                    : /* Fallback: generic CATEGORIES grid */
                      CATEGORIES.map((cat) => (
                        <button
                          key={cat.key}
                          onClick={() => setFollowUpSelectedKey(cat.key)}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-colors text-left ${
                            followUpSelectedKey === cat.key
                              ? "bg-wallzy-yellow/20 border-wallzy-yellow"
                              : "bg-white/5 hover:bg-white/10 border-transparent"
                          }`}
                        >
                          <span className="text-lg">{cat.icon}</span>
                          <span className="text-wallzy-white text-sm font-medium">
                            {cat.label}
                          </span>
                        </button>
                      ))}
                </div>
              </motion.div>

              <div className="flex justify-center gap-4 items-center">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (followUpSelectedKey) {
                      handleFollowUpAnswer(followUpSelectedKey);
                      setFollowUpSelectedKey(null);
                    }
                  }}
                  disabled={!followUpSelectedKey}
                  className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-6 rounded-full disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* ────────── SPENDING INPUT ────────── */}
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
                {/* Main 8 category sliders */}
                {CATEGORIES.map((cat) => {
                  const categoryKey = cat.key as CategoryKey;
                  return (
                    <div key={cat.key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-wallzy-white flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span className="text-sm font-medium">
                            {cat.label}
                          </span>
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

                {/* Extra spending category sliders */}
                {Object.entries(extraSpending).map(([key, amount]) => {
                  const opt = EXTRA_CATEGORY_OPTIONS.find(
                    (o: (typeof EXTRA_CATEGORY_OPTIONS)[number]) =>
                      o.key === key,
                  );
                  if (!opt) return null;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-wallzy-white flex items-center gap-2">
                          <span>{opt.icon}</span>
                          <span className="text-sm font-medium">
                            {opt.label}
                          </span>
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-wallzy-white/70">$</span>
                          <Input
                            type="number"
                            min="0"
                            max="5000"
                            value={amount}
                            onChange={(e) =>
                              setExtraSpending({
                                ...extraSpending,
                                [key]: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20 h-8 text-right bg-white/10 border-white/20 text-wallzy-white text-sm"
                          />
                          <button
                            onClick={() => {
                              const next = { ...extraSpending };
                              delete next[key];
                              setExtraSpending(next);
                            }}
                            className="ml-1 p-1 rounded-full hover:bg-white/10 text-wallzy-white/50 hover:text-wallzy-white transition-colors"
                            title="Remove category"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <Slider
                        value={[amount]}
                        onValueChange={([value]) =>
                          setExtraSpending({ ...extraSpending, [key]: value })
                        }
                        max={1000}
                        step={10}
                        className="[&_[role=slider]]:bg-wallzy-yellow [&_[role=slider]]:border-wallzy-yellow [&_.bg-primary]:bg-wallzy-lightBlue"
                      />
                    </div>
                  );
                })}

                {/* Add Spending Category button */}
                <button
                  onClick={() => {
                    setExtraCategorySearch("");
                    setShowAddCategory(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/30 text-wallzy-white/70 hover:bg-white/5 hover:text-wallzy-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Spending Category</span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center"
              >
                <div className="flex gap-3">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-8 rounded-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSpendingDone}
                    className="bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold px-8 rounded-full"
                  >
                    Calculate My Strategy
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ────────── CALCULATING ────────── */}
          {step === "calculating" && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p>
                  Analyzing your spending patterns and comparing 30+ cards...
                </p>
              </ChatBubble>
              <TypingIndicator />
            </motion.div>
          )}

          {/* ────────── RESULTS ────────── */}
          {step === "results" && strategy && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ChatBubble>
                <p className="font-medium">
                  Here's your personalized portfolio strategy:
                </p>
              </ChatBubble>

              {/* Summary Hero */}
              {(() => {
                const improvement =
                  strategy.totalOptimalRewards - strategy.totalCurrentRewards;
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-wallzy-yellow/20 to-wallzy-lightBlue/20 rounded-2xl p-6 border border-wallzy-yellow/30 text-center"
                  >
                    <p className="text-wallzy-white/70 text-sm mb-2">
                      {improvement > 0
                        ? "Potential annual improvement:"
                        : "Your current portfolio earns:"}
                    </p>
                    <p className="text-5xl md:text-6xl font-bold text-wallzy-yellow mb-2">
                      {improvement > 0
                        ? `+$${improvement.toFixed(0)}`
                        : `$${strategy.totalCurrentRewards.toFixed(0)}`}
                    </p>
                    <p className="text-wallzy-white/60 text-sm">
                      {improvement > 0
                        ? `From $${strategy.totalCurrentRewards.toFixed(0)}/yr to $${strategy.totalOptimalRewards.toFixed(0)}/yr in rewards`
                        : "per year in rewards"}
                    </p>
                  </motion.div>
                );
              })()}

              {/* 5/24 Warning */}
              {strategy.is524Locked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/30 flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-amber-200 text-sm">
                    You're over 5/24 — Chase cards with this restriction have
                    been excluded from recommendations. Consider waiting before
                    applying for new Chase cards.
                  </p>
                </motion.div>
              )}

              {/* APPLY Section */}
              {strategy.apply.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 rounded-2xl p-4 border border-emerald-500/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-emerald-400 font-semibold text-sm uppercase tracking-wide">
                      Apply For
                    </p>
                  </div>
                  <div className="space-y-3">
                    {strategy.apply.map((item, index) => {
                      return (
                        <motion.div
                          key={item.card.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/10"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-wallzy-white font-medium">
                                  {item.card.name}
                                </p>
                                {item.card.annual_fee > 0 ? (
                                  <span className="text-amber-400 text-xs font-semibold bg-amber-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                                    ${item.card.annual_fee}/yr
                                  </span>
                                ) : (
                                  <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                                    No fee
                                  </span>
                                )}
                              </div>
                              <p className="text-wallzy-white/50 text-xs">
                                {item.card.brand}
                              </p>
                              <p className="text-emerald-300 text-sm mt-1">
                                {item.reason}
                              </p>
                              {/* Reward rates grid */}
                              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                                {Object.entries(item.card.rewards)
                                  .filter(
                                    ([key]) =>
                                      ![
                                        "top_category",
                                        "custom",
                                        "rotating_categories",
                                        "chosen_category",
                                        "second_category",
                                      ].includes(key),
                                  )
                                  .map(([key, rate]) => {
                                    const label = REWARD_KEY_LABELS[key] || key;
                                    const isHighlighted = item.bestCategory
                                      ? key === "base" &&
                                        item.bestCategory === "grocery"
                                        ? false
                                        : CATEGORY_MAP[
                                            item.bestCategory
                                          ]?.includes(key)
                                      : false;
                                    return (
                                      <span
                                        key={key}
                                        className={`text-xs ${
                                          isHighlighted
                                            ? "text-wallzy-yellow font-bold"
                                            : "text-wallzy-white/50"
                                        }`}
                                      >
                                        {label}: {(rate * 100).toFixed(0)}%
                                      </span>
                                    );
                                  })}
                              </div>
                              {item.alternatives &&
                                item.alternatives.length > 0 && (
                                  <p className="text-white/50 text-xs mt-1.5">
                                    Also consider:{" "}
                                    {item.alternatives
                                      .map((a) => a.name)
                                      .join(", ")}{" "}
                                    — same rewards for this category
                                  </p>
                                )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* UPGRADE Section */}
              {strategy.upgrade.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="bg-white/5 rounded-2xl p-4 border border-violet-500/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <p className="text-violet-400 font-semibold text-sm uppercase tracking-wide">
                      Upgrade Paths
                    </p>
                  </div>
                  <p className="text-white/40 text-xs mb-3 ml-8">
                    Product changes with your existing issuers — typically no
                    new credit check.
                  </p>
                  <div className="space-y-3">
                    {strategy.upgrade.map((item, index) => (
                      <motion.div
                        key={item.card.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="bg-violet-500/5 rounded-xl p-3 border border-violet-500/10"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-wallzy-white font-medium">
                                {item.card.name}
                              </p>
                              {item.card.annual_fee > 0 ? (
                                <span className="text-amber-400 text-xs font-semibold bg-amber-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                                  ${item.card.annual_fee}/yr
                                </span>
                              ) : (
                                <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                                  No fee
                                </span>
                              )}
                            </div>
                            {item.upgradeFrom && (
                              <p className="text-violet-300/70 text-xs mt-0.5">
                                Upgrade from: {item.upgradeFrom}
                              </p>
                            )}
                            <p className="text-violet-300 text-sm mt-1">
                              {item.reason}
                            </p>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                              {Object.entries(item.card.rewards)
                                .filter(
                                  ([key]) =>
                                    ![
                                      "top_category",
                                      "custom",
                                      "rotating_categories",
                                      "chosen_category",
                                      "second_category",
                                    ].includes(key),
                                )
                                .map(([key, rate]) => {
                                  const label = REWARD_KEY_LABELS[key] || key;
                                  return (
                                    <span
                                      key={key}
                                      className="text-xs text-wallzy-white/50"
                                    >
                                      {label}: {(rate * 100).toFixed(0)}%
                                    </span>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* KEEP Section */}
              {strategy.keep.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/5 rounded-2xl p-4 border border-wallzy-lightBlue/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-wallzy-lightBlue/20 flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-wallzy-lightBlue" />
                    </div>
                    <p className="text-wallzy-lightBlue font-semibold text-sm uppercase tracking-wide">
                      Keep
                    </p>
                  </div>
                  <div className="space-y-2">
                    {strategy.keep.map((item) => (
                      <div
                        key={item.card.id}
                        className="bg-wallzy-lightBlue/5 rounded-xl p-3 border border-wallzy-lightBlue/10"
                      >
                        <p className="text-wallzy-white font-medium text-sm">
                          {item.card.name}
                        </p>
                        <p className="text-wallzy-lightBlue/80 text-sm mt-0.5">
                          {item.reason}
                        </p>
                        {item.downgradeTarget && (
                          <p className="text-amber-300 text-xs mt-1 flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" />
                            Consider downgrade to {item.downgradeTarget}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* REMOVE Section */}
              {strategy.remove.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/5 rounded-2xl p-4 border border-amber-500/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <X className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
                      Remove / Downgrade
                    </p>
                  </div>
                  <div className="space-y-2">
                    {strategy.remove.map((item) => (
                      <div
                        key={item.card.id}
                        className="bg-amber-500/5 rounded-xl p-3 border border-amber-500/10"
                      >
                        <p className="text-wallzy-white font-medium text-sm">
                          {item.card.name}
                        </p>
                        <p className="text-amber-300/80 text-sm mt-0.5">
                          {item.reason}
                        </p>
                        {item.downgradeTarget && (
                          <p className="text-wallzy-white/60 text-xs mt-1 flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" />
                            Downgrade to {item.downgradeTarget}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Category Breakdown */}
              {strategy.categoryBreakdown.some(
                (b) => b.currentAnnual > 0 || b.optimalAnnual > 0,
              ) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/5 rounded-2xl p-4 border border-white/10"
                >
                  <p className="text-wallzy-white font-medium mb-3">
                    Category Breakdown
                  </p>
                  <div className="space-y-2">
                    {strategy.categoryBreakdown
                      .filter((b) => b.currentAnnual > 0 || b.optimalAnnual > 0)
                      .map((item) => (
                        <div key={item.categoryKey} className="text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-wallzy-white/70">
                              {item.category}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-wallzy-white/50">
                                {(item.currentRate * 100).toFixed(1)}%
                              </span>
                              <span className="text-wallzy-white/30">
                                <ArrowRight className="w-3 h-3 inline" />
                              </span>
                              <span className="text-wallzy-lightBlue">
                                {(item.optimalRate * 100).toFixed(1)}%
                              </span>
                              {item.optimalAnnual - item.currentAnnual > 0 && (
                                <span className="text-wallzy-yellow font-medium">
                                  +$
                                  {(
                                    item.optimalAnnual - item.currentAnnual
                                  ).toFixed(0)}
                                  /yr
                                </span>
                              )}
                            </div>
                          </div>
                          {item.bestCardName && (
                            <p className="text-wallzy-white/40 text-xs mt-0.5 pl-0.5">
                              Use: {item.bestCardName}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}

              {/* Developer's Summary / Tips */}
              {strategy.tips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gradient-to-br from-wallzy-lightBlue/10 to-wallzy-yellow/10 rounded-2xl p-5 border border-wallzy-lightBlue/20"
                >
                  <div className="text-sm text-wallzy-white/90 space-y-3 leading-relaxed">
                    {strategy.tips.map((tip, i) => (
                      <p
                        key={i}
                        dangerouslySetInnerHTML={{
                          __html: tip.replace(
                            /\*\*(.*?)\*\*/g,
                            '<span class="text-wallzy-yellow font-semibold">$1</span>',
                          ),
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

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

          {/* ────────── EMAIL CAPTURE ────────── */}
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
                  strategy and get notified when Wallzy launches.
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
                  disabled={
                    !email.trim() || !email.includes("@") || isSendingEmail
                  }
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

          {/* ────────── COMPLETE ────────── */}
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
                  Start building your optimized credit card portfolio today.
                  Each card you add is a step towards maximizing your rewards.
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

      {/* Disclaimer Modal */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent
          className="bg-wallzy-darkBlue border-white/20 max-w-xs mx-auto rounded-2xl p-4 gap-3"
          hideCloseButton
        >
          <DialogHeader>
            <DialogTitle className="text-wallzy-yellow flex items-center gap-2 text-base">
              <AlertTriangle className="w-4 h-4" />
              Beta Disclaimer
            </DialogTitle>
            <DialogDescription className="text-wallzy-white/70 sr-only">
              Important information about this tool before you proceed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-wallzy-white/80 leading-relaxed">
            <p>
              This tool is currently in{" "}
              <span className="text-wallzy-yellow font-semibold">beta</span> and
              recommendations are based on{" "}
              <span className="text-wallzy-yellow font-semibold">
                cashback rewards only
              </span>
              . Points, miles, and transfer partner valuations are not included.
            </p>
            <p>
              Reward rates and card details may not always be up to date.
              Results may contain inaccuracies.
            </p>
            <p className="text-wallzy-white/60">
              Please double-check all recommendations before making any
              financial decisions. This is not financial advice.
            </p>
          </div>
          <Button
            onClick={handleDisclaimerAccept}
            className="w-full bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold rounded-full mt-2"
          >
            I Understand, Let's Go!
          </Button>
        </DialogContent>
      </Dialog>

      {/* Add Spending Category Modal */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent className="bg-wallzy-darkBlue border-white/20 max-w-md mx-4 max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-wallzy-white text-lg">
              Add Spending Category
            </DialogTitle>
            <DialogDescription className="text-wallzy-white/70 sr-only">
              Choose an extra spending category to track.
            </DialogDescription>
          </DialogHeader>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wallzy-white/50" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={extraCategorySearch}
              onChange={(e) => setExtraCategorySearch(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-wallzy-white placeholder:text-wallzy-white/50"
            />
          </div>
          <div className="overflow-y-auto flex-1 space-y-4 pr-1">
            {(["general", "retail"] as const).map((group) => {
              const options = EXTRA_CATEGORY_OPTIONS.filter(
                (o: (typeof EXTRA_CATEGORY_OPTIONS)[number]) =>
                  o.group === group &&
                  !extraSpending.hasOwnProperty(o.key) &&
                  (extraCategorySearch === "" ||
                    o.label
                      .toLowerCase()
                      .includes(extraCategorySearch.toLowerCase())),
              );
              if (options.length === 0) return null;
              return (
                <div key={group}>
                  <p className="text-wallzy-white/50 text-xs font-semibold uppercase tracking-wide mb-2">
                    {EXTRA_CATEGORY_GROUP_LABELS[group]}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {options.map(
                      (opt: (typeof EXTRA_CATEGORY_OPTIONS)[number]) => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            setExtraSpending({
                              ...extraSpending,
                              [opt.key]: 50,
                            });
                            setShowAddCategory(false);
                          }}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-wallzy-yellow/20 hover:border-wallzy-yellow border border-transparent transition-colors text-left"
                        >
                          <span className="text-base">{opt.icon}</span>
                          <span className="text-wallzy-white text-sm font-medium truncate">
                            {opt.label}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Bonus Modal (custom card) */}
      <Dialog open={showAddBonus} onOpenChange={setShowAddBonus}>
        <DialogContent className="bg-wallzy-darkBlue border-white/20 max-w-md mx-4 max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-wallzy-white text-lg">
              Add Category Bonus
            </DialogTitle>
            <DialogDescription className="text-wallzy-white/70 sr-only">
              Choose a category this card earns bonus rewards on.
            </DialogDescription>
          </DialogHeader>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wallzy-white/50" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={bonusCategorySearch}
              onChange={(e) => setBonusCategorySearch(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-wallzy-white placeholder:text-wallzy-white/50"
            />
          </div>
          <div className="overflow-y-auto flex-1 space-y-4 pr-1">
            {(["spending", "general", "retail"] as const).map((group) => {
              const options = EXTRA_CATEGORY_OPTIONS.filter(
                (o: (typeof EXTRA_CATEGORY_OPTIONS)[number]) =>
                  o.group === group &&
                  !customCardBonusKeys.includes(o.key) &&
                  (bonusCategorySearch === "" ||
                    o.label
                      .toLowerCase()
                      .includes(bonusCategorySearch.toLowerCase())),
              );
              if (options.length === 0) return null;
              return (
                <div key={group}>
                  <p className="text-wallzy-white/50 text-xs font-semibold uppercase tracking-wide mb-2">
                    {EXTRA_CATEGORY_GROUP_LABELS[group]}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {options.map(
                      (opt: (typeof EXTRA_CATEGORY_OPTIONS)[number]) => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            setCustomCardBonusKeys((prev) => [
                              ...prev,
                              opt.key,
                            ]);
                            setShowAddBonus(false);
                          }}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-wallzy-yellow/20 hover:border-wallzy-yellow border border-transparent transition-colors text-left"
                        >
                          <span className="text-base">{opt.icon}</span>
                          <span className="text-wallzy-white text-sm font-medium truncate">
                            {opt.label}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog
        open={showFeedback}
        onOpenChange={(open) => {
          setShowFeedback(open);
          if (!open) {
            setFeedbackSent(false);
            setFeedbackError(false);
          }
        }}
      >
        <DialogContent className="bg-wallzy-darkBlue border-white/20 max-w-sm mx-auto rounded-2xl [&>button]:text-white">
          <DialogHeader>
            <DialogTitle className="text-wallzy-white text-lg">
              Send Feedback
            </DialogTitle>
            <DialogDescription className="text-wallzy-white/70 sr-only">
              Share your feedback about the tool.
            </DialogDescription>
          </DialogHeader>
          {feedbackSent ? (
            <div className="text-center py-4">
              <Check className="w-10 h-10 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-semibold text-lg">Thank you!</p>
              <p className="text-wallzy-white/70 text-sm mt-1">
                Your feedback has been submitted.
              </p>
            </div>
          ) : (
            <>
              <textarea
                value={feedbackText}
                onChange={(e) => {
                  setFeedbackText(e.target.value);
                  setFeedbackError(false);
                }}
                placeholder="What can we improve? Report a bug, suggest a feature..."
                className="w-full h-28 bg-white/10 border border-white/20 rounded-lg p-3 text-sm text-wallzy-white placeholder:text-wallzy-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-wallzy-yellow/50"
              />
              {feedbackError && (
                <p className="text-red-400 text-sm">
                  Something went wrong. Please try again.
                </p>
              )}
              <Button
                onClick={handleFeedbackSubmit}
                disabled={!feedbackText.trim() || feedbackSending}
                className="w-full bg-wallzy-yellow hover:bg-wallzy-yellow/90 text-wallzy-darkBlue font-semibold rounded-full disabled:opacity-50"
              >
                {feedbackSending ? "Sending..." : "Submit Feedback"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Feedback Button */}
      {step !== "welcome" && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowFeedback(true)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-wallzy-yellow text-wallzy-darkBlue rounded-full shadow-lg flex items-center justify-center hover:bg-wallzy-yellow/90 transition-colors z-50"
          title="Feedback"
        >
          <MessageCircle className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
