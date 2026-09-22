/**
 * FAQ matching for the chatbot and the FAQ page search. It runs entirely in the
 * browser — no AI or paid API — by scoring the visitor's words against each
 * question (strongest), its keywords, its category and its answer.
 */
import type { FaqItem } from "@/types/content";

export interface FaqMatch {
  item: FaqItem;
  /** 0–1: how much of the visitor's question this FAQ covers. */
  score: number;
}

/** A match at or above this score is answered directly; below it we suggest options. */
export const CONFIDENT_MATCH = 0.45;

const WEIGHT = { question: 3, keyword: 2.5, category: 1, answer: 1 } as const;
const PARTIAL_MATCH_FACTOR = 0.5;
/** Each extra word counts half, so a long question isn't drowned out by filler words. */
const EXTRA_WORD_FACTOR = 0.5;
const MIN_PARTIAL_LENGTH = 4;

const STOP_WORDS = new Set(
  (
    "a about am an and any are as at be been but by can could did do does for from get give have how i if in " +
    "into is it its me more my need of on or our please shall should so tell that the their them then there " +
    "these they this those to us want was we what when where which who why will with would you your"
  ).split(" "),
);

/** Words that mean the same thing in a trade enquiry. */
const SYNONYM_GROUPS = [
  ["buy", "buyer", "purchase", "procure"],
  ["supplier", "supply", "vendor", "seller"],
  ["price", "pricing", "quote", "quotation", "cost", "rate"],
  ["market", "country", "destination", "region"],
  ["contact", "email", "phone", "call", "reach", "talk"],
  ["quality", "inspection", "inspect", "check", "verify", "test"],
  ["specification", "spec", "datasheet", "grade"],
  ["partner", "partnership", "collaborate", "distributor", "agent"],
  ["shipping", "ship", "freight", "logistic", "transport"],
  ["register", "registration", "join", "onboard", "signup"],
];

function stem(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && /(ss|x|ch|sh)es$/.test(word)) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

const canonical = new Map<string, string>(
  SYNONYM_GROUPS.flatMap((group) => group.map((word) => [stem(word), stem(group[0] ?? word)] as const)),
);

/** Lower-cases, drops punctuation and stop words, stems, and maps synonyms to one form. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !/^\d+$/.test(word) && !STOP_WORDS.has(word))
    .map((word) => {
      const stemmed = stem(word);
      return canonical.get(stemmed) ?? stemmed;
    });
}

type TokenWeights = Map<string, number>;

function addTokens(weights: TokenWeights, text: string, weight: number) {
  for (const token of tokenize(text)) {
    weights.set(token, Math.max(weights.get(token) ?? 0, weight));
  }
}

function indexItem(item: FaqItem): TokenWeights {
  const weights: TokenWeights = new Map();
  addTokens(weights, item.answer, WEIGHT.answer);
  addTokens(weights, item.category, WEIGHT.category);
  for (const keyword of item.keywords ?? []) addTokens(weights, keyword, WEIGHT.keyword);
  addTokens(weights, item.question, WEIGHT.question);
  return weights;
}

function tokenScore(token: string, weights: TokenWeights): number {
  const exact = weights.get(token);
  if (exact) return exact;
  if (token.length < MIN_PARTIAL_LENGTH) return 0;
  let best = 0;
  for (const [candidate, weight] of weights) {
    if (candidate.length >= MIN_PARTIAL_LENGTH && (candidate.startsWith(token) || token.startsWith(candidate))) {
      best = Math.max(best, weight * PARTIAL_MATCH_FACTOR);
    }
  }
  return best;
}

/** Builds a reusable search over a fixed FAQ list; returns matches, best first. */
export function createFaqSearch(items: FaqItem[]) {
  const index = items.map((item) => ({ item, weights: indexItem(item) }));

  return function search(query: string): FaqMatch[] {
    const tokens = [...new Set(tokenize(query))];
    if (tokens.length === 0) return [];
    const maxScore = WEIGHT.question * (1 + (tokens.length - 1) * EXTRA_WORD_FACTOR);

    return index
      .map(({ item, weights }) => ({
        item,
        score: Math.min(1, tokens.reduce((total, token) => total + tokenScore(token, weights), 0) / maxScore),
      }))
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score);
  };
}

/** Up to `count` questions, taking one from each category in turn. */
export function pickAcrossCategories(items: FaqItem[], count: number): FaqItem[] {
  const byCategory = new Map<string, FaqItem[]>();
  for (const item of items) byCategory.set(item.category, [...(byCategory.get(item.category) ?? []), item]);
  const queues = [...byCategory.values()];
  const picked: FaqItem[] = [];
  for (let round = 0; picked.length < count && queues.some((queue) => queue.length > round); round++) {
    for (const queue of queues) {
      const item = queue[round];
      if (item && picked.length < count) picked.push(item);
    }
  }
  return picked;
}

/** Other questions from the same category, for "related questions". */
export function relatedQuestions(items: FaqItem[], current: FaqItem, count: number): FaqItem[] {
  return items.filter((item) => item !== current && item.category === current.category).slice(0, count);
}
