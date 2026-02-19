// ── Types ──────────────────────────────────────────────────────────────

export interface CardDBEntry {
  id: string;
  name: string;
  brand: string;
  family_id: string;
  min_score: number;
  annual_fee: number;
  subject_524: boolean;
  rewards: Record<string, number>;
  downgrade_to?: string;
  customCategory_choices?: Record<string, string>;
  topCategory_choices?: Record<string, string>;
  rotatingCategory?: Record<string, string>;
  metadata?: Record<string, any>;
}

export type CategoryKey =
  | "grocery"
  | "dining"
  | "rent"
  | "gas"
  | "online"
  | "travel"
  | "streaming"
  | "transit";

export interface UserCreditProfile {
  creditScore: number;
  creditAge: number; // years
  cardsOpened24mo: number;
  feePreference: boolean; // true = open to annual fees
}

export interface UserOwnedCard {
  cardId: string;
  name: string;
  resolvedRewards: Record<string, number>;
  isCustom?: boolean;
  annual_fee: number;
}

export interface StrategyItem {
  action: "APPLY" | "KEEP" | "REMOVE" | "UPGRADE";
  card: CardDBEntry;
  reason: string;
  annualNetValue: number;
  bestCategory?: CategoryKey;
  downgradeTarget?: string;
  alternatives?: CardDBEntry[];
  upgradeFrom?: string;
}

export interface PortfolioStrategy {
  apply: StrategyItem[];
  upgrade: StrategyItem[];
  keep: StrategyItem[];
  remove: StrategyItem[];
  totalCurrentRewards: number;
  totalOptimalRewards: number;
  categoryBreakdown: {
    category: string;
    categoryKey: CategoryKey;
    currentRate: number;
    optimalRate: number;
    currentAnnual: number;
    optimalAnnual: number;
    bestCardName: string;
  }[];
  is524Locked: boolean;
  tips: string[];
}

export interface FollowUpQuestion {
  cardId: string;
  cardName: string;
  type: "top_category" | "rotating" | "chosen_category" | "custom_category";
  rate: number;
  choices?: Record<string, string>;
}

// ── Constants ──────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  grocery: "Groceries",
  dining: "Dining",
  rent: "Rent",
  gas: "Gas",
  online: "Online Shopping",
  travel: "Travel",
  streaming: "Streaming",
  transit: "Transit",
};

/** Maps user spending categories to cardDB reward keys */
export const CATEGORY_MAP: Record<CategoryKey, string[]> = {
  grocery: ["groceries", "online_groceries", "whole_foods", "grocery", "supermarkets", "wholesale"],
  dining: ["dining", "restaurants"],
  rent: ["rent"],
  gas: ["gas", "ev_charging", "gas_stations"],
  online: ["online_shopping", "online_retail"],
  travel: ["travel", "flights", "hotels"],
  streaming: ["streaming"],
  transit: ["transit"],
};

/** Human-readable labels for card reward keys (used in UI) */
export const REWARD_KEY_LABELS: Record<string, string> = {
  base: "Base",
  groceries: "Groceries",
  online_groceries: "Online Groceries",
  whole_foods: "Whole Foods",
  grocery: "Groceries",
  supermarkets: "Supermarkets",
  wholesale: "Wholesale",
  dining: "Dining",
  restaurants: "Restaurants",
  rent: "Rent",
  gas: "Gas",
  ev_charging: "EV Charging",
  gas_stations: "Gas Stations",
  online_shopping: "Online Shopping",
  online_retail: "Online Retail",
  travel: "Travel",
  flights: "Flights",
  hotels: "Hotels",
  streaming: "Streaming",
  transit: "Transit",
  drugstores: "Drugstores",
  home_improvement: "Home Improvement",
  homeImprovement: "Home Improvement",
  entertainment: "Entertainment",
  entertainment_capitalOne: "Entertainment",
  gym: "Gym",
  fitness: "Fitness",
  apple_pay: "Apple Pay",
  amazon: "Amazon",
  paypal: "PayPal",
  paypal_purchases: "PayPal",
  travel_chase: "Chase Travel",
  chase_travel: "Chase Travel",
  travel_capitalOne: "Capital One Travel",
  flights_capitalOne: "Capital One Flights",
  hotel_capitalOne: "Capital One Hotels",
  rentalCar_capitalOne: "Capital One Rental Cars",
  vacationRental_capitalOne: "Capital One Vacation Rentals",
  travel_USBank: "U.S. Bank Travel",
  travel_delta: "Delta",
  flight_amex: "Amex Flights",
  hotel_amex: "Amex Hotels",
};

