import { describe, it, expect } from "vitest";
import {
  getCardRateForCategory,
  calculateANV,
  filterEligibleCards,
  getFollowUpQuestions,
  applyFollowUpAnswer,
  defaultFollowUpAnswer,
  generatePortfolioStrategy,
  findUpgradePaths,
  type CardDBEntry,
  type CategoryKey,
  type UserCreditProfile,
  type UserOwnedCard,
  type FollowUpQuestion,
} from "@/lib/portfolioEngine";

// ── Helpers ──────────────────────────────────────────────────────────────

function makeCard(overrides: Partial<CardDBEntry> = {}): CardDBEntry {
  return {
    id: "test_card",
    name: "Test Card",
    brand: "Test",
    family_id: "",
    min_score: 670,
    annual_fee: 0,
    subject_524: false,
    rewards: { base: 0.01 },
    ...overrides,
  };
}

function makeProfile(overrides: Partial<UserCreditProfile> = {}): UserCreditProfile {
  return {
    creditScore: 750,
    creditAge: 5,
    cardsOpened24mo: 2,
    feePreference: true,
    ...overrides,
  };
}

function makeOwned(overrides: Partial<UserOwnedCard> = {}): UserOwnedCard {
  return {
    cardId: "test_card",
    name: "Test Card",
    resolvedRewards: { base: 0.01 },
    annual_fee: 0,
    ...overrides,
  };
}

const zeroSpending: Record<CategoryKey, number> = {
  grocery: 0,
  dining: 0,
  rent: 0,
  gas: 0,
  online: 0,
  travel: 0,
  streaming: 0,
  transit: 0,
};

const typicalSpending: Record<CategoryKey, number> = {
  grocery: 500,
  dining: 200,
  rent: 0,
  gas: 100,
  online: 150,
  travel: 50,
  streaming: 30,
  transit: 0,
};

// ── getCardRateForCategory ───────────────────────────────────────────────

describe("getCardRateForCategory", () => {
  it("returns bonus rate for a matching category", () => {
    const rewards = { base: 0.01, groceries: 0.03 };
    expect(getCardRateForCategory(rewards, "grocery")).toBe(0.03);
  });

  it("falls back to base rate for non-bonus categories", () => {
    const rewards = { base: 0.02, groceries: 0.03 };
    expect(getCardRateForCategory(rewards, "dining")).toBe(0.02);
  });

  it("returns 0 for rent with no explicit rent reward (excludes base)", () => {
    const rewards = { base: 0.02, groceries: 0.03 };
    expect(getCardRateForCategory(rewards, "rent")).toBe(0);
  });

  it("handles multiple reward keys mapping to the same category", () => {
    const rewards = { base: 0.01, gas: 0.02, ev_charging: 0.04 };
    expect(getCardRateForCategory(rewards, "gas")).toBe(0.04);
  });

  it("returns 0 when card has no rewards", () => {
    expect(getCardRateForCategory({}, "grocery")).toBe(0);
  });
});

// ── calculateANV ─────────────────────────────────────────────────────────

describe("calculateANV", () => {
  it("returns correct ANV (rewards minus fee)", () => {
    const rewards = { base: 0.01, groceries: 0.03 };
    const spending = { ...zeroSpending, grocery: 500 };
    const { anv } = calculateANV(rewards, spending, 0);
    // 500 * 0.03 * 12 = 180
    expect(anv).toBe(180);
  });

  it("returns correct bestCategory", () => {
    const rewards = { base: 0.01, groceries: 0.03, dining: 0.04 };
    const spending = { ...zeroSpending, grocery: 500, dining: 500 };
    const { bestCategory } = calculateANV(rewards, spending, 0);
    expect(bestCategory).toBe("dining");
  });

  it("zero spending = negative ANV equal to fee", () => {
    const rewards = { base: 0.02 };
    const { anv } = calculateANV(rewards, zeroSpending, 95);
    expect(anv).toBe(-95);
  });

  it("high fee card can have negative ANV", () => {
    const rewards = { base: 0.01, groceries: 0.03 };
    const spending = { ...zeroSpending, grocery: 100 };
    // 100 * 0.03 * 12 = 36, fee = 95 → -59
    const { anv } = calculateANV(rewards, spending, 95);
    expect(anv).toBe(36 - 95);
  });

  it("no-fee card = positive ANV with any spending", () => {
    const rewards = { base: 0.01 };
    const spending = { ...zeroSpending, grocery: 100 };
    // 100 * 0.01 * 12 = 12
    const { anv } = calculateANV(rewards, spending, 0);
    expect(anv).toBe(12);
  });
});

