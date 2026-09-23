/** Reads a required environment variable, failing loudly instead of running half-configured. */
export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name} — see .env.example.`);
  return value;
}
