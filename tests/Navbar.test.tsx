import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";

describe("Navbar Component", () => {
  it("renders brand logo and Download App call to action", () => {
    render(<Navbar />);

    const brandLogo = screen.getByText("DuoDate");
    expect(brandLogo).toBeInTheDocument();
    expect(brandLogo).toHaveAttribute("href", "/");

    const ctaButton = screen.getByRole("link", { name: /Download App/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute("href", "#download");
  });

  it("applies glassmorphism sticky navigation classes", () => {
    const { container } = render(<Navbar />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("sticky");
    expect(header).toHaveClass("top-0");
  });
});
