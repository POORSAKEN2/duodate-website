import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroSection from "@/components/HeroSection";

describe("HeroSection Component", () => {
  it("renders big DuoDate heading and subhead", () => {
    render(<HeroSection />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "DuoDate",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /DuoDate gives you and your partner a private space to plan real dates, sync your outfits before stepping out the door, and track your favorite nights together\./i
      )
    ).toBeInTheDocument();
  });

  it("renders store download badges", () => {
    render(<HeroSection />);

    expect(screen.getByRole("link", { name: /Download on the App Store/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get it on Google Play/i })).toBeInTheDocument();
  });

  it("renders the wingbirds mascot illustration", () => {
    render(<HeroSection />);

    const mascotImg = screen.getByAltText(/DuoDate Wingbirds Huff and Chihi waving hello/i);
    expect(mascotImg).toBeInTheDocument();
    expect(mascotImg).toHaveAttribute("src", expect.stringContaining("hello-wingbirds.png"));
  });
});