// ── Extra Category Options (for UI modals) ───────────────────────────

export interface ExtraCategoryOption {
  key: string;
  label: string;
  icon: string;
  group: "spending" | "general" | "retail";
  rewardKeys: string[];
}

export const EXTRA_CATEGORY_GROUP_LABELS: Record<string, string> = {
  spending: "Spending",
  general: "General",
  retail: "Retail",
};

export const EXTRA_CATEGORY_OPTIONS: ExtraCategoryOption[] = [
  // Main spending categories
  { key: "grocery", label: "Groceries", icon: "🛒", group: "spending", rewardKeys: ["groceries", "online_groceries", "whole_foods", "grocery", "supermarkets", "wholesale"] },
  { key: "dining", label: "Dining", icon: "🍽️", group: "spending", rewardKeys: ["dining", "restaurants"] },
  { key: "rent", label: "Rent", icon: "🏠", group: "spending", rewardKeys: ["rent"] },
  { key: "gas", label: "Gas", icon: "⛽", group: "spending", rewardKeys: ["gas", "ev_charging", "gas_stations"] },
  { key: "online", label: "Online Shopping", icon: "📦", group: "spending", rewardKeys: ["online_shopping", "online_retail"] },
  { key: "travel", label: "Travel", icon: "✈️", group: "spending", rewardKeys: ["travel", "flights", "hotels"] },
  { key: "streaming", label: "Streaming/Subscriptions", icon: "📺", group: "spending", rewardKeys: ["streaming"] },
  { key: "transit", label: "Transit", icon: "🚌", group: "spending", rewardKeys: ["transit"] },
  // General extras
  { key: "drugstores", label: "Drugstores", icon: "💊", group: "general", rewardKeys: ["drugstores"] },
  { key: "home_improvement", label: "Home Improvement", icon: "🔨", group: "general", rewardKeys: ["home_improvement", "homeImprovement"] },
  { key: "entertainment", label: "Entertainment", icon: "🎬", group: "general", rewardKeys: ["entertainment", "entertainment_capitalOne"] },
  { key: "gym", label: "Gym & Fitness", icon: "🏋️", group: "general", rewardKeys: ["gym", "fitness"] },
  { key: "apple_pay", label: "Apple Pay", icon: "💻", group: "general", rewardKeys: ["apple_pay"] },
  // Retail
  { key: "amazon", label: "Amazon", icon: "📦", group: "retail", rewardKeys: ["amazon"] },
  { key: "paypal", label: "PayPal", icon: "🅿️", group: "retail", rewardKeys: ["paypal", "paypal_purchases"] },
];

/**
 * Categories where the card's base rate should NOT apply.
 * Rent requires explicit support (e.g. Bilt) — paying rent with a normal
 * credit card incurs ~2.5-3% processing fees that negate any base rewards.
 */
const BASE_RATE_EXCLUDED_CATEGORIES: Set<CategoryKey> = new Set(["rent"]);

/** Portal-specific travel reward keys → human-readable label */
const PORTAL_TRAVEL_MAP: Record<string, string> = {
  travel_chase: "Chase Travel portal",
  chase_travel: "Chase Travel portal",
  travel_capitalOne: "Capital One Travel portal",
  flights_capitalOne: "Capital One Travel portal",
  hotel_capitalOne: "Capital One Travel portal",
  rentalCar_capitalOne: "Capital One Travel portal",
  vacationRental_capitalOne: "Capital One Travel portal",
  travel_USBank: "U.S. Bank Travel portal",
  travel_delta: "Delta",
  flight_amex: "Amex Travel",
  hotel_amex: "Amex Travel",
};

// ── Helpers ────────────────────────────────────────────────────────────

/** Best reward rate a card offers for a user spending category */
export function getCardRateForCategory(
  rewards: Record<string, number>,
  category: CategoryKey,
): number {
  const mappedKeys = CATEGORY_MAP[category];

  // For restricted categories (like rent), only count explicit reward keys —
  // the generic base rate doesn't apply because of processing fees.
  const useBase = !BASE_RATE_EXCLUDED_CATEGORIES.has(category);
  let bestRate = useBase ? (rewards.base ?? 0) : 0;

  for (const key of mappedKeys) {
    if (rewards[key] !== undefined && rewards[key] > bestRate) {
      bestRate = rewards[key];
    }
  }

  return bestRate;
}

