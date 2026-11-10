import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

describe("DuoDate Landing Page Integration", () => {
  it("renders all key sections from top to bottom", () => {
    render(<Page />);

    // Navbar
    expect(screen.getByRole("link", { name: "DuoDate" })).toBeInTheDocument();

    // Hero
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "DuoDate",
      })
    ).toBeInTheDocument();

    // Reality Check
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "You shouldn't need three chat apps and a coin toss just to go to dinner.",
      })
    ).toBeInTheDocument();

    // Core Features
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Built around the moments that actually matter|Everything you need to keep date night alive/i,
      })
    ).toBeInTheDocument();

    // Mascots
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Meet your new wingbirds|Meet Huff & Chihi/i,
      })
    ).toBeInTheDocument();

    // Final CTA
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Ready to plan your next real date|Date night starts before you leave the house/i,
      })
    ).toBeInTheDocument();

    // Footer
    expect(
      screen.getByText(/© 2026 DuoDate\. All rights reserved\. Built strictly for two\./i)
    ).toBeInTheDocument();
  });
});
