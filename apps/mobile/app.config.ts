import type { ExpoConfig } from "expo/config";

const siteUrl = (
  process.env.EXPO_PUBLIC_SITE_URL || "https://statuspass.com"
).replace(/\/$/, "");

const fallbackUrl = (
  process.env.EXPO_PUBLIC_FALLBACK_URL ||
  "https://statuspass-web.vercel.app"
).replace(/\/$/, "");

const config: ExpoConfig = {
  name: "StatusPass",
  slug: "statuspass",
  scheme: "statuspass",
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#1E3A5F",
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.sunkara.statuspass",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: false,
      },
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType:
            "NSPrivacyAccessedAPICategoryUserDefaults",
          NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
        },
      ],
    },
  },
  android: {
    package: "com.sunkara.statuspass",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#1E3A5F",
    },
    permissions: ["INTERNET"],
    blockedPermissions: [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
    ],
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
  plugins: ["expo-router"],
  extra: {
    siteUrl,
    fallbackUrl,
    privacyUrl: `${siteUrl}/privacy`,
    fallbackPrivacyUrl: `${fallbackUrl}/privacy`,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
    eas: {
      projectId: "replace-after-eas-init",
    },
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  ...(process.env.EAS_OWNER ? { owner: process.env.EAS_OWNER } : {}),
};

export default config;