/** Build follow-up questions for owned cards that have special category keys */
export function getFollowUpQuestions(
  ownedCards: UserOwnedCard[],
  cardDB: CardDBEntry[],
): FollowUpQuestion[] {
  const questions: FollowUpQuestion[] = [];

  for (const owned of ownedCards) {
    if (owned.isCustom) continue;
    const dbEntry = cardDB.find((c) => c.id === owned.cardId);
    if (!dbEntry) continue;

    // Citi Custom Cash style — top_category with topCategory_choices
    if (dbEntry.rewards.top_category !== undefined && dbEntry.topCategory_choices) {
      questions.push({
        cardId: owned.cardId,
        cardName: owned.name,
        type: "top_category",
        rate: dbEntry.rewards.top_category,
        choices: dbEntry.topCategory_choices,
      });
    }

    // BofA Customized Cash style — custom with customCategory_choices
    if (dbEntry.rewards.custom !== undefined && dbEntry.customCategory_choices) {
      questions.push({
        cardId: owned.cardId,
        cardName: owned.name,
        type: "custom_category",
        rate: dbEntry.rewards.custom,
        choices: dbEntry.customCategory_choices,
      });
    }

    // Rotating categories (Freedom Flex, Discover it) are bank-assigned each
    // quarter — no follow-up question needed.

    if (dbEntry.rewards.chosen_category !== undefined) {
      questions.push({
        cardId: owned.cardId,
        cardName: owned.name,
        type: "chosen_category",
        rate: dbEntry.rewards.chosen_category,
      });
    }
  }

  return questions;
}

/** Apply a follow-up answer: assign the special rate to the chosen reward key */
export function applyFollowUpAnswer(
  rewards: Record<string, number>,
  question: FollowUpQuestion,
  chosenKey: string,
): Record<string, number> {
  const updated = { ...rewards };
  // Set the rate directly on the chosen reward key
  updated[chosenKey] = Math.max(updated[chosenKey] ?? 0, question.rate);
  // Remove the placeholder keys so they don't float
  delete updated["top_category"];
  delete updated["custom"];
  delete updated["rotating_categories"];
  delete updated["chosen_category"];
  delete updated["second_category"];
  return updated;
}

/** Default follow-up: assign special rate to user's highest-spend category */
export function defaultFollowUpAnswer(
  rewards: Record<string, number>,
  question: FollowUpQuestion,
  spending: Record<CategoryKey, number>,
): Record<string, number> {
  let bestCat: CategoryKey = "grocery";
  let bestSpend = 0;
  for (const [cat, amt] of Object.entries(spending) as [
    CategoryKey,
    number,
  ][]) {
    if (amt > bestSpend) {
      bestSpend = amt;
      bestCat = cat;
    }
  }
  // Map the category to the first DB reward key
  const dbKey = CATEGORY_MAP[bestCat][0];
  return applyFollowUpAnswer(rewards, question, dbKey);
}

// ── Filters ────────────────────────────────────────────────────────────

export function filterEligibleCards(
  cardDB: CardDBEntry[],
  ownedCardIds: Set<string>,
  ownedFamilyIds: Set<string>,
  profile: UserCreditProfile,
): CardDBEntry[] {
  return cardDB.filter((card) => {
    if (ownedCardIds.has(card.id)) return false;
    // Skip cards from families the user already has a card in
    if (card.family_id && ownedFamilyIds.has(card.family_id)) return false;
    if (profile.creditScore < card.min_score) return false;
    if (profile.cardsOpened24mo >= 5 && card.subject_524) return false;
    if (!profile.feePreference && card.annual_fee > 0) return false;
    return true;
  });
}

// ── ANV Calculation ────────────────────────────────────────────────────

export function calculateANV(
  rewards: Record<string, number>,
  spending: Record<CategoryKey, number>,
  annualFee: number,
): { anv: number; bestCategory: CategoryKey; bestCategoryValue: number } {
  let totalRewards = 0;
  let bestCategory: CategoryKey = "grocery";
  let bestCategoryValue = 0;

  for (const [cat, monthlySpend] of Object.entries(spending) as [
    CategoryKey,
    number,
  ][]) {
    if (monthlySpend === 0) continue;
    const rate = getCardRateForCategory(rewards, cat);
    const annualValue = monthlySpend * rate * 12;
    totalRewards += annualValue;

    if (annualValue > bestCategoryValue) {
      bestCategoryValue = annualValue;
      bestCategory = cat;
    }
  }

  return { anv: totalRewards - annualFee, bestCategory, bestCategoryValue };
}

// ── Upgrade Path Detection ─────────────────────────────────────────────

