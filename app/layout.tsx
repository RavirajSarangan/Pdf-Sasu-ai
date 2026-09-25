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

export const metadata: Metadata = {
  title: "PDFForge — The Browser-Native PDF Studio & AI Suite",
  description:
    "Visual editing, annotations, digital signatures, client-side OCR, barcodes, watermarking, and document organization — 100% private in your browser.",
  keywords: [
    "pdf editor",
    "edit pdf online",
    "free pdf editor",
    "merge pdf",
    "split pdf",
    "sign pdf",
    "annotate pdf",
    "pdf to image",
    "client-side pdf",
    "private pdf editor",
    "ocr pdf",
  ],
  authors: [{ name: "PDFForge" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
