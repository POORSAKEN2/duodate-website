import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MascotSection from "@/components/MascotSection";

describe("MascotSection Component", () => {
  it("renders section with scroll-mt-20 anchor offset, eyebrow, and main headline", () => {
    const { container } = render(<MascotSection />);

    const section = container.querySelector("#mascots");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("scroll-mt-20");

    expect(screen.getByText("THE COMPANIONS")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Meet Huff & Chihi",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your date night co-pilots. Huff brings the dry reality check; Chihi brings the unstoppable enthusiasm. They keep you honest, keep you moving, and make sure nobody cancels on the couch."
      )
    ).toBeInTheDocument();
  });

  it("renders Huff and Chihi companion cards with roles, quotes, descriptions, and images", () => {
    render(<MascotSection />);

    // Huff profile
    expect(screen.getByRole("heading", { level: 3, name: "Huff" })).toBeInTheDocument();
    expect(screen.getByText("THE REALIST")).toBeInTheDocument();
    expect(
      screen.getByText(/Are we really pretending you're ready when you haven't picked shoes\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Deadpan, pragmatic, and allergic to half-baked plans. Huff speaks for the part of you that wants reservations made, timing respected, and outfits coordinated."
      )
    ).toBeInTheDocument();
    const huffImg = screen.getByAltText(/Huff/i);
    expect(huffImg).toBeInTheDocument();
    expect(huffImg).toHaveAttribute("src", expect.stringContaining("huff-neutral.png"));

    // Chihi profile
    expect(screen.getByRole("heading", { level: 3, name: "Chihi" })).toBeInTheDocument();
    expect(screen.getByText("THE OPTIMIST")).toBeInTheDocument();
    expect(
      screen.getByText(/I booked the table, picked the playlist, and ironed the shirt\. Let's go!/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "High energy, romantic, and dedicated to momentum. Chihi makes sure date night actually feels like an adventure, celebrating every locked-in date and shared memory."
      )
    ).toBeInTheDocument();
    const chihiImg = screen.getByAltText(/Chihi/i);
    expect(chihiImg).toBeInTheDocument();
    expect(chihiImg).toHaveAttribute("src", expect.stringContaining("chichi-neutral.png"));
  });

  it("renders Date Night Debrief banter callout with Huff and Chihi dialog", () => {
    render(<MascotSection />);

    expect(screen.getByText("DATE NIGHT DEBRIEF")).toBeInTheDocument();
    expect(
      screen.getByText(/The restaurant was 12 minutes late on our table\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/And the tiramisu was incredible\. 10\/10 night\./i)
    ).toBeInTheDocument();
  });
});
