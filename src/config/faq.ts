/**
 * FAQ page wording and topics. The questions and answers themselves are
 * managed in the admin (Website content → FAQs) and power the FAQ page, the
 * FAQ sections and the website assistant.
 */
import type { FaqCategory, SectionContent } from "@/types/content";

/** FAQ topics, in display order. Offered as choices in the admin. */
export const FAQ_CATEGORY = {
  company: "About us",
  catalogue: "Products & markets",
  trading: "Working with us",
} as const;

export const faqCategories: FaqCategory[] = Object.values(FAQ_CATEGORY);

export const faqHeading: SectionContent = {
  eyebrow: "FAQ",
  title: "Questions, Answered",
  description: "Can't find what you're looking for? Send us an enquiry and our trade desk will help.",
};

/** Labels for the FAQ page's search and filters. */
export const faqPageLabels = {
  searchLabel: "Search the FAQs",
  searchPlaceholder: "Search, e.g. “price quote” or “which markets”",
  clearSearch: "Clear search",
  categoryFilter: "Filter by topic",
  allCategories: "All topics",
  result: "answer",
  results: "answers",
  for: "for",
  noResultsTitle: "No matching questions",
  noResultsDescription: "Our assistant may still help — or send the question straight to our trade desk.",
  askAssistant: "Ask the assistant",
  seeAll: "See all questions",
};
