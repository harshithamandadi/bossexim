/**
 * Aira's conversation logic, kept apart from the panel's UI. Each visitor
 * input (typed text, a tapped option or an FAQ suggestion) goes through
 * `respond`, which returns the next flow state and Aira's replies. Nothing here
 * talks to the server: submitting a buying enquiry is returned as an effect.
 */
import {
  buyingSteps,
  chatbotContent,
  OTHER_PRODUCT_ANSWER,
  type BuyingStep,
  type BuyingStepId,
} from "@/config/chatbot";
import { productHref } from "@/config/routes";
import { checkAnswer, isStepAsked, type BuyingAnswers } from "@/lib/enquiry/assistant";
import { CONFIDENT_MATCH, relatedQuestions } from "@/lib/faq-search";
import type { FaqItem, LinkItem, SpecificationTable } from "@/types/content";

const content = chatbotContent;
const GREETING_PATTERN = /^(hi|hello|hey|hiya|good (morning|afternoon|evening)|namaste)\b/i;
const THANKS_PATTERN = /^(thanks|thank you|thx|cheers|great|ok|okay)\b/i;

/** What Aira needs to know about a product to answer questions about it. */
export interface AssistantProduct {
  slug: string;
  name: string;
  variants?: string[];
  variantsLabel?: string;
  packaging?: string;
  documentation?: string[];
  specifications?: SpecificationTable[];
}

export interface ChatChoice {
  id: string;
  label: string;
}

export interface ChatTable {
  title?: string;
  rows: [string, string][];
}

export interface Suggestions {
  label?: string;
  items: FaqItem[];
}

export type ChatMessage =
  | { from: "visitor"; text: string }
  | {
      from: "assistant";
      text: string;
      tables?: ChatTable[];
      list?: string[];
      /** Shown after the tables and list. */
      footer?: string;
      reference?: { label: string; value: string };
      action?: LinkItem;
      suggestions?: Suggestions;
      /** Buttons offered only while this is the newest message. */
      choices?: ChatChoice[];
    };

export type AssistantMessage = Extract<ChatMessage, { from: "assistant" }>;

export type Flow =
  | { kind: "browse"; draft?: BuyingAnswers }
  | { kind: "product-other" }
  | { kind: "buying"; step: BuyingStepId; answers: BuyingAnswers }
  | { kind: "confirm"; answers: BuyingAnswers }
  | { kind: "submitting"; answers: BuyingAnswers };

export type VisitorInput =
  | { kind: "text"; text: string }
  | { kind: "choice"; choice: ChatChoice }
  | { kind: "faq"; item: FaqItem };

export interface AssistantContext {
  faqs: FaqItem[];
  products: AssistantProduct[];
  search: (query: string) => { item: FaqItem; score: number }[];
}

export interface Response {
  flow: Flow;
  replies: AssistantMessage[];
  /** Set when the visitor confirmed their buying enquiry. */
  submit?: BuyingAnswers;
}

const MENU_CHOICE: ChatChoice = { id: "menu", label: content.backToMenu };

export const menuChoices: ChatChoice[] = [
  { id: "menu:products", label: content.menu.products },
  { id: "menu:buying", label: content.menu.buying },
  { id: "menu:company", label: content.menu.company },
];

export const greetingMessage: AssistantMessage = { from: "assistant", text: content.greeting, choices: menuChoices };

export const INITIAL_FLOW: Flow = { kind: "browse" };

const say = (text: string, extra: Omit<AssistantMessage, "from" | "text"> = {}): AssistantMessage => ({
  from: "assistant",
  text,
  ...extra,
});

/* ---------- Products path ---------- */

type ProductTopic = keyof typeof content.products.topics;
const PRODUCT_TOPICS = Object.keys(content.products.topics) as ProductTopic[];

function productChoices(products: AssistantProduct[], prefix: string): ChatChoice[] {
  return [
    ...products.map((product) => ({ id: `${prefix}${product.slug}`, label: product.name })),
    { id: `${prefix}${OTHER_PRODUCT_ANSWER}`, label: content.products.other },
  ];
}

