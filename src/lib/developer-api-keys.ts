const API_KEY_PREFIX = "cmsads_live_";
const API_KEY_RANDOM_BYTES = 32;
const API_KEY_HASH_LENGTH = 64;

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function normalizeApiKeyName(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 80) : "";
}

export function generateApiKeySecret(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(API_KEY_RANDOM_BYTES));
  return `${API_KEY_PREFIX}${encodeBase64Url(randomBytes)}`;
}

export async function hashApiKeySecret(secret: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function verifyApiKeySecret(secret: string, storedHash: string): Promise<boolean> {
  if (!/^[a-f0-9]{64}$/.test(storedHash)) return false;
  const candidateHash = await hashApiKeySecret(secret);
  let difference = 0;
  for (let index = 0; index < API_KEY_HASH_LENGTH; index += 1) {
    difference |= candidateHash.charCodeAt(index) ^ storedHash.charCodeAt(index);
  }
  return difference === 0;
}

export function maskApiKeySecret(secret: string): string {
  if (!secret.startsWith(API_KEY_PREFIX) || secret.length < API_KEY_PREFIX.length + 8) {
    return "••••••••";
  }
  return `${secret.slice(0, API_KEY_PREFIX.length + 6)}••••${secret.slice(-4)}`;
}

export function isApiKeyActive(revokedAt: string | null): boolean {
  return revokedAt === null;
}
