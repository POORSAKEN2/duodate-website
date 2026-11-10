import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";

describe("FinalCtaSection Component", () => {
  it("renders section with scroll-mt-20 anchor offset, H2 headline, and subhead", () => {
    const { container } = render(<FinalCtaSection />);

    const section = container.querySelector("#download");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("scroll-mt-20");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Date night starts before you leave the house.",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Download DuoDate, invite your person, and lock in your first date in under two minutes."
      )
    ).toBeInTheDocument();
  });

  it("renders perched mascot illustration with valid attributes", () => {
    render(<FinalCtaSection />);

    const mascotImg = screen.getByAltText(/Huff and Chihi perched together/i);
    expect(mascotImg).toBeInTheDocument();
    expect(mascotImg).toHaveAttribute("src", expect.stringContaining("reunion.png"));
  });

  it("renders 3-step setup strip with verbatim titles and descriptions", () => {
    render(<FinalCtaSection />);

    expect(screen.getByText("1. Download for Two")).toBeInTheDocument();
    expect(
      screen.getByText(
        "One invite link connects both phones instantly. No shared passwords, no awkward calendar invites."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("2. Pick Your First Vibe")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Choose dinner, drinks, casual stroll, or something new. Set the time and lock the dress code."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("3. Step Out in Sync")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Snap your fit, get your cohesion score, and head out the door knowing neither of you is overdressed."
      )
    ).toBeInTheDocument();
  });

  it("renders App Store and Google Play download badges with href and aria labels", () => {
    render(<FinalCtaSection />);

    const appStoreLink = screen.getByRole("link", { name: "Download on the App Store" });
    expect(appStoreLink).toBeInTheDocument();
    expect(appStoreLink).toHaveAttribute("href", "#download");

    const googlePlayLink = screen.getByRole("link", { name: "Get it on Google Play" });
    expect(googlePlayLink).toBeInTheDocument();
    expect(googlePlayLink).toHaveAttribute("href", "#download");

    expect(
      screen.getByText("100% Private • Just the Two of You • No Social Feeds")
    ).toBeInTheDocument();
  });
});

describe("Footer Component", () => {
  it("renders brand logo, tagline, navigation links, and copyright", () => {
    render(<Footer />);

    expect(screen.getByText("DuoDate")).toBeInTheDocument();
    expect(
      screen.getByText("Built exclusively for couples who still date each other.")
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms of Service" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Support" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Instagram" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "TikTok" })).toBeInTheDocument();

    expect(screen.getByText(/© 2026 DuoDate\. All rights reserved\./i)).toBeInTheDocument();
  });
});