export function findUpgradePaths(
  cardDB: CardDBEntry[],
  ownedCards: UserOwnedCard[],
  profile: UserCreditProfile,
  spending: Record<CategoryKey, number>,
): StrategyItem[] {
  const ownedCardIds = new Set(ownedCards.map((c) => c.cardId));
  const upgradeItems: StrategyItem[] = [];

  for (const owned of ownedCards) {
    const dbEntry = cardDB.find((c) => c.id === owned.cardId);
    if (!dbEntry) continue;
    if (!dbEntry.family_id) continue;

    const { anv: ownedAnv } = calculateANV(owned.resolvedRewards, spending, dbEntry.annual_fee);

    // Find same-family cards the user doesn't own
    const sameFamilyCandidates = cardDB.filter((c) => {
      if (c.id === owned.cardId) return false;
      if (ownedCardIds.has(c.id)) return false;
      if (c.family_id !== dbEntry.family_id) return false;
      if (profile.creditScore < c.min_score) return false;
      if (!profile.feePreference && c.annual_fee > 0) return false;
      return true;
    });

    for (const candidate of sameFamilyCandidates) {
      const { anv: candidateAnv } = calculateANV(candidate.rewards, spending, candidate.annual_fee);
      if (candidateAnv <= ownedAnv) continue;

      const gain = candidateAnv - ownedAnv;
      const feeDiff = candidate.annual_fee - dbEntry.annual_fee;
      let reason = `Product change saves +$${gain.toFixed(0)}/yr in net rewards.`;
      if (feeDiff < 0) {
        reason += ` Also eliminates $${Math.abs(feeDiff)}/yr in fees.`;
      } else if (feeDiff > 0) {
        reason += ` Fee increases by $${feeDiff}/yr, but rewards more than offset it.`;
      }

      upgradeItems.push({
        action: "UPGRADE",
        card: candidate,
        reason,
        annualNetValue: candidateAnv,
        upgradeFrom: owned.name,
      });
    }
  }

  return upgradeItems;
}

// ── Strategy Generation ────────────────────────────────────────────────

function makeFallbackCard(owned: UserOwnedCard): CardDBEntry {
  return {
    id: owned.cardId,
    name: owned.name,
    brand: "",
    family_id: "",
    min_score: 0,
    annual_fee: owned.annual_fee,
    subject_524: false,
    rewards: owned.resolvedRewards,
  };
}

/** Get the quarter end date string for rotating category tips */
function getQuarterEndDate(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  if (month < 3) return "March 31";
  if (month < 6) return "June 30";
  if (month < 9) return "September 30";
  return "December 31";
}

