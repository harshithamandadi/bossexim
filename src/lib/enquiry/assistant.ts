/**
 * Buying enquiries collected by Aira, the website assistant. Pure functions,
 * shared by the chat panel (to re-ask a bad answer) and the server action (to
 * validate again before anything is saved).
 */
import { buyingSteps, chatbotContent, OTHER_PRODUCT_ANSWER, type BuyingStep, type BuyingStepId, type ContactStepId } from "@/config/chatbot";
import { OTHER_PRODUCT_VALUE, PATTERNS, type Enquiry, type EnquiryDetail } from "./schema";

/** "Sent from" on enquiries Aira saves; "assistant" on ones saved before Oct 2026. */
export const AIRA_SOURCE = "Aira (website chat)";
export const AIRA_SOURCES = [AIRA_SOURCE, "assistant"];

export type BuyingAnswers = Partial<Record<BuyingStepId, string>>;
export type AnswerProblem = "required" | "email" | "tel" | "url";

const MAX_ANSWER_LENGTH = 200;

/** Answers stored in their own columns in the admin; the rest become labelled details. */
const CORE_STEPS = ["company", "website", "country", "name", "email", "phone"] as const satisfies BuyingStepId[];

export function isStepAsked(step: BuyingStep, answers: BuyingAnswers): boolean {
  return !step.askWhen || answers[step.askWhen.step] === step.askWhen.equals;
}

/** Why an answer can't be accepted, or undefined when it's fine. */
export function checkAnswer(step: Pick<BuyingStep, "input" | "optional">, value: string): AnswerProblem | undefined {
  if (!value) return step.optional ? undefined : "required";
  if (step.input === "email" && !PATTERNS.email.test(value)) return "email";
  if (step.input === "tel" && !PATTERNS.tel.test(value)) return "tel";
  if (step.input === "url" && !PATTERNS.url.test(value)) return "url";
  return undefined;
}

function isCoreStep(id: BuyingStepId): id is (typeof CORE_STEPS)[number] {
  return (CORE_STEPS as readonly string[]).includes(id);
}

/** Validates the answers and turns them into a buyer enquiry; undefined when anything is missing or invalid. */
export function toAssistantEnquiry(input: unknown, productSlugs: readonly string[]): Enquiry | undefined {
  if (typeof input !== "object" || input === null) return undefined;
  const raw = input as Record<string, unknown>;
  const answers: BuyingAnswers = {};
  for (const step of buyingSteps) {
    const value = raw[step.id];
    if (typeof value === "string") answers[step.id] = value.trim().slice(0, MAX_ANSWER_LENGTH);
  }

  const core: Partial<Record<(typeof CORE_STEPS)[number], string>> = {};
  const details: EnquiryDetail[] = [];
  let product: string | undefined;

  for (const step of buyingSteps) {
    if (!isStepAsked(step, answers)) continue;
    const value = answers[step.id] ?? "";
    if (checkAnswer(step, value)) return undefined;
    if (!value) continue;

    if (step.id === "product") {
      if (value !== OTHER_PRODUCT_ANSWER && !productSlugs.includes(value)) return undefined;
      product = value === OTHER_PRODUCT_ANSWER ? OTHER_PRODUCT_VALUE : value;
    } else if (isCoreStep(step.id)) {
      core[step.id] = value;
    } else {
      details.push({ label: step.label, value });
    }
  }

  const { name, email, ...optional } = core;
  if (!name || !email || !product) return undefined;
  return { type: "buyer", name, email, product, ...optional, details };
}

export type CallbackAnswers = Partial<Record<ContactStepId, string>>;

const CALLBACK_DETAIL = { label: "Requested", value: "Call back from the website assistant" };

/** Validates a call-back request and turns it into a general enquiry; undefined when invalid. */
export function toCallbackEnquiry(input: unknown): Enquiry | undefined {
  if (typeof input !== "object" || input === null) return undefined;
  const raw = input as Record<string, unknown>;
  const answers: CallbackAnswers = {};
  for (const step of chatbotContent.callback.steps) {
    const value = typeof raw[step.id] === "string" ? (raw[step.id] as string).trim().slice(0, MAX_ANSWER_LENGTH) : "";
    if (checkAnswer(step, value)) return undefined;
    if (value) answers[step.id] = value;
  }
  const { name, email, phone, message } = answers;
  if (!name || !email) return undefined;
  return { type: "general", name, email, phone, message, details: [CALLBACK_DETAIL] };
}
