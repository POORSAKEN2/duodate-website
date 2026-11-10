import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeaturesSection from "@/components/FeaturesSection";

describe("FeaturesSection Component", () => {
  it("renders section header and 3 core feature cards with scroll-mt-20 offset", () => {
    const { container } = render(<FeaturesSection />);

    const section = container.querySelector("#features");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("scroll-mt-20");

    expect(screen.getByText("CORE FEATURES")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Everything you need to keep date night alive.",
      })
    ).toBeInTheDocument();

    // 3 Cards
    expect(screen.getByRole("heading", { level: 3, name: "The Fit Check" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Dates On The Books" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Memories That Stick" })).toBeInTheDocument();
  });

  it("renders feature tags and highlight pills for each card", () => {
    render(<FeaturesSection />);

    // Tags
    expect(screen.getByText("OUTFIT HARMONY")).toBeInTheDocument();
    expect(screen.getByText("INTENTIONAL SCHEDULING")).toBeInTheDocument();
    expect(screen.getByText("COUPLE MEMORY BOX")).toBeInTheDocument();

    // Pills
    const expectedPills = [
      "Side-by-side outfit preview",
      "Instant cohesion score",
      "Discreet tweak suggestions",
      "Dedicated date cards",
      "Synced reminders for two",
      "Venue & dress code locking",
      "Private couple timeline",
      "Post-date rating prompts",
      "Photo capsule per date",
    ];

    expectedPills.forEach((pill) => {
      expect(screen.getByText(pill)).toBeInTheDocument();
    });
  });
});
