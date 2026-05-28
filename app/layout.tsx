import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = "https://castfolio.app";
const appTitle = "Castfolio";
const appDescription =
  "Build and share stock portfolios for Farcaster with Base-ready, mobile-first portfolio cards.";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: appTitle,
  description: appDescription,
  applicationName: appTitle,
  openGraph: {
    title: appTitle,
    description: appDescription,
    url: appUrl,
    siteName: appTitle,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: appTitle,
    description: appDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#050B14] text-white">{children}</body>
    </html>
  );
}