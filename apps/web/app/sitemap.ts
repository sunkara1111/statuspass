import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths = ["", "/signup", "/login", "/terms", "/privacy"];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-09-20"),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
