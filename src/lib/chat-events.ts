/** Lets any part of the site open Aira, the website assistant, optionally with a question to ask. */
const OPEN_CHAT_EVENT = "bgexim:open-chat";

export function openChat(question?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: { question } }));
}

export function onOpenChat(listener: (question?: string) => void): () => void {
  const handler = (event: Event) => listener((event as CustomEvent<{ question?: string }>).detail.question);
  window.addEventListener(OPEN_CHAT_EVENT, handler);
  return () => window.removeEventListener(OPEN_CHAT_EVENT, handler);
}
