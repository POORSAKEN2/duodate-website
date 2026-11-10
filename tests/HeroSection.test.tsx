import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroSection from "@/components/HeroSection";

describe("HeroSection Component", () => {
  it("renders exact eyebrow, H1 headline, and subhead from spec", () => {
    render(<HeroSection />);

    expect(screen.getByText("BUILT EXCLUSIVELY FOR TWO")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "No more hoodie-vs-gown disasters.",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /DuoDate gives you and your partner a private space to plan real dates, sync your outfits before stepping out the door, and track your favorite nights together\./i
      )
    ).toBeInTheDocument();
  });

  it("renders store download badges and trust tag", () => {
    render(<HeroSection />);

    expect(screen.getByRole("link", { name: /Download on the App Store/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get it on Google Play/i })).toBeInTheDocument();
    expect(
      screen.getByText("Free to use • No ads • Private by design")
    ).toBeInTheDocument();
  });

  it("renders Date Ticket mockup with side-by-side outfits and cohesion check badge", () => {
    render(<HeroSection />);

    expect(screen.getByText("COHESION CHECK: MATCHED ✨")).toBeInTheDocument();
    expect(screen.getByText("Cocktail Dress")).toBeInTheDocument();
    expect(screen.getByText("Blazer & Oxford")).toBeInTheDocument();
  });
});
