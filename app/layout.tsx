import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrivMeta | Free Online Metadata Remover for Images, PDFs & DOCX",
  description:
    "Clean metadata from images, PDFs, and DOCX files – all inside your browser. 100% private, no uploads. Open source & works offline.",
  keywords: [
    "metadata remover",
    "remove metadata",
    "pdf metadata cleaner",
    "image metadata tool",
    "privacy tool",
    "offline metadata removal",
  ],
  authors: [{ name: "PrivMeta", url: "https://privmeta.app" }],
  openGraph: {
    title: "PrivMeta - Free Private Metadata Remover",
    description:
      "Remove metadata from your files securely in-browser. No server involved. Open source & private.",
    url: "https://privmeta.app",
    siteName: "PrivMeta",
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://privmeta.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "PrivMeta",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "All",
              description:
                "PrivMeta is a online tool to remove metadata from files like images, PDFs, and DOCX documents—all in your browser.",
              offers: {
                "@type": "Offer",
                price: "0.00",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </Head>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen flex flex-col"
      >
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col flex-1">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster richColors />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
