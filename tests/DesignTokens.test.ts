import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Design System & Brand Tokens", () => {
  it("defines the required brand color tokens in globals.css", () => {
    const cssPath = path.resolve(__dirname, "../app/globals.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    expect(cssContent).toContain("#E05A6D"); // primary
    expect(cssContent).toContain("#C94557"); // primaryDark
    expect(cssContent).toContain("#FF8A9B"); // primaryLight
    expect(cssContent).toContain("#FCE7EB"); // primaryContainer
    expect(cssContent).toContain("#FF9EAA"); // secondary
    expect(cssContent).toContain("#FBF9F9"); // background / canvas
    expect(cssContent).toContain("#1E293B"); // text
    expect(cssContent).toContain("#64748B"); // textSecondary
    expect(cssContent).toContain("#E2E8F0"); // border
  });

  it("configures Barlow and Barlow Semi Condensed fonts in layout.tsx", () => {
    const layoutPath = path.resolve(__dirname, "../app/layout.tsx");
    const layoutContent = fs.readFileSync(layoutPath, "utf-8");

    expect(layoutContent).toContain("Barlow");
    expect(layoutContent).toContain("Barlow_Semi_Condensed");
    expect(layoutContent).toContain("--font-barlow");
    expect(layoutContent).toContain("--font-barlow-condensed");
  });

  it("has synced illustration and mascot assets in public/images", () => {
    const publicImagesDir = path.resolve(__dirname, "../public/images");
    expect(fs.existsSync(publicImagesDir)).toBe(true);
    expect(fs.existsSync(path.join(publicImagesDir, "huff-neutral.png"))).toBe(true);
    expect(fs.existsSync(path.join(publicImagesDir, "chichi-neutral.png"))).toBe(true);
  });
});