// ── filterEligibleCards ──────────────────────────────────────────────────

describe("filterEligibleCards", () => {
  const cards = [
    makeCard({ id: "a", family_id: "fam1", min_score: 670, annual_fee: 0, subject_524: false }),
    makeCard({ id: "b", family_id: "fam2", min_score: 700, annual_fee: 95, subject_524: true }),
    makeCard({ id: "c", family_id: "fam3", min_score: 300, annual_fee: 0, subject_524: false }),
    makeCard({ id: "d", family_id: "fam1", min_score: 670, annual_fee: 0, subject_524: false }),
    makeCard({ id: "e", family_id: "", min_score: 0, annual_fee: 0, subject_524: false }),
  ];

  it("excludes already-owned cards", () => {
    const result = filterEligibleCards(cards, new Set(["a"]), new Set(), makeProfile());
    expect(result.find((c) => c.id === "a")).toBeUndefined();
  });

  it("excludes same-family cards", () => {
    const result = filterEligibleCards(cards, new Set(), new Set(["fam1"]), makeProfile());
    expect(result.find((c) => c.id === "a")).toBeUndefined();
    expect(result.find((c) => c.id === "d")).toBeUndefined();
  });

  it("excludes cards above user credit score", () => {
    const result = filterEligibleCards(cards, new Set(), new Set(), makeProfile({ creditScore: 650 }));
    expect(result.find((c) => c.id === "a")).toBeUndefined();
    expect(result.find((c) => c.id === "b")).toBeUndefined();
    expect(result.find((c) => c.id === "c")).toBeDefined();
  });

  it("excludes 5/24 restricted cards when over limit", () => {
    const result = filterEligibleCards(cards, new Set(), new Set(), makeProfile({ cardsOpened24mo: 5 }));
    expect(result.find((c) => c.id === "b")).toBeUndefined();
  });

  it("excludes annual-fee cards when user prefers no fees", () => {
    const result = filterEligibleCards(cards, new Set(), new Set(), makeProfile({ feePreference: false }));
    expect(result.find((c) => c.id === "b")).toBeUndefined();
  });

  it("includes secured cards (min_score: 0) for low scores", () => {
    const result = filterEligibleCards(cards, new Set(), new Set(), makeProfile({ creditScore: 300 }));
    expect(result.find((c) => c.id === "e")).toBeDefined();
  });

  it("includes all eligible when profile is strong", () => {
    const result = filterEligibleCards(cards, new Set(), new Set(), makeProfile({ creditScore: 800 }));
    expect(result.length).toBe(5);
  });
});

// ── getFollowUpQuestions ─────────────────────────────────────────────────

describe("getFollowUpQuestions", () => {
  const topCatCard = makeCard({
    id: "citi_custom",
    name: "Citi Custom Cash",
    rewards: { base: 0.01, top_category: 0.05 },
    topCategory_choices: { groceries: "Groceries", dining: "Dining" },
  });
  const customCatCard = makeCard({
    id: "bofa_custom",
    name: "BofA Customized Cash",
    rewards: { base: 0.01, custom: 0.03 },
    customCategory_choices: { gas: "Gas", dining: "Dining" },
  });
  const plainCard = makeCard({ id: "plain", name: "Plain Card" });

  const db = [topCatCard, customCatCard, plainCard];

  it("returns questions for top_category cards", () => {
    const owned = [makeOwned({ cardId: "citi_custom", name: "Citi Custom Cash" })];
    const qs = getFollowUpQuestions(owned, db);
    expect(qs.length).toBe(1);
    expect(qs[0].type).toBe("top_category");
    expect(qs[0].rate).toBe(0.05);
  });

  it("returns questions for custom_category cards", () => {
    const owned = [makeOwned({ cardId: "bofa_custom", name: "BofA Customized Cash" })];
    const qs = getFollowUpQuestions(owned, db);
    expect(qs.length).toBe(1);
    expect(qs[0].type).toBe("custom_category");
  });

  it("returns empty for cards without special categories", () => {
    const owned = [makeOwned({ cardId: "plain", name: "Plain Card" })];
    const qs = getFollowUpQuestions(owned, db);
    expect(qs.length).toBe(0);
  });

  it("skips custom (user-added) cards", () => {
    const owned = [makeOwned({ cardId: "citi_custom", name: "Citi Custom Cash", isCustom: true })];
    const qs = getFollowUpQuestions(owned, db);
    expect(qs.length).toBe(0);
  });

  it("includes correct choices and rates", () => {
    const owned = [makeOwned({ cardId: "citi_custom", name: "Citi Custom Cash" })];
    const qs = getFollowUpQuestions(owned, db);
    expect(qs[0].choices).toEqual({ groceries: "Groceries", dining: "Dining" });
    expect(qs[0].rate).toBe(0.05);
  });
});

