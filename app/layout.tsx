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
  metadataBase: new URL("https://duodate.app"),
  title: "DuoDate • Built Exclusively for Two",
  description:
    "No more hoodie-vs-gown disasters. DuoDate gives you and your partner a private space to plan dates, check outfit harmony, and capture memories.",
  openGraph: {
    title: "DuoDate — No more hoodie-vs-gown disasters.",
    description:
      "A private app for couples to plan dates, coordinate outfits, and celebrate their favorite nights together.",
    url: "https://duodate.app",
    siteName: "DuoDate",
    type: "website",
    images: [
      {
        url: "/images/hello-wingbirds.png",
        width: 1200,
        height: 630,
        alt: "DuoDate Wingbirds Huff and Chihi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DuoDate — No more hoodie-vs-gown disasters.",
    description:
      "A private app for couples to plan dates, coordinate outfits, and celebrate their favorite nights together.",
    images: ["/images/hello-wingbirds.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
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
      <body className="min-h-full flex flex-col bg-white text-[#1D1D1F]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
