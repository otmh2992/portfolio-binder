import { hmac } from "@noble/hashes/hmac";
import { sha1 } from "@noble/hashes/sha1";
import { utf8ToBytes } from "@noble/hashes/utils";

function toHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateSignature(params: any, secret: string): string {
  const jsonParams = JSON.stringify(params);

  const keyBytes = utf8ToBytes(secret);
  const msgBytes = utf8ToBytes(jsonParams);

  const sig = hmac(sha1, keyBytes, msgBytes);

  return toHex(sig);
}