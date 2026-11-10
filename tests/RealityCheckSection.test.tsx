import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RealityCheckSection from "@/components/RealityCheckSection";

describe("RealityCheckSection Component", () => {
  it("renders exact eyebrow, H2 headline, and narrative text", () => {
    render(<RealityCheckSection />);

    expect(screen.getByText("THE REALITY OF DATE NIGHT")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "You shouldn't need three chat apps and a coin toss just to go to dinner.",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Most date nights unravel the same way: half-baked plans buried in message threads/i
      )
    ).toBeInTheDocument();
  });

  it("renders mascot whisper banter bubble with Huff and Chihi dialog", () => {
    render(<RealityCheckSection />);

    expect(screen.getByText(/Couch and takeout, night four\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Not tonight\. We've got plans\./i)).toBeInTheDocument();
  });
});
