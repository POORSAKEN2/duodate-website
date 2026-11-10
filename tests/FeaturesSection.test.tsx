import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeaturesSection from "@/components/FeaturesSection";

describe("FeaturesSection Component", () => {
  it("renders section header and 3 core feature cards", () => {
    render(<FeaturesSection />);

    expect(screen.getByText("HOW DUODATE WORKS")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Built around the moments that actually matter.",
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
    expect(screen.getByText("SIGNATURE FEATURE")).toBeInTheDocument();
    expect(screen.getByText("SHARED CALENDAR")).toBeInTheDocument();
    expect(screen.getByText("PRIVATE TIMELINE")).toBeInTheDocument();

    // Pills
    expect(screen.getByText("Side-by-side Date Ticket")).toBeInTheDocument();
    expect(screen.getByText("Real-time synchronization")).toBeInTheDocument();
    expect(screen.getByText("Dedicated shared timeline")).toBeInTheDocument();
  });
});
