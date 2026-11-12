import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";

describe("FinalCtaSection Component", () => {
  it("renders section with scroll-mt-20 anchor offset, H2 headline, and subhead", () => {
    const { container } = render(<FinalCtaSection publicRelease={false} />);

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
    render(<FinalCtaSection publicRelease={false} />);

    const mascotImg = screen.getByAltText(/Huff and Chihi perched together/i);
    expect(mascotImg).toBeInTheDocument();
    expect(mascotImg).toHaveAttribute("src", expect.stringContaining("reunion.png"));
  });

  it("renders the quiet steps line", () => {
    render(<FinalCtaSection publicRelease={false} />);

    expect(screen.getByText(/Download for two/)).toBeInTheDocument();
    expect(screen.getByText(/Pick your vibe/)).toBeInTheDocument();
    expect(screen.getByText(/Step out in/)).toBeInTheDocument();
  });

  it("renders App Store and Google Play store links when publicRelease is true", () => {
    render(<FinalCtaSection publicRelease={true} />);

    const appStoreLink = screen.getByRole("link", { name: "Download on the App Store" });
    expect(appStoreLink).toBeInTheDocument();
    expect(appStoreLink).toHaveAttribute("href", expect.stringContaining("apps.apple.com"));

    const googlePlayLink = screen.getByRole("link", { name: "Get it on Google Play" });
    expect(googlePlayLink).toBeInTheDocument();
    expect(googlePlayLink).toHaveAttribute("href", expect.stringContaining("play.google.com"));

    expect(screen.getByText(/100% Private/)).toBeInTheDocument();
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