export function generatePortfolioStrategy(
  cardDB: CardDBEntry[],
  ownedCards: UserOwnedCard[],
  profile: UserCreditProfile,
  spending: Record<CategoryKey, number>,
  oldestCardId?: string,
): PortfolioStrategy {
  const ownedCardIds = new Set(ownedCards.map((c) => c.cardId));
  const ownedFamilyIds = new Set(
    ownedCards
      .map((c) => cardDB.find((db) => db.id === c.cardId)?.family_id)
      .filter((f): f is string => !!f),
  );
  const is524Locked = profile.cardsOpened24mo >= 5;

  // ── Current rewards from owned cards ──
  const currentBestRates: Record<CategoryKey, number> = {
    grocery: 0,
    dining: 0,
    rent: 0,
    gas: 0,
    online: 0,
    travel: 0,
    streaming: 0,
    transit: 0,
  };

  for (const owned of ownedCards) {
    for (const cat of Object.keys(currentBestRates) as CategoryKey[]) {
      const rate = getCardRateForCategory(owned.resolvedRewards, cat);
      if (rate > currentBestRates[cat]) {
        currentBestRates[cat] = rate;
      }
    }
  }

  let totalCurrentRewards = 0;
  for (const cat of Object.keys(currentBestRates) as CategoryKey[]) {
    totalCurrentRewards += spending[cat] * currentBestRates[cat] * 12;
  }

  // ── Filter & rank eligible cards ──
  const eligible = filterEligibleCards(
    cardDB,
    ownedCardIds,
    ownedFamilyIds,
    profile,
  );

  // ── APPLY: best card per category where there's an improvement ──
  type CandidateHit = {
    card: CardDBEntry;
    category: CategoryKey;
    rate: number;
    currentRate: number;
    annualGain: number;
    anv: number;
    alternatives?: CardDBEntry[];
  };

  const categoryWinners: CandidateHit[] = [];

  for (const cat of Object.keys(currentBestRates) as CategoryKey[]) {
    const monthlySpend = spending[cat];
    if (monthlySpend === 0) continue;
    const currentRate = currentBestRates[cat];

    let bestHit: CandidateHit | null = null;

    for (const card of eligible) {
      const rate = getCardRateForCategory(card.rewards, cat);
      if (rate <= currentRate) continue;

      const annualGain = (rate - currentRate) * monthlySpend * 12;
      const { anv } = calculateANV(card.rewards, spending, card.annual_fee);
      if (anv <= 0) continue;

      if (
        !bestHit ||
        annualGain > bestHit.annualGain ||
        (annualGain === bestHit.annualGain && anv > bestHit.anv)
      ) {
        bestHit = { card, category: cat, rate, currentRate, annualGain, anv };
      }
    }

    // Collect tied alternatives: same annualGain AND anv, different card/family
    if (bestHit) {
      const alts: CardDBEntry[] = [];
      for (const card of eligible) {
        if (card.id === bestHit.card.id) continue;
        if (card.family_id && card.family_id === bestHit.card.family_id) continue;

        const rate = getCardRateForCategory(card.rewards, cat);
        if (rate <= currentRate) continue;

        const annualGain = (rate - currentRate) * monthlySpend * 12;
        const { anv } = calculateANV(card.rewards, spending, card.annual_fee);

        if (annualGain === bestHit.annualGain && anv === bestHit.anv) {
          alts.push(card);
        }
      }
      if (alts.length > 0) bestHit.alternatives = alts;
      categoryWinners.push(bestHit);
    }
  }

  categoryWinners.sort((a, b) => b.annualGain - a.annualGain);

  const applyItems: StrategyItem[] = [];
  const usedCardIds = new Set<string>();
  const usedFamilies = new Set<string>();

  for (const hit of categoryWinners) {
    if (applyItems.length >= 3) break;
    if (usedCardIds.has(hit.card.id)) continue;
    if (hit.card.family_id && usedFamilies.has(hit.card.family_id)) continue;

    usedCardIds.add(hit.card.id);
    if (hit.card.family_id) usedFamilies.add(hit.card.family_id);

    const catLabel = CATEGORY_LABELS[hit.category] || hit.category;
    const { anv } = calculateANV(
      hit.card.rewards,
      spending,
      hit.card.annual_fee,
    );

    applyItems.push({
      action: "APPLY" as const,
      card: hit.card,
      reason: `Best for ${catLabel} — ${(hit.rate * 100).toFixed(1)}% vs your current ${(hit.currentRate * 100).toFixed(1)}%, saving +$${hit.annualGain.toFixed(0)}/yr in that category`,
      annualNetValue: anv,
      bestCategory: hit.category,
      alternatives: hit.alternatives,
    });
  }

  // ── Portal-specific travel recommendation ──
  if (spending.travel > 0) {
    let bestPortalCard: CardDBEntry | null = null;
    let bestPortalRate = 0;
    let bestPortalLabel = "";

    for (const card of eligible) {
      if (usedCardIds.has(card.id)) continue;
      if (card.family_id && usedFamilies.has(card.family_id)) continue;

      for (const [key, label] of Object.entries(PORTAL_TRAVEL_MAP)) {
        if (card.rewards[key] !== undefined && card.rewards[key] > bestPortalRate) {
          const { anv: cardAnv } = calculateANV(card.rewards, spending, card.annual_fee);
          if (cardAnv > 0 || card.annual_fee === 0) {
            bestPortalRate = card.rewards[key];
            bestPortalLabel = label;
            bestPortalCard = card;
          }
        }
      }
    }

    if (bestPortalCard && bestPortalRate > currentBestRates.travel) {
      const annualGain = (bestPortalRate - currentBestRates.travel) * spending.travel * 12;
      const { anv: portalAnv } = calculateANV(bestPortalCard.rewards, spending, bestPortalCard.annual_fee);

      usedCardIds.add(bestPortalCard.id);
      if (bestPortalCard.family_id) usedFamilies.add(bestPortalCard.family_id);

      applyItems.push({
        action: "APPLY" as const,
        card: bestPortalCard,
        reason: `Best for Travel via ${bestPortalLabel} — ${(bestPortalRate * 100).toFixed(1)}% vs your current ${(currentBestRates.travel * 100).toFixed(1)}%, saving +$${annualGain.toFixed(0)}/yr when booking through their portal`,
        annualNetValue: portalAnv,
        bestCategory: "travel",
      });
    }
  }

  // ── KEEP / REMOVE for owned cards ──
  const keepItems: StrategyItem[] = [];
  const removeItems: StrategyItem[] = [];

  // Find oldest card by explicit ID or fallback to first card
  const oldestCard: UserOwnedCard | null = oldestCardId
    ? ownedCards.find((c) => c.cardId === oldestCardId) ?? null
    : ownedCards.length > 0 ? ownedCards[0] : null;

  for (const owned of ownedCards) {
    const dbEntry = cardDB.find((c) => c.id === owned.cardId);
    const fee = owned.annual_fee;
    const { anv } = calculateANV(owned.resolvedRewards, spending, fee);
    const isOldest = oldestCard !== null && owned.cardId === oldestCard.cardId;
    const card = dbEntry || makeFallbackCard(owned);

    const downgradeTarget = dbEntry?.downgrade_to
      ? cardDB.find((c) => c.id === dbEntry.downgrade_to)?.name
      : undefined;

    if (fee > 0 && anv < 0) {
      if (isOldest) {
        keepItems.push({
          action: "KEEP",
          card,
          reason: downgradeTarget
            ? `Oldest card — protects credit history. Consider downgrading to ${downgradeTarget} to eliminate the $${fee}/yr fee.`
            : `Oldest card — protects credit history, but the $${fee}/yr fee exceeds rewards earned ($${Math.abs(anv).toFixed(0)}/yr gap).`,
          annualNetValue: anv,
          downgradeTarget,
        });
      } else {
        removeItems.push({
          action: "REMOVE",
          card,
          reason: downgradeTarget
            ? `$${fee}/yr fee exceeds earned rewards by $${Math.abs(anv).toFixed(0)}/yr. Downgrade to ${downgradeTarget} to keep the account open.`
            : `$${fee}/yr fee exceeds earned rewards by $${Math.abs(anv).toFixed(0)}/yr. Consider closing.`,
          annualNetValue: anv,
          downgradeTarget,
        });
      }
    } else if (fee > 0 && !isOldest) {
      const otherOwnedRewards = ownedCards
        .filter((o) => o.cardId !== owned.cardId)
        .map((o) => o.resolvedRewards);
      const applyRewards = applyItems.map((a) => a.card.rewards);
      const allOtherRewards = [...otherOwnedRewards, ...applyRewards];

      let isRedundant = true;
      let bestUniqueGain = 0;
      for (const cat of Object.keys(spending) as CategoryKey[]) {
        if (spending[cat] === 0) continue;
        const thisRate = getCardRateForCategory(owned.resolvedRewards, cat);
        const bestOtherRate = Math.max(
          ...allOtherRewards.map((r) => getCardRateForCategory(r, cat)),
          0,
        );
        if (thisRate > bestOtherRate) {
          isRedundant = false;
          bestUniqueGain += (thisRate - bestOtherRate) * spending[cat] * 12;
        }
      }

      if (isRedundant) {
        removeItems.push({
          action: "REMOVE",
          card,
          reason: downgradeTarget
            ? `Redundant — every category is already matched or beaten by your other cards. $${fee}/yr fee is unnecessary. Downgrade to ${downgradeTarget} to keep the account open.`
            : `Redundant — every category is already matched or beaten by your other cards. $${fee}/yr fee is unnecessary. Consider closing.`,
          annualNetValue: anv,
          downgradeTarget,
        });
      } else if (bestUniqueGain < fee) {
        removeItems.push({
          action: "REMOVE",
          card,
          reason: downgradeTarget
            ? `Unique rewards only add $${bestUniqueGain.toFixed(0)}/yr beyond your other cards, but the fee is $${fee}/yr. Downgrade to ${downgradeTarget} to keep the account open.`
            : `Unique rewards only add $${bestUniqueGain.toFixed(0)}/yr beyond your other cards, but the fee is $${fee}/yr. Consider closing.`,
          annualNetValue: anv,
          downgradeTarget,
        });
      } else {
        const reason = `Earns $${(anv + fee).toFixed(0)}/yr in rewards, net $${anv.toFixed(0)}/yr after $${fee} fee.`;
        keepItems.push({ action: "KEEP", card, reason, annualNetValue: anv });
      }
    } else if (fee === 0 && !isOldest && ownedCards.length > 1) {
      const otherOwnedRewards = ownedCards
        .filter((o) => o.cardId !== owned.cardId)
        .map((o) => o.resolvedRewards);
      const applyRewards = applyItems.map((a) => a.card.rewards);
      const allOtherRewards = [...otherOwnedRewards, ...applyRewards];

      let isRedundant = true;
      for (const cat of Object.keys(spending) as CategoryKey[]) {
        if (spending[cat] === 0) continue;
        const thisRate = getCardRateForCategory(owned.resolvedRewards, cat);
        if (thisRate === 0) continue;
        const bestOtherRate = Math.max(
          ...allOtherRewards.map((r) => getCardRateForCategory(r, cat)),
          0,
        );
        if (thisRate > bestOtherRate) {
          isRedundant = false;
          break;
        }
      }

      if (isRedundant) {
        removeItems.push({
          action: "REMOVE",
          card,
          reason:
            anv > 0
              ? `Every category is already matched or beaten by your other cards. You can cancel this card — your rewards won't change.`
              : `This card earns no meaningful rewards for your spending. Consider canceling to simplify your wallet.`,
          annualNetValue: anv,
        });
      } else {
        const reason =
          anv > 0
            ? `No annual fee — earns $${anv.toFixed(0)}/yr in rewards.`
            : "No annual fee — keep open for credit utilization.";
        keepItems.push({ action: "KEEP", card, reason, annualNetValue: anv });
      }
    } else {
      let reason: string;
      if (isOldest && ownedCards.length > 1) {
        reason = `Oldest card — protects credit history.`;
        if (anv > 0) reason += ` Earns $${anv.toFixed(0)}/yr net.`;
      } else if (fee === 0) {
        reason =
          anv > 0
            ? `No annual fee — earns $${anv.toFixed(0)}/yr in rewards.`
            : "No annual fee — keep open for credit utilization.";
      } else {
        reason = `Earns $${(anv + fee).toFixed(0)}/yr in rewards, net $${anv.toFixed(0)}/yr after $${fee} fee.`;
      }
      keepItems.push({ action: "KEEP", card, reason, annualNetValue: anv });
    }
  }

  // ── Category breakdown (current vs optimal with APPLY cards added) ──
  // Build named reward sets: kept owned cards + apply cards
  const keptOwned = ownedCards.filter(
    (o) => !removeItems.some((r) => r.card.id === o.cardId),
  );
  const namedRewardSets: { name: string; rewards: Record<string, number> }[] = [
    ...keptOwned.map((o) => ({ name: o.name, rewards: o.resolvedRewards })),
    ...applyItems.map((a) => ({ name: a.card.name, rewards: a.card.rewards })),
  ];

  const optimalBestRates: Record<CategoryKey, number> = {
    grocery: 0,
    dining: 0,
    rent: 0,
    gas: 0,
    online: 0,
    travel: 0,
    streaming: 0,
    transit: 0,
  };
  const optimalBestCardNames: Record<CategoryKey, string> = {
    grocery: "",
    dining: "",
    rent: "",
    gas: "",
    online: "",
    travel: "",
    streaming: "",
    transit: "",
  };

  for (const { name, rewards } of namedRewardSets) {
    for (const cat of Object.keys(optimalBestRates) as CategoryKey[]) {
      const rate = getCardRateForCategory(rewards, cat);
      if (rate > optimalBestRates[cat]) {
        optimalBestRates[cat] = rate;
        optimalBestCardNames[cat] = name;
      }
    }
  }

  let totalOptimalRewards = 0;
  const categoryBreakdown = (
    Object.keys(currentBestRates) as CategoryKey[]
  ).map((cat) => {
    const monthly = spending[cat];
    const optAnnual = monthly * optimalBestRates[cat] * 12;
    totalOptimalRewards += optAnnual;
    return {
      category: CATEGORY_LABELS[cat],
      categoryKey: cat,
      currentRate: currentBestRates[cat],
      optimalRate: optimalBestRates[cat],
      currentAnnual: monthly * currentBestRates[cat] * 12,
      optimalAnnual: optAnnual,
      bestCardName: optimalBestCardNames[cat],
    };
  });

  // ── Edge case: no eligible cards at all — suggest secured cards ──
  if (applyItems.length === 0 && eligible.length === 0) {
    const securedCards = cardDB.filter(
      (c) => c.min_score <= 300 && !ownedCardIds.has(c.id),
    );
    if (securedCards.length > 0) {
      applyItems.push({
        action: "APPLY",
        card: securedCards[0],
        reason:
          "Start building credit with a secured card. No credit history required.",
        annualNetValue: 0,
      });
    }
  }

  // ── Generate tips / developer's summary ──
  const tips: string[] = [];

  // Tip 1: Main summary sentence
  if (applyItems.length > 0) {
    const totalFees = applyItems.reduce((s, a) => s + a.card.annual_fee, 0);
    const feeNote =
      totalFees > 0
        ? ` (total annual fees: $${totalFees}/yr)`
        : " (all with no annual fee)";
    tips.push(
      `Based on your spending habits, we recommend ${applyItems.length === 1 ? "adding 1 strategic card" : `building a portfolio with ${applyItems.length} new strategic cards`}${feeNote}. ${applyItems.map((a) => `**${a.card.name}** was chosen because it offers the best improvement for your ${categoryBreakdown.find((b) => b.optimalRate > b.currentRate && a.reason.toLowerCase().includes(b.category.toLowerCase()))?.category ?? "overall"} spending.`).join(" ")}`,
    );
  }

  // Tip 2: Flat-rate card recommendation if no high base-rate card
  const allCardIds = new Set([
    ...ownedCardIds,
    ...applyItems.map((a) => a.card.id),
  ]);
  const bestBase = Math.max(
    ...ownedCards.map((o) => o.resolvedRewards.base ?? 0),
    ...applyItems.map((a) => a.card.rewards.base ?? 0),
    0,
  );
  if (bestBase < 0.02) {
    const flatRateCards = cardDB.filter(
      (c) =>
        (c.rewards.base ?? 0) >= 0.02 &&
        c.annual_fee === 0 &&
        !allCardIds.has(c.id) &&
        c.min_score <= profile.creditScore,
    );
    if (flatRateCards.length > 0) {
      tips.push(
        `We also recommend adding a **2% flat-rate card** like **${flatRateCards[0].name}** for purchases that don't fit bonus categories.`,
      );
    }
  }

  // Tip 3: Rotating card info — only if user OWNS or is being recommended a rotating card
  const quarterEnd = getQuarterEndDate();
  const userHasRotating = [...ownedCardIds, ...applyItems.map((a) => a.card.id)].some(
    (id) => {
      const card = cardDB.find((c) => c.id === id);
      return card?.rewards.rotating_categories !== undefined;
    },
  );
  if (userHasRotating) {
    const rotatingCardNames = [
      ...ownedCards.filter((o) => {
        const db = cardDB.find((c) => c.id === o.cardId);
        return db?.rewards.rotating_categories !== undefined;
      }).map((o) => o.name),
      ...applyItems.filter((a) => a.card.rewards.rotating_categories !== undefined).map((a) => a.card.name),
    ];
    tips.push(
      `**Quarterly Bonus Tip:** Your **${rotatingCardNames.join(" and ")}** ${rotatingCardNames.length === 1 ? "offers" : "offer"} 5% rotating categories (current quarter ends ${quarterEnd}). These rotate every 3 months, so we didn't include them in your annual calculation — but they're great for extra savings when the categories align!`,
    );
  }

  // Tip 4: Custom/top_category cards that could choose travel
  if (spending.travel > 0) {
    for (const card of eligible) {
      if (allCardIds.has(card.id)) continue;
      if (card.family_id && usedFamilies.has(card.family_id)) continue;

      if (card.topCategory_choices && "travel" in card.topCategory_choices) {
        const rate = card.rewards.top_category;
        if (rate && rate > currentBestRates.travel) {
          tips.push(
            `**${card.name}** could earn ${(rate * 100).toFixed(0)}% on travel if it becomes your top spending category — higher than your current ${(currentBestRates.travel * 100).toFixed(1)}%.`,
          );
          break;
        }
      }
      if (card.customCategory_choices && "travel" in card.customCategory_choices) {
        const rate = card.rewards.custom;
        if (rate && rate > currentBestRates.travel) {
          tips.push(
            `**${card.name}** could earn ${(rate * 100).toFixed(0)}% on travel if you choose it as your custom category.`,
          );
          break;
        }
      }
    }
  }

  // Tip 5: If user has uncovered categories at base rate
  const weakCategories = categoryBreakdown
    .filter(
      (b) =>
        b.optimalRate <= 0.01 && spending[b.categoryKey as CategoryKey] > 0,
    )
    .map((b) => b.category);
  if (weakCategories.length > 0) {
    tips.push(
      `Your **${weakCategories.join(" and ")}** spending ${weakCategories.length === 1 ? "is" : "are"} still earning the base rate. Look for specialized cards in ${weakCategories.length === 1 ? "this category" : "these categories"} as new products launch.`,
    );
  }

  const upgradeItems = findUpgradePaths(cardDB, ownedCards, profile, spending);

  return {
    apply: applyItems,
    upgrade: upgradeItems,
    keep: keepItems,
    remove: removeItems,
    totalCurrentRewards,
    totalOptimalRewards,
    categoryBreakdown,
    is524Locked,
    tips,
  };
}