function topicChoices(product: AssistantProduct): ChatChoice[] {
  return [
    ...PRODUCT_TOPICS.map((topic) => ({ id: `topic:${product.slug}:${topic}`, label: content.products.topics[topic] })),
    MENU_CHOICE,
  ];
}

function specificationTables(product: AssistantProduct): ChatTable[] {
  return (product.specifications ?? []).map((table) => ({
    title: table.subtitle ? `${table.title} — ${table.subtitle}` : table.title,
    rows: table.rows.map((row) => [row.label, row.value]),
  }));
}

function topicAnswer(product: AssistantProduct, topic: ProductTopic): AssistantMessage {
  const { answers } = content.products;
  const choices = topicChoices(product).filter((choice) => !choice.id.endsWith(`:${topic}`));
  const productLink = { label: content.products.viewProduct, href: productHref(product.slug) };

  switch (topic) {
    case "specifications": {
      const tables = specificationTables(product);
      return tables.length > 0
        ? say(answers.specificationsIntro, { tables, action: productLink, choices })
        : say(answers.noSpecifications, { action: productLink, choices });
    }
    case "grades":
      return product.variants?.length
        ? say(answers.gradesIntro, { list: product.variants, choices })
        : say(answers.noGrades, { choices });
    case "packaging":
      return say(product.packaging ?? answers.noPackaging, { choices });
    case "moq":
      return say(answers.moq, { choices });
    case "documentation":
      return product.documentation?.length
        ? say(answers.documentationIntro, { list: product.documentation, footer: answers.documentationNote, choices })
        : say(answers.noDocumentation, { choices });
    case "customisation":
      return say(answers.customisation, { choices });
    case "quote":
      return say(answers.quote, {
        choices: [{ id: `buy:${product.slug}`, label: content.company.startBuying }, MENU_CHOICE],
      });
  }
}

/* ---------- Company path ---------- */

function companyChoices(exclude?: number): ChatChoice[] {
  return [
    ...content.company.questions
      .map((entry, index) => ({ id: `company:${index}`, label: entry.question }))
      .filter((_, index) => index !== exclude),
    { id: "buy", label: content.company.startBuying },
  ];
}

/* ---------- Buying enquiry ---------- */

function stepById(id: BuyingStepId): BuyingStep {
  const step = buyingSteps.find((candidate) => candidate.id === id);
  if (!step) throw new Error(`Unknown buying step: ${id}`);
  return step;
}

function nextStep(answers: BuyingAnswers): BuyingStep | undefined {
  return buyingSteps.find((step) => isStepAsked(step, answers) && answers[step.id] === undefined);
}

function askStep(step: BuyingStep, products: AssistantProduct[]): AssistantMessage {
  const choices: ChatChoice[] =
    step.input === "product"
      ? productChoices(products, "answer:")
      : [...(step.options ?? step.examples ?? []).map((option) => ({ id: `answer:${option}`, label: option }))];
  if (step.optional) choices.push({ id: "skip", label: content.buying.skip });
  return say(step.question, { choices });
}

function displayAnswer(step: BuyingStep, value: string, products: AssistantProduct[]): string {
  if (step.input !== "product") return value;
  if (value === OTHER_PRODUCT_ANSWER) return content.products.other.replace(/^\S+\s/, "");
  return products.find((product) => product.slug === value)?.name ?? value;
}

/** The answers the visitor gave, as label/value rows (the quotation choice is left out). */
export function summaryRows(answers: BuyingAnswers, products: AssistantProduct[]): [string, string][] {
  return buyingSteps.flatMap((step) => {
    const value = answers[step.id];
    if (step.id === "quotation" || !value || !isStepAsked(step, answers)) return [];
    return [[step.label, displayAnswer(step, value, products)] as [string, string]];
  });
}

function summaryMessage(answers: BuyingAnswers, products: AssistantProduct[]): AssistantMessage {
  return say(content.buying.summaryTitle, {
    tables: [{ rows: summaryRows(answers, products) }],
    footer: content.buying.confirmQuestion,
    choices: [
      { id: "summary:submit", label: content.buying.submit },
      { id: "summary:edit", label: content.buying.edit },
    ],
  });
}

