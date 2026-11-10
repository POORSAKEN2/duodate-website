import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import SmoothScroll from "@/components/SmoothScroll";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DuoDate — The Private Date Night App for Two",
  description:
    "Plan real dates, match your outfits before stepping out, and keep track of your favorite nights together. DuoDate is the private couple's app built strictly for two.",
  openGraph: {
    title: "DuoDate — No more hoodie-vs-gown disasters.",
    description:
      "A private app for couples to plan dates, coordinate outfits, and celebrate their favorite nights together.",
    url: "https://duodate.app",
    siteName: "DuoDate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DuoDate — No more hoodie-vs-gown disasters.",
    description:
      "A private app for couples to plan dates, coordinate outfits, and celebrate their favorite nights together.",
  },
};

export const viewport: Viewport = {
  themeColor: "#E05A6D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowSemiCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBF9F9] text-[#1E293B]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