// ── applyFollowUpAnswer ──────────────────────────────────────────────────

describe("applyFollowUpAnswer", () => {
  const question: FollowUpQuestion = {
    cardId: "citi_custom",
    cardName: "Citi Custom Cash",
    type: "top_category",
    rate: 0.05,
    choices: { groceries: "Groceries", dining: "Dining" },
  };

  it("assigns rate to chosen key", () => {
    const rewards = { base: 0.01, top_category: 0.05 };
    const result = applyFollowUpAnswer(rewards, question, "groceries");
    expect(result.groceries).toBe(0.05);
  });

  it("removes placeholder keys", () => {
    const rewards = { base: 0.01, top_category: 0.05, custom: 0.03 };
    const result = applyFollowUpAnswer(rewards, question, "groceries");
    expect(result.top_category).toBeUndefined();
    expect(result.custom).toBeUndefined();
  });

  it("does not mutate original object", () => {
    const rewards = { base: 0.01, top_category: 0.05 };
    const original = { ...rewards };
    applyFollowUpAnswer(rewards, question, "groceries");
    expect(rewards).toEqual(original);
  });

  it("works for all placeholder types", () => {
    const rewards = {
      base: 0.01,
      top_category: 0.05,
      custom: 0.03,
      rotating_categories: 0.05,
      chosen_category: 0.03,
      second_category: 0.02,
    };
    const result = applyFollowUpAnswer(rewards, question, "dining");
    expect(result.top_category).toBeUndefined();
    expect(result.custom).toBeUndefined();
    expect(result.rotating_categories).toBeUndefined();
    expect(result.chosen_category).toBeUndefined();
    expect(result.second_category).toBeUndefined();
    expect(result.dining).toBe(0.05);
  });
});

// ── defaultFollowUpAnswer ────────────────────────────────────────────────

describe("defaultFollowUpAnswer", () => {
  const question: FollowUpQuestion = {
    cardId: "citi_custom",
    cardName: "Citi Custom Cash",
    type: "top_category",
    rate: 0.05,
  };

  it("assigns to highest-spend category", () => {
    const rewards = { base: 0.01, top_category: 0.05 };
    const spending = { ...zeroSpending, dining: 400, grocery: 200 };
    const result = defaultFollowUpAnswer(rewards, question, spending);
    expect(result.dining).toBe(0.05);
  });

  it("falls back to grocery when spending is zero", () => {
    const rewards = { base: 0.01, top_category: 0.05 };
    const result = defaultFollowUpAnswer(rewards, question, zeroSpending);
    // Falls back to "grocery" → first DB key is "groceries"
    expect(result.groceries).toBe(0.05);
  });

  it("maps category to correct reward key", () => {
    const rewards = { base: 0.01, top_category: 0.05 };
    const spending = { ...zeroSpending, gas: 300 };
    const result = defaultFollowUpAnswer(rewards, question, spending);
    // gas → first key "gas"
    expect(result.gas).toBe(0.05);
  });
});

// ── generatePortfolioStrategy ────────────────────────────────────────────

describe("generatePortfolioStrategy", () => {
  const sampleDB = [
    makeCard({
      id: "card_a",
      name: "Card A",
      family_id: "fam_a",
      min_score: 670,
      annual_fee: 0,
      rewards: { base: 0.02, groceries: 0.03 },
    }),
    makeCard({
      id: "card_b",
      name: "Card B",
      family_id: "fam_b",
      min_score: 700,
      annual_fee: 0,
      rewards: { base: 0.01, dining: 0.04 },
    }),
    makeCard({
      id: "card_c",
      name: "Card C",
      family_id: "fam_c",
      min_score: 300,
      annual_fee: 0,
      rewards: { base: 0.01, groceries: 0.05 },
    }),
    makeCard({
      id: "card_fee",
      name: "Card Fee",
      family_id: "fam_fee",
      min_score: 700,
      annual_fee: 95,
      rewards: { base: 0.01, groceries: 0.06, streaming: 0.06 },
    }),
  ];

  it("returns valid structure with apply/keep/remove arrays", () => {
    const result = generatePortfolioStrategy(
      sampleDB,
      [makeOwned({ cardId: "card_a", resolvedRewards: { base: 0.02, groceries: 0.03 } })],
      makeProfile(),
      typicalSpending,
      "card_a",
    );
    expect(Array.isArray(result.apply)).toBe(true);
    expect(Array.isArray(result.keep)).toBe(true);
    expect(Array.isArray(result.remove)).toBe(true);
    expect(typeof result.totalCurrentRewards).toBe("number");
    expect(typeof result.totalOptimalRewards).toBe("number");
    expect(Array.isArray(result.categoryBreakdown)).toBe(true);
  });

  it("handles empty portfolio (0 owned cards)", () => {
    const result = generatePortfolioStrategy(sampleDB, [], makeProfile(), typicalSpending);
    expect(result.keep.length).toBe(0);
    expect(result.remove.length).toBe(0);
    expect(result.totalCurrentRewards).toBe(0);
  });

  it("protects oldest card from removal", () => {
    const owned = [
      makeOwned({ cardId: "card_fee", name: "Card Fee", resolvedRewards: { base: 0.01, groceries: 0.06 }, annual_fee: 95 }),
    ];
    // With zero spending, the fee card has negative ANV but should be kept as oldest
    const result = generatePortfolioStrategy(sampleDB, owned, makeProfile(), zeroSpending, "card_fee");
    const removedIds = result.remove.map((r) => r.card.id);
    expect(removedIds).not.toContain("card_fee");
    const keptIds = result.keep.map((k) => k.card.id);
    expect(keptIds).toContain("card_fee");
  });

  it("handles low credit score", () => {
    const result = generatePortfolioStrategy(sampleDB, [], makeProfile({ creditScore: 300 }), typicalSpending);
    // Should only recommend cards with min_score <= 300
    for (const item of result.apply) {
      expect(item.card.min_score).toBeLessThanOrEqual(300);
    }
  });

  it("respects fee preference", () => {
    const result = generatePortfolioStrategy(
      sampleDB,
      [],
      makeProfile({ feePreference: false }),
      typicalSpending,
    );
    for (const item of result.apply) {
      expect(item.card.annual_fee).toBe(0);
    }
  });

  it("includes upgrade array in result", () => {
    const result = generatePortfolioStrategy(sampleDB, [], makeProfile(), typicalSpending);
    expect(Array.isArray(result.upgrade)).toBe(true);
  });
});

// ── findUpgradePaths ──────────────────────────────────────────────────────

