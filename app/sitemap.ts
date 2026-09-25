import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pdfforge.ai";
  const now = new Date();

  const routes = [
    { url: "", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/editor", priority: 0.95, changeFrequency: "daily" as const },
    { url: "/pdf-editor", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/annotate-pdf", priority: 0.85, changeFrequency: "weekly" as const },
    { url: "/sign-pdf", priority: 0.85, changeFrequency: "weekly" as const },
    { url: "/merge-pdf", priority: 0.85, changeFrequency: "weekly" as const },
    { url: "/split-pdf", priority: 0.85, changeFrequency: "weekly" as const },
    { url: "/compress-pdf", priority: 0.85, changeFrequency: "weekly" as const },
    { url: "/ocr-pdf", priority: 0.85, changeFrequency: "weekly" as const },
    { url: "/watermark-pdf", priority: 0.85, changeFrequency: "weekly" as const },
    { url: "/barcode-generator", priority: 0.85, changeFrequency: "weekly" as const },
    { url: "/pdf-to-image", priority: 0.85, changeFrequency: "weekly" as const },
    { url: "/images-to-pdf", priority: 0.85, changeFrequency: "weekly" as const },
    { url: "/page-numbers", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/tools", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/tools/ocr", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/tools/barcode", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/tools/watermark", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/tools/page-numbers", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/tools/merge", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/tools/split", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/tools/compress", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/tools/pdf-to-image", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/tools/images-to-pdf", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/dashboard", priority: 0.7, changeFrequency: "daily" as const },
    { url: "/security", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/privacy", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/terms", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.url}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
