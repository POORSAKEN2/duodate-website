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

import { metadata } from "../app/layout";

describe("Technical SEO & Metadata", () => {
  it("defines exact title and description according to spec", () => {
    expect(metadata.title).toBe("DuoDate — The Private Date Night App for Two");
    expect(metadata.description).toBe(
      "Plan real dates, match your outfits before stepping out, and keep track of your favorite nights together. DuoDate is the private couple's app built strictly for two."
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
});
