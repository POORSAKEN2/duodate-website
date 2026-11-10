import { vi, describe, it, expect } from "vitest";

vi.hoisted(() => {
  if (typeof window !== "undefined" && !window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
});

vi.mock("next/font/google", () => ({
  Barlow: () => ({ variable: "--font-barlow" }),
  Barlow_Semi_Condensed: () => ({ variable: "--font-barlow-condensed" }),
}));

import { metadata, viewport } from "../app/layout";

describe("Technical SEO & Metadata", () => {
  it("defines exact title and description according to spec", () => {
    expect(metadata.title).toBe("DuoDate • Built Exclusively for Two");
    expect(metadata.description).toBe(
      "No more hoodie-vs-gown disasters. DuoDate gives you and your partner a private space to plan dates, check outfit harmony, and capture memories."
    );
  });

  it("defines Open Graph title and description according to spec", () => {
    expect(metadata.openGraph?.title).toBe(
      "DuoDate — No more hoodie-vs-gown disasters."
    );
    expect(metadata.openGraph?.description).toBe(
      "A private app for couples to plan dates, coordinate outfits, and celebrate their favorite nights together."
    );
  });

  it("defines Open Graph and Twitter images according to spec", () => {
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/images/hello-wingbirds.png",
        width: 1200,
        height: 630,
        alt: "DuoDate Wingbirds Huff and Chihi",
      },
    ]);
    expect(metadata.twitter?.images).toEqual(["/images/hello-wingbirds.png"]);
  });

  it("defines viewport themeColor matching background #FBF9F9", () => {
    expect(viewport.themeColor).toBe("#FBF9F9");
  });
});
