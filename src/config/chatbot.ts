/**
 * Copy for the FAQ assistant. Its answers come from faq.ts — add or edit
 * questions there and the assistant learns them automatically.
 */
import { contactHref } from "./routes";

export const chatbotContent = {
  dialogLabel: "FAQ assistant",
  launcher: {
    label: "Ask a question",
    open: "Open the FAQ assistant",
    close: "Close the FAQ assistant",
  },
  title: "BOSS EXIM Assistant",
  subtitle: "Instant answers from our FAQs",
  greeting:
    "Hello! I can answer questions about our products, markets, trade process and how to work with us. Pick a question or type your own.",
  smallTalk: {
    greeting: "Hello! What would you like to know?",
    thanks: "You're welcome. Is there anything else I can help with?",
  },
  suggestionsLabel: "Popular questions",
  relatedLabel: "Related questions",
  didYouMean: "I'm not certain I have that exactly. Did you mean one of these?",
  fallback: "I couldn't find that in our FAQs. Our trade desk can help you directly.",
  fallbackAction: { label: "Send an enquiry", href: contactHref() },
  composer: {
    label: "Your question",
    placeholder: "Type your question…",
    send: "Send question",
  },
  restart: "Start over",
  close: "Close",
  typing: "Assistant is typing",
  disclaimer: "Automated answers from our FAQs.",
  humanLink: { label: "Talk to our team", href: contactHref() },
  dragHandle: "Drag down to close",
  /** How many questions the greeting suggests, and how many follow an answer. */
  suggestionCount: 4,
  relatedCount: 3,
};
