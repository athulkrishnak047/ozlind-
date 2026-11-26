import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://ozlind-git-main-ozlind-enterprise.vercel.app/sitemap.xml"
  };
}