describe("findUpgradePaths", () => {
  // US Bank Altitude family: Go has dining 4%, Connect has travel 4% + gas 4%
  const altitudeGo = makeCard({
    id: "usBank_altitudeGo",
    name: "U.S. Bank Altitude Go",
    family_id: "us-bank-altitude",
    min_score: 700,
    annual_fee: 0,
    rewards: { base: 0.01, dining: 0.04, grocery: 0.02, gas_stations: 0.02, streaming: 0.02 },
  });
  const altitudeConnect = makeCard({
    id: "usBank_altitudeConnect",
    name: "U.S. Bank Altitude Connect",
    family_id: "us-bank-altitude",
    min_score: 700,
    annual_fee: 0,
    rewards: { base: 0.01, travel: 0.04, gas_stations: 0.04, grocery: 0.02, dining: 0.02, streaming: 0.02 },
  });

  // QuicksilverOne → Quicksilver (fee elimination)
  const quicksilverOne = makeCard({
    id: "capitalOne_quicksilverOne",
    name: "Capital One QuicksilverOne",
    family_id: "capital-one-quicksilver",
    min_score: 580,
    annual_fee: 39,
    rewards: { base: 0.015 },
  });
  const quicksilver = makeCard({
    id: "capitalOne_quicksilver",
    name: "Capital One Quicksilver",
    family_id: "capital-one-quicksilver",
    min_score: 670,
    annual_fee: 0,
    rewards: { base: 0.015 },
  });

  const standaloneCard = makeCard({
    id: "standalone",
    name: "Standalone Card",
    family_id: "",
    rewards: { base: 0.02 },
  });

  const familyDB = [altitudeGo, altitudeConnect, quicksilverOne, quicksilver, standaloneCard];

  it("suggests Altitude Connect when user owns Altitude Go and spends on travel/gas", () => {
    const owned = [makeOwned({
      cardId: "usBank_altitudeGo",
      name: "U.S. Bank Altitude Go",
      resolvedRewards: altitudeGo.rewards,
      annual_fee: 0,
    })];
    const spending = { ...zeroSpending, travel: 200, gas: 150, dining: 100 };
    const result = findUpgradePaths(familyDB, owned, makeProfile(), spending);
    expect(result.length).toBe(1);
    expect(result[0].card.id).toBe("usBank_altitudeConnect");
    expect(result[0].action).toBe("UPGRADE");
    expect(result[0].upgradeFrom).toBe("U.S. Bank Altitude Go");
  });

  it("does NOT suggest upgrade when spending favors the owned card", () => {
    const owned = [makeOwned({
      cardId: "usBank_altitudeGo",
      name: "U.S. Bank Altitude Go",
      resolvedRewards: altitudeGo.rewards,
      annual_fee: 0,
    })];
    // Heavy dining spending favors Go's 4% dining over Connect's 2%
    const spending = { ...zeroSpending, dining: 500 };
    const result = findUpgradePaths(familyDB, owned, makeProfile(), spending);
    expect(result.length).toBe(0);
  });

  it("suggests fee-eliminating upgrade (QuicksilverOne → Quicksilver)", () => {
    const owned = [makeOwned({
      cardId: "capitalOne_quicksilverOne",
      name: "Capital One QuicksilverOne",
      resolvedRewards: quicksilverOne.rewards,
      annual_fee: 39,
    })];
    const spending = { ...zeroSpending, grocery: 500 };
    const result = findUpgradePaths(familyDB, owned, makeProfile(), spending);
    expect(result.length).toBe(1);
    expect(result[0].card.id).toBe("capitalOne_quicksilver");
    expect(result[0].reason).toContain("eliminates");
  });

  it("all items have action UPGRADE", () => {
    const owned = [
      makeOwned({ cardId: "usBank_altitudeGo", name: "U.S. Bank Altitude Go", resolvedRewards: altitudeGo.rewards, annual_fee: 0 }),
      makeOwned({ cardId: "capitalOne_quicksilverOne", name: "Capital One QuicksilverOne", resolvedRewards: quicksilverOne.rewards, annual_fee: 39 }),
    ];
    const spending = { ...zeroSpending, travel: 200, gas: 150, grocery: 500 };
    const result = findUpgradePaths(familyDB, owned, makeProfile(), spending);
    for (const item of result) {
      expect(item.action).toBe("UPGRADE");
    }
  });

  it("skips cards user already owns", () => {
    const owned = [
      makeOwned({ cardId: "usBank_altitudeGo", name: "U.S. Bank Altitude Go", resolvedRewards: altitudeGo.rewards, annual_fee: 0 }),
      makeOwned({ cardId: "usBank_altitudeConnect", name: "U.S. Bank Altitude Connect", resolvedRewards: altitudeConnect.rewards, annual_fee: 0 }),
    ];
    const spending = { ...zeroSpending, travel: 200, gas: 150 };
    const result = findUpgradePaths(familyDB, owned, makeProfile(), spending);
    const connectUpgrades = result.filter((r) => r.card.id === "usBank_altitudeConnect");
    expect(connectUpgrades.length).toBe(0);
  });

  it("respects feePreference: false", () => {
    // If Connect had a fee, it should be excluded when feePreference is false
    const feeConnect = { ...altitudeConnect, annual_fee: 95 };
    const dbWithFee = [altitudeGo, feeConnect, quicksilverOne, quicksilver];
    const owned = [makeOwned({
      cardId: "usBank_altitudeGo",
      name: "U.S. Bank Altitude Go",
      resolvedRewards: altitudeGo.rewards,
      annual_fee: 0,
    })];
    const spending = { ...zeroSpending, travel: 200, gas: 150 };
    const result = findUpgradePaths(dbWithFee, owned, makeProfile({ feePreference: false }), spending);
    const connectUpgrades = result.filter((r) => r.card.id === "usBank_altitudeConnect");
    expect(connectUpgrades.length).toBe(0);
  });

  it("returns empty for standalone cards (no family_id)", () => {
    const owned = [makeOwned({
      cardId: "standalone",
      name: "Standalone Card",
      resolvedRewards: standaloneCard.rewards,
      annual_fee: 0,
    })];
    const result = findUpgradePaths(familyDB, owned, makeProfile(), typicalSpending);
    expect(result.length).toBe(0);
  });
});
