import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  // Example: test KV binding exists
  const kv = context.locals.runtime?.env?.SESSION;

  console.log("KV exists:", !!kv);

  return next();
});