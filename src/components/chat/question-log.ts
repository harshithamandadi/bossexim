/**
 * Reports a question asked in Aira, and whether an FAQ answered it, to the admin
 * (Insights → Aira questions). Fire-and-forget: never delays or breaks the chat.
 */
const ENDPOINT = "/api/assistant-questions/log";

export type QuestionResult = "answered" | "suggested" | "unanswered";

export function logQuestion(question: string, result: QuestionResult, answer?: string) {
  try {
    if (navigator.webdriver) return;
    const body = JSON.stringify({ question, result, answer, page: location.pathname });
    if (!navigator.sendBeacon?.(ENDPOINT, body)) {
      void fetch(ENDPOINT, { method: "POST", body, keepalive: true }).catch(() => {});
    }
  } catch {
    // Logging is optional.
  }
}
