import type { MetadataRoute } from "next";

const siteUrl = "https://ozlind-git-main-ozlind-enterprise.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/workspace`, changeFrequency: "monthly", priority: 0.8 }
  ];
}
