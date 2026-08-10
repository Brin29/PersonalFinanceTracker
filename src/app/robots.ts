import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: [
          "/dashboard",
          "/movements",
          "/categories",
          "/settings",
          "/oauth-success",
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
