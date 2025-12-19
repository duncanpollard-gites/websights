import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TradeVista - Professional Websites for Tradespeople",
  description: "Build a stunning website for your trade business in minutes. AI-powered website builder for plumbers, electricians, builders and more.",
  keywords: ["website builder", "tradespeople", "plumber website", "electrician website", "builder website"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