function editMessage(answers: BuyingAnswers): AssistantMessage {
  const editable = buyingSteps.filter(
    (step) => step.id !== "quotation" && isStepAsked(step, answers) && answers[step.id] !== undefined,
  );
  return say(content.buying.editQuestion, {
    choices: [
      ...editable.map((step) => ({ id: `edit:${step.id}`, label: step.label })),
      { id: "summary:back", label: content.buying.backToSummary },
    ],
  });
}

function startBuying(answers: BuyingAnswers, products: AssistantProduct[], intro = true): Response {
  const step = nextStep(answers);
  if (!step) return { flow: { kind: "confirm", answers }, replies: [summaryMessage(answers, products)] };
  return {
    flow: { kind: "buying", step: step.id, answers },
    replies: [...(intro ? [say(content.buying.intro)] : []), askStep(step, products)],
  };
}

function answerStep(flow: Extract<Flow, { kind: "buying" }>, rawValue: string, products: AssistantProduct[]): Response {
  const step = stepById(flow.step);
  const value = rawValue.trim();
  const problem = checkAnswer(step, value);
  if (problem) {
    return { flow, replies: [{ ...askStep(step, products), text: content.buying.invalid[problem] }] };
  }

  const answers = { ...flow.answers, [step.id]: value };
  const followUp = step.followUps?.[value] ?? step.followUps?.["*"];
  const replies: AssistantMessage[] = followUp ? [say(followUp)] : [];

  if (step.id === "quotation") {
    const wantsQuote = value === step.options?.[0];
    replies.push(say(wantsQuote ? content.buying.quoteYes : content.buying.quoteNo));
  }

  const next = startBuying(answers, products, false);
  return { flow: next.flow, replies: [...replies, ...next.replies] };
}

/* ---------- FAQ answers for typed questions ---------- */

function faqAnswer(item: FaqItem, context: AssistantContext): AssistantMessage {
  const related = relatedQuestions(context.faqs, item, content.relatedCount);
  return say(item.answer, {
    action: item.action,
    suggestions: related.length > 0 ? { label: content.relatedLabel, items: related } : undefined,
    choices: [MENU_CHOICE],
  });
}

function replyToQuestion(question: string, context: AssistantContext): AssistantMessage {
  const matches = context.search(question);
  const best = matches[0];
  if (best && best.score >= CONFIDENT_MATCH) return faqAnswer(best.item, context);
  if (GREETING_PATTERN.test(question)) return say(content.smallTalk.greeting, { choices: menuChoices });
  if (THANKS_PATTERN.test(question)) return say(content.smallTalk.thanks, { choices: [MENU_CHOICE] });
  if (matches.length > 0) {
    return say(content.didYouMean, {
      action: content.fallbackAction,
      suggestions: { items: matches.slice(0, 3).map((match) => match.item) },
      choices: [MENU_CHOICE],
    });
  }
  return say(content.fallback, { action: content.fallbackAction, choices: [MENU_CHOICE] });
}

/** While confirming, an FAQ answer keeps a way back to the summary. */
function withResume(reply: AssistantMessage, flow: Flow): AssistantMessage {
  if (flow.kind !== "confirm") return reply;
  return { ...reply, choices: [...(reply.choices ?? []), { id: "summary:back", label: content.buying.backToSummary }] };
}

/* ---------- Dispatch ---------- */

function handleChoice(flow: Flow, choice: ChatChoice, context: AssistantContext): Response {
  const { products } = context;
  const [kind = "", ...rest] = choice.id.split(":");
  const arg = rest.join(":");

  if (flow.kind === "buying" && kind === "answer") return answerStep(flow, arg, products);
  if (flow.kind === "buying" && kind === "skip") return answerStep(flow, "", products);

  switch (kind) {
    case "menu": {
      if (!arg) return { flow: INITIAL_FLOW, replies: [say(content.smallTalk.greeting, { choices: menuChoices })] };
      if (arg === "products") {
        return { flow: INITIAL_FLOW, replies: [say(content.products.question, { choices: productChoices(products, "product:") })] };
      }
      if (arg === "buying") return startBuying({}, products);
      return { flow: INITIAL_FLOW, replies: [say(content.company.intro, { choices: companyChoices() })] };
    }
    case "product": {
      if (arg === OTHER_PRODUCT_ANSWER) return { flow: { kind: "product-other" }, replies: [say(content.products.otherQuestion)] };
      const product = products.find((candidate) => candidate.slug === arg);
      if (!product) break;
      return {
        flow: INITIAL_FLOW,
        replies: [say(content.products.about), say(content.products.topicQuestion, { choices: topicChoices(product) })],
      };
    }
    case "topic": {
      const [slug = "", topic = ""] = rest;
      const product = products.find((candidate) => candidate.slug === slug);
      if (!product || !PRODUCT_TOPICS.includes(topic as ProductTopic)) break;
      return { flow: INITIAL_FLOW, replies: [topicAnswer(product, topic as ProductTopic)] };
    }
    case "company": {
      const index = Number(arg);
      const entry = content.company.questions[index];
      if (!entry) break;
      return { flow: INITIAL_FLOW, replies: [say(entry.answer, { choices: [...companyChoices(index), MENU_CHOICE] })] };
    }
    case "buy": {
      const draft = arg ? { product: arg } : flow.kind === "browse" ? (flow.draft ?? {}) : {};
      return startBuying(draft, products);
    }
    case "summary": {
      if (flow.kind !== "confirm") break;
      if (arg === "submit") {
        return { flow: { kind: "submitting", answers: flow.answers }, replies: [], submit: flow.answers };
      }
      if (arg === "edit") return { flow, replies: [editMessage(flow.answers)] };
      return { flow, replies: [summaryMessage(flow.answers, products)] };
    }
    case "edit": {
      if (flow.kind !== "confirm") break;
      const step = stepById(arg as BuyingStepId);
      const answers = { ...flow.answers };
      delete answers[step.id];
      return { flow: { kind: "buying", step: step.id, answers }, replies: [askStep(step, products)] };
    }
  }
  return { flow, replies: [] };
}

export function respond(flow: Flow, input: VisitorInput, context: AssistantContext): Response {
  if (input.kind === "faq") return { flow, replies: [withResume(faqAnswer(input.item, context), flow)] };
  if (input.kind === "choice") return handleChoice(flow, input.choice, context);

  switch (flow.kind) {
    case "buying":
      return answerStep(flow, input.text, context.products);
    case "product-other": {
      const draft: BuyingAnswers = { product: OTHER_PRODUCT_ANSWER, productOther: input.text };
      return {
        flow: { kind: "browse", draft },
        replies: [say(content.products.otherReply, { choices: [{ id: "buy", label: content.company.startBuying }, MENU_CHOICE] })],
      };
    }
    default:
      return { flow, replies: [withResume(replyToQuestion(input.text, context), flow)] };
  }
}

/** Placeholder and keyboard for the composer while a buying question is open. */
export function composerHints(flow: Flow): { placeholder?: string; inputMode?: "email" | "tel" | "url" | "text" } {
  if (flow.kind === "product-other") return { placeholder: content.products.otherQuestion };
  if (flow.kind !== "buying") return {};
  const step = stepById(flow.step);
  const inputMode = step.input === "email" || step.input === "tel" || step.input === "url" ? step.input : "text";
  return { placeholder: step.placeholder, inputMode };
}

/** Aira's reply once the enquiry has been submitted (or couldn't be). */
export function submissionReply(result: { ok: true; reference?: string } | { ok: false; fallbackEmail?: string }): AssistantMessage {
  const { buying } = content;
  if (result.ok) {
    return say(`${buying.success}\n\n${buying.successFollowUp}`, {
      list: buying.successTopics,
      reference: result.reference ? { label: buying.reference, value: result.reference } : undefined,
      choices: [MENU_CHOICE],
    });
  }
  return say(buying.failure, {
    action: result.fallbackEmail ? { label: result.fallbackEmail, href: `mailto:${result.fallbackEmail}` } : content.fallbackAction,
    choices: [{ id: "summary:submit", label: buying.retry }, MENU_CHOICE],
  });
}
