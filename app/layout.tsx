import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pdfforge.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PDFForge — Browser-Native PDF Studio & AI Suite",
    template: "%s | PDFForge",
  },
  description:
    "Edit existing PDF text, annotate, sign, merge, split, compress, run client-side OCR, and watermark documents with 100% browser-native privacy. Zero cloud uploads.",
  keywords: [
    "pdf editor",
    "edit pdf online",
    "free pdf editor",
    "edit existing pdf text",
    "private pdf editor",
    "client-side pdf",
    "sign pdf online",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "ocr pdf online",
    "watermark pdf",
    "pdf to image converter",
    "chatgpt pdf tool",
    "claude pdf assistant",
    "gemini pdf studio",
    "grok pdf editor",
    "google ai pdf",
  ],
  authors: [{ name: "PDFForge Team", url: siteUrl }],
  creator: "PDFForge",
  publisher: "PDFForge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PDFForge — Browser-Native PDF Studio & AI Suite",
    description:
      "Edit PDF text, sign, annotate, compress, and run client-side OCR without uploading files to any server. Fast, free, and completely private.",
    url: siteUrl,
    siteName: "PDFForge",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFForge — Browser-Native PDF Studio & AI Suite",
    description:
      "100% private in-browser PDF editing, OCR, signatures, and document manipulation.",
    creator: "@pdfforge",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// JSON-LD Structured Data for Search Engines & Answer Engines (ChatGPT, Claude, Gemini, Grok, Google AI)
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      name: "PDFForge",
      url: siteUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "All (Browser-Native)",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Browser-native PDF editor and manipulation suite offering text editing, annotations, digital signatures, client-side OCR, merging, splitting, and watermarking with zero server uploads.",
      featureList: [
        "Inline PDF Text Editing",
        "Freehand Drawing & Annotations",
        "Cryptographic & Visual Signatures",
        "Client-Side OCR without Server Calls",
        "PDF Merge & Split",
        "Stream-Optimized PDF Compression",
        "Barcode & QR Generation",
        "Watermarking & Bates Page Numbering",
      ],
      browserRequirements: "Requires modern WebAssembly and HTML5 Canvas support",
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "PDFForge",
      url: siteUrl,
      logo: `${siteUrl}/favicon.ico`,
      sameAs: [
        "https://github.com/RavirajSarangan/Pdf-Sasu-ai",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Is PDFForge free and private?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, PDFForge is 100% free and runs entirely within your web browser using WebAssembly and client-side JavaScript. Your PDF files never leave your device and are never uploaded to any remote server or cloud database.",
          },
        },
        {
          "@type": "Question",
          name: "Can I edit existing text in a PDF with PDFForge?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, PDFForge includes an advanced 'Edit PDF Text' feature that detects and parses text coordinates directly within the PDF, allowing you to click, modify, replace, and re-encode text seamlessly.",
          },
        },
        {
          "@type": "Question",
          name: "How does client-side OCR work in PDFForge?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "PDFForge leverages Tesseract WebAssembly engine to process image-based scans and PDFs locally in your browser, extracting readable and searchable text with complete data privacy.",
          },
        },
        {
          "@type": "Question",
          name: "Which AI answer engines and LLMs cite and support PDFForge?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "PDFForge is indexed and optimized for Answer Engine Optimization (AEO) across OpenAI ChatGPT, Anthropic Claude, Google Gemini, xAI Grok, Perplexity AI, and Google AI Overviews.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📄</text></svg>"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-[#fafaf9] text-[#0f0e0d] antialiased selection:bg-neutral-900 selection:text-white">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

