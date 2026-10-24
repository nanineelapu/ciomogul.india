import { createClient } from "@supabase/supabase-js";

// Server-side Supabase clients for the cio_india schema.
// - anon: the public key. It can only do what the table's security rules allow
//   (adding a subscriber or a contact message).
// - service: the secret key. It bypasses those rules, so it is used only in
//   server routes and must never reach the browser. It is optional.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const options = { db: { schema: "cio_india" as const }, auth: { persistSession: false } };

export function getAnonClient() {
  return url && anonKey ? createClient(url, anonKey, options) : null;
}

export function getServiceClient() {
  return url && serviceKey ? createClient(url, serviceKey, options) : null;
}
