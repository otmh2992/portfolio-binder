import { hmac } from "@noble/hashes/hmac";
import { sha1 } from "@noble/hashes/sha1";
import { utf8ToBytes, bytesToHex } from "@noble/hashes/utils";

/**
 * Stable JSON stringify to guarantee identical signatures
 * across environments and key ordering.
 */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const obj = value as Record<string, unknown>;

  return `{${Object.keys(obj)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(obj[key])}`)
    .join(",")}}`;
}

/**
 * Generate HMAC-SHA1 signature compatible with
 * Cloudflare Workers and Node.js.
 */
export function generateSignature(
  params: Record<string, unknown>,
  secret: string
): string {
  const payload = stableStringify(params);

  const signature = hmac(
    sha1,
    utf8ToBytes(secret),
    utf8ToBytes(payload)
  );

  return bytesToHex(signature);
}

/**
 * Fetch Transloadit assembly status
 */
export async function getAssemblyStatus(assemblyId: string) {
  const authKey = import.meta.env.TRANSLOADIT_KEY;

  if (!authKey) {
    throw new Error("Missing TRANSLOADIT_KEY");
  }

  const response = await fetch(
    `https://api2.transloadit.com/assemblies/${assemblyId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch assembly status: ${response.status}`
    );
  }

  return response.json();
}