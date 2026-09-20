import Constants from "expo-constants";

type Extra = {
  siteUrl?: string;
  fallbackUrl?: string;
  privacyUrl?: string;
  fallbackPrivacyUrl?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

export const SITE_URL = (
  process.env.EXPO_PUBLIC_SITE_URL ||
  extra.siteUrl ||
  "https://statuspass.com"
).replace(/\/$/, "");

export const FALLBACK_URL = (
  process.env.EXPO_PUBLIC_FALLBACK_URL ||
  extra.fallbackUrl ||
  "https://statuspass-web.vercel.app"
).replace(/\/$/, "");

export const PRIVACY_URL =
  extra.privacyUrl || `${SITE_URL}/privacy`;

export const FALLBACK_PRIVACY_URL =
  extra.fallbackPrivacyUrl || `${FALLBACK_URL}/privacy`;

export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || extra.supabaseUrl || "";

export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || extra.supabaseAnonKey || "";

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
