const listFormatter = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" });

/** ["a", "b", "c"] → "a, b and c" */
export function formatList(items: readonly string[]): string {
  return listFormatter.format(items);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}

/** "Jane Mary Doe" → "JD" */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ""}${parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : ""}`.toUpperCase();
}

/** 3 → "03" */
export function formatStepNumber(value: number): string {
  return String(value).padStart(2, "0");
}
