# DuoDate One-Pager Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship a high-converting, mobile-responsive marketing one-pager website for DuoDate (`duodate.app`) adhering to brand typography, color tokens, companion mascots (Huff & Chihi), and zero-AI-slop editorial guidelines.

**Architecture:** Next.js 16 (App Router) with React 19, Tailwind CSS v4 design tokens, and optimized Google Fonts (`Barlow` and `Barlow Semi Condensed`). Smooth scrolling with Lenis and scroll-triggered micro-interactions with GSAP. Componentized layout with dedicated modules for Navbar, Hero with Date Ticket preview, Reality Check hook, 3-Card Core Features, Huff & Chihi companions, and Final CTA with 3-step setup and footer.

**Tech Stack:** Next.js 16.2.4 (App Router & Turbopack), React 19.2.4, TypeScript 5, Tailwind CSS v4, Lenis 1.3, GSAP 3.15, Vitest 5.1, React Testing Library.

**Spec:** `c:\Users\chiyo\Documents\Github Projects\DuoDate\docs\superpowers\specs\2026-11-10-one-pager-website-spec.md`

## Global Constraints

- **Banned Words & Clichés:** Never use corporate buzzwords or AI filler: *"seamlessly orchestrate"*, *"elevate your dating journey"*, *"revolutionary synergy"*, *"intimate tapestry"*, *"in today’s fast-paced world"*, *"delve"*, or *"testament"*.
- **Editorial Tone:** Tease situations (couch rut, dress code mismatches, waiting on someone to get dressed), never bodies, looks, finances, or individual partners. Huff provides deadpan reality checks; Chihi provides enthusiastic momentum. Chihi always has the last word.
- **Typography:** Headings & Display in `Barlow Semi Condensed` (weights 600, 700); Body & UI in `Barlow` (weights 400, 500, 600).
- **Brand Colors:**
  - `primary`: `#E05A6D` (Brand Coral)
  - `primaryDark`: `#C94557` (Deep Coral)
  - `primaryLight`: `#FF8A9B` (Light Coral)
  - `primaryContainer`: `#FCE7EB` (Soft Coral Tint)
  - `secondary`: `#FF9EAA` (Blush Pink)
  - `background`: `#FBF9F9` (Page Canvas)
  - `surface`: `#FFFFFF` (Cards, elevated sheets)
  - `surfaceVariant`: `#F3EFEF` (Secondary cards, subtle borders)
  - `text`: `#1E293B` (Slate Black)
  - `textSecondary`: `#64748B` (Muted Slate)
  - `border`: `#E2E8F0` (Subtle hairline card borders)
- **Responsive Layout:** Mobile-first, fully responsive down to 320px width and optimized for high-DPI displays.

## Review Focus

1. **Asset Integrity & Image Paths:** (Task 1) Synced mascot and scenic assets must exist in `public/images/` and all Next.js `<Image />` tags must define descriptive alt text and proper dimensions/fill modes to prevent 404s or broken image layout breaks.
2. **Font Fallback & Cumulative Layout Shift (CLS):** (Task 1) Font declarations in `layout.tsx` must configure `display: "swap"` with explicit variable names (`--font-barlow`, `--font-barlow-condensed`) and CSS fallback font stacks to eliminate layout shifting during hydration.
3. **Viewport Constriction (< 360px):** (Task 3) On small mobile devices (down to 320px width), the Date Ticket preview dual card layout and Cohesion badge must flex and wrap cleanly without causing horizontal window overflow.
4. **Reduced Motion Accessibility (`prefers-reduced-motion`):** (Task 2 & SmoothScroll) Smooth scrolling and GSAP animations must defer to the system reduced motion setting without trapping page scroll or disabling anchor navigation.
5. **Sticky Navbar Anchor Target Offset:** (Task 2 & Task 8) In-page jump links (`#features`, `#mascots`, `#download`) must have appropriate scroll margin (`scroll-mt-20` / `scroll-mt-24`) so headings aren't hidden behind the sticky navbar upon navigation.

---

### Task 1: Design System Setup, Font Optimization & Asset Sync

**Files:**
- Create: `vitest.config.mts`
- Create: `tests/setup.ts`
- Create: `tests/DesignTokens.test.ts`
- Modify: `package.json:5-10`
- Modify: `app/globals.css:1-26`
- Modify: `app/layout.tsx:1-37`
- Create: `public/images/illustrations/` (synced brand assets)

**Interfaces:**
- Consumes: Google Fonts (`Barlow`, `Barlow_Semi_Condensed` via `next/font/google`), Asset PNGs from DuoDate project.
- Produces: CSS custom variables (`--font-heading`, `--font-body`, `--color-primary`, `--color-primary-dark`, `--color-primary-light`, `--color-primary-container`, `--color-secondary`, `--color-canvas`, `--color-surface`, `--color-surface-variant`, `--color-text-main`, `--color-text-secondary`, `--color-border-subtle`).

- [ ] **Step 1: Write the failing test for design tokens and font configuration**

Create `tests/setup.ts`:
```typescript
import "@testing-library/jest-dom";
```

Create `vitest.config.mts`:
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

Create `tests/DesignTokens.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/DesignTokens.test.ts`
Expected: FAIL with missing assets and unconfigured layout/css tokens.

- [ ] **Step 3: Implement minimal configuration, tokens, font setup, and asset sync**

Add test script to `package.json`:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run"
}
```

Copy required mascot & illustration assets from `c:\Users\chiyo\Documents\Github Projects\DuoDate\src\assets\` into `public/images/`:
- `c:\Users\chiyo\Documents\Github Projects\DuoDate\src\assets\illustrations\1x\huff_neutralAsset-2.png` -> `public/images/huff-neutral.png`
- `c:\Users\chiyo\Documents\Github Projects\DuoDate\src\assets\illustrations\1x\chichi_neutralAsset-1.png` -> `public/images/chichi-neutral.png`
- `c:\Users\chiyo\Documents\Github Projects\DuoDate\src\assets\illustrations\1x\Hello_OnboardingScale1Asset-3.png` -> `public/images/hello-wingbirds.png`
- `c:\Users\chiyo\Documents\Github Projects\DuoDate\src\assets\illustrations\1x\Reunion_OnboardinScale1Asset-6.png` -> `public/images/reunion.png`
- `c:\Users\chiyo\Documents\Github Projects\DuoDate\src\assets\illustrations\1x\BeakKiss_OnboardinScale1Asset-4.png` -> `public/images/beak-kiss.png`
- `c:\Users\chiyo\Documents\Github Projects\DuoDate\src\assets\illustrations\1x\Sear_OnboardinScale1Asset-5.png` -> `public/images/bench-seat.png`
- `c:\Users\chiyo\Documents\Github Projects\DuoDate\src\assets\scenery_1.jpg` -> `public/images/date-sample-1.jpg`
- `c:\Users\chiyo\Documents\Github Projects\DuoDate\src\assets\scenery_2.jpg` -> `public/images/date-sample-2.jpg`

Update `app/globals.css`:
```css
@import "tailwindcss";

:root {
  --font-heading: var(--font-barlow-condensed), 'Barlow Semi Condensed', 'Trebuchet MS', sans-serif;
  --font-body: var(--font-barlow), 'Barlow', system-ui, -apple-system, sans-serif;

  --color-primary: #E05A6D;
  --color-primary-dark: #C94557;
  --color-primary-light: #FF8A9B;
  --color-primary-container: #FCE7EB;
  --color-secondary: #FF9EAA;
  --color-background: #FBF9F9;
  --color-surface: #FFFFFF;
  --color-surface-variant: #F3EFEF;
  --color-text-main: #1E293B;
  --color-text-secondary: #64748B;
  --color-border-subtle: #E2E8F0;
}

@theme {
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);

  --color-primary: var(--color-primary);
  --color-primary-dark: var(--color-primary-dark);
  --color-primary-light: var(--color-primary-light);
  --color-primary-container: var(--color-primary-container);
  --color-secondary: var(--color-secondary);
  --color-canvas: var(--color-background);
  --color-surface: var(--color-surface);
  --color-surface-variant: var(--color-surface-variant);
  --color-text-main: var(--color-text-main);
  --color-text-secondary: var(--color-text-secondary);
  --color-border-subtle: var(--color-border-subtle);
}

body {
  background-color: var(--color-background);
  color: var(--color-text-main);
  font-family: var(--font-body);
}

h1, h2, h3, h4, .font-heading {
  font-family: var(--font-heading);
}
```

Update `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Barlow, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import SmoothScroll from "@/components/SmoothScroll";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DuoDate — The Private Date Night App for Two",
  description:
    "Plan real dates, match your outfits before stepping out, and keep track of your favorite nights together. DuoDate is the private couple's app built strictly for two.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowSemiCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBF9F9] text-[#1E293B]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/DesignTokens.test.ts`
Expected: PASS (all 3 assertions pass).

- [ ] **Step 5: Commit**

```bash
git add vitest.config.mts tests/setup.ts tests/DesignTokens.test.ts package.json app/globals.css app/layout.tsx public/images/
git commit -m "feat: setup design tokens, Barlow fonts, test harness, and synced brand assets"
```

---

### Task 2: Sticky Navigation Bar Component (`Navbar.tsx`)

**Files:**
- Create: `components/Navbar.tsx`
- Test: `tests/Navbar.test.tsx`

**Interfaces:**
- Consumes: DuoDate brand styling tokens (`#E05A6D`, Barlow Semi Condensed logo).
- Produces: `<Navbar />` React component.

- [ ] **Step 1: Write the failing test for Navbar**

Create `tests/Navbar.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/Navbar.test.tsx`
Expected: FAIL with "Cannot find module '@/components/Navbar'".

- [ ] **Step 3: Implement minimal Navbar component**

Create `components/Navbar.tsx`:
```tsx
import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0]/80 bg-[#FBF9F9]/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 md:py-4">
        <Link
          href="/"
          className="group flex items-center gap-2 focus:outline-none"
        >
          <span className="font-heading text-2xl font-bold tracking-tight text-[#1E293B] transition-colors group-hover:text-[#E05A6D]">
            DuoDate
          </span>
          <span className="inline-block h-2 w-2 rounded-full bg-[#E05A6D]" />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="#features"
            className="hidden text-sm font-medium text-[#64748B] transition-colors hover:text-[#1E293B] sm:inline-block"
          >
            Features
          </Link>
          <Link
            href="#mascots"
            className="hidden text-sm font-medium text-[#64748B] transition-colors hover:text-[#1E293B] sm:inline-block"
          >
            Huff & Chihi
          </Link>
          <a
            href="#download"
            className="rounded-full bg-[#E05A6D] px-4 py-2 font-heading text-sm font-semibold tracking-wide text-white shadow-sm transition-all hover:bg-[#C94557] hover:shadow focus:outline-none focus:ring-2 focus:ring-[#FF8A9B] focus:ring-offset-2"
          >
            Download App
          </a>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/Navbar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/Navbar.tsx tests/Navbar.test.tsx
git commit -m "feat: add sticky Navbar component with brand logo and CTA"
```

---

### Task 3: Hero Section & Date Ticket Preview Component (`HeroSection.tsx` & `DateTicketPreview.tsx`)

**Files:**
- Create: `components/DateTicketPreview.tsx`
- Create: `components/HeroSection.tsx`
- Test: `tests/HeroSection.test.tsx`

**Interfaces:**
- Consumes: Spec Section 1 copy deck, `#FCE7EB` eyebrow pill, App Store / Google Play badge CTAs, Trust tag, Date Ticket side-by-side fit check with Cohesion badge (`COHESION CHECK: MATCHED ✨`).
- Produces: `<HeroSection />` and `<DateTicketPreview />`.

- [ ] **Step 1: Write the failing test for HeroSection & DateTicketPreview**

Create `tests/HeroSection.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/HeroSection.test.tsx`
Expected: FAIL with "Cannot find module '@/components/HeroSection'".

- [ ] **Step 3: Implement DateTicketPreview and HeroSection components**

Create `components/DateTicketPreview.tsx`:
```tsx
import React from "react";
import Image from "next/image";

export default function DateTicketPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-3xl border border-[#E2E8F0] bg-white p-4 shadow-xl sm:p-6">
      {/* Mascot perched on corner */}
      <div className="absolute -top-10 right-4 z-10 w-20 sm:w-24">
        <Image
          src="/images/hello-wingbirds.png"
          alt="Huff & Chihi thumbs up"
          width={120}
          height={80}
          className="drop-shadow-md"
        />
      </div>

      {/* Ticket Header */}
      <div className="mb-4 flex items-center justify-between border-b border-dashed border-[#E2E8F0] pb-3">
        <div>
          <span className="font-heading text-xs font-semibold uppercase tracking-wider text-[#E05A6D]">
            Friday Date Night
          </span>
          <h4 className="font-heading text-lg font-bold text-[#1E293B]">
            Osteria & Rooftop Bar
          </h4>
        </div>
        <div className="rounded-full bg-[#FCE7EB] px-2.5 py-1 text-xs font-medium text-[#E05A6D]">
          7:30 PM
        </div>
      </div>

      {/* Side-by-side Outfits */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Partner A */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FBF9F9] p-3 text-center">
          <div className="relative mx-auto mb-2 aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F3EFEF]">
            <Image
              src="/images/date-sample-1.jpg"
              alt="Partner outfit: Cocktail Dress"
              fill
              className="object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              Locked In ✓
            </span>
          </div>
          <div className="font-heading text-xs font-semibold text-[#1E293B]">
            Cocktail Dress
          </div>
          <p className="text-[11px] text-[#64748B]">Chic & Elevated</p>
        </div>

        {/* Partner B */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FBF9F9] p-3 text-center">
          <div className="relative mx-auto mb-2 aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F3EFEF]">
            <Image
              src="/images/date-sample-2.jpg"
              alt="Partner outfit: Blazer & Oxford"
              fill
              className="object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              Locked In ✓
            </span>
          </div>
          <div className="font-heading text-xs font-semibold text-[#1E293B]">
            Blazer & Oxford
          </div>
          <p className="text-[11px] text-[#64748B]">Tailored & Crisp</p>
        </div>
      </div>

      {/* Cohesion Status Badge */}
      <div className="mt-4 flex items-center justify-center rounded-2xl bg-[#FCE7EB] py-2.5 px-4 text-center">
        <span className="font-heading text-sm font-bold tracking-tight text-[#E05A6D]">
          COHESION CHECK: MATCHED ✨
        </span>
      </div>
    </div>
  );
}
```

Create `components/HeroSection.tsx`:
```tsx
import React from "react";
import DateTicketPreview from "./DateTicketPreview";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Copy & CTAs */}
          <div className="text-center lg:col-span-7 lg:text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FCE7EB] px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E05A6D]" />
              <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-[#E05A6D] sm:text-sm">
                BUILT EXCLUSIVELY FOR TWO
              </span>
            </div>

            {/* H1 Headline */}
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-[-0.02em] text-[#1E293B] sm:text-5xl sm:leading-[1.1] lg:text-[56px] lg:leading-[62px]">
              No more hoodie-vs-gown disasters.
            </h1>

            {/* Subhead */}
            <p className="mt-6 text-lg leading-relaxed text-[#64748B] sm:text-xl lg:max-w-xl">
              DuoDate gives you and your partner a private space to plan real dates, sync your outfits before stepping out the door, and track your favorite nights together.
            </p>

            {/* CTA Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                href="#download"
                className="inline-flex items-center gap-3 rounded-2xl bg-[#1E293B] px-5 py-3 text-white shadow-md transition-all hover:bg-black hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E05A6D]"
                aria-label="Download on the App Store"
              >
                <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.04-1.77.92-2.81-.9.04-2 .6-2.63 1.34-.56.64-1.05 1.69-.92 2.7.99.08 2.02-.49 2.63-1.23z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-slate-300">
                    Download on the
                  </div>
                  <div className="font-heading text-base font-bold leading-tight">
                    App Store
                  </div>
                </div>
              </a>

              <a
                href="#download"
                className="inline-flex items-center gap-3 rounded-2xl bg-[#1E293B] px-5 py-3 text-white shadow-md transition-all hover:bg-black hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E05A6D]"
                aria-label="Get it on Google Play"
              >
                <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.003 2.003 0 0 1-.61-1.428V3.242c0-.53.224-1.039.609-1.428zm11.242 11.244l2.585 2.585-11.75 6.786 9.165-9.371zm0-2.116L5.686 1.571l11.75 6.786-2.585 2.585zm1.472 1.058l3.682 2.127a1.696 1.696 0 0 0 0-2.937L16.323 12z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-slate-300">
                    Get it on
                  </div>
                  <div className="font-heading text-base font-bold leading-tight">
                    Google Play
                  </div>
                </div>
              </a>
            </div>

            {/* Trust Tag */}
            <p className="mt-4 font-heading text-xs font-medium tracking-wide text-[#64748B]">
              Free to use • No ads • Private by design
            </p>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="lg:col-span-5">
            <DateTicketPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/HeroSection.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/DateTicketPreview.tsx components/HeroSection.tsx tests/HeroSection.test.tsx
git commit -m "feat: add HeroSection and DateTicketPreview with cohesion check badge"
```

---

### Task 4: The Hook / Reality Check Section (`RealityCheckSection.tsx`)

**Files:**
- Create: `components/RealityCheckSection.tsx`
- Test: `tests/RealityCheckSection.test.tsx`

**Interfaces:**
- Consumes: Spec Section 2 eyebrow (`THE REALITY OF DATE NIGHT`), H2 (`You shouldn't need three chat apps and a coin toss just to go to dinner.`), Narrative copy, and Mascot Whisper Bubble with Huff & Chihi quotes.
- Produces: `<RealityCheckSection />`.

- [ ] **Step 1: Write the failing test for RealityCheckSection**

Create `tests/RealityCheckSection.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/RealityCheckSection.test.tsx`
Expected: FAIL with "Cannot find module '@/components/RealityCheckSection'".

- [ ] **Step 3: Implement RealityCheckSection component**

Create `components/RealityCheckSection.tsx`:
```tsx
import React from "react";
import Image from "next/image";

export default function RealityCheckSection() {
  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl text-center">
        {/* Section Eyebrow */}
        <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-[#E05A6D] sm:text-sm">
          THE REALITY OF DATE NIGHT
        </span>

        {/* H2 Headline */}
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-[40px] lg:leading-[46px]">
          You shouldn't need three chat apps and a coin toss just to go to dinner.
        </h2>

        {/* Narrative Copy */}
        <p className="mt-6 text-lg leading-relaxed text-[#64748B] sm:text-xl lg:leading-[35px]">
          Most date nights unravel the same way: half-baked plans buried in message threads, twenty minutes of &ldquo;I don't mind, what do you want?&rdquo;, and one person stepping out in cocktail attire while the other is still tying running shoes. DuoDate cuts out the guesswork so planning an evening together feels like an event, not an administrative task.
        </p>

        {/* Mascot Whisper Bubble */}
        <div className="mt-10 inline-flex flex-col items-center gap-4 rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:flex-row sm:gap-6 sm:px-8 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-[#FCE7EB]">
              <Image
                src="/images/huff-neutral.png"
                alt="Huff"
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="text-left">
              <span className="font-heading text-xs font-bold text-[#E05A6D]">Huff:</span>
              <p className="text-sm font-medium italic text-[#1E293B]">
                &ldquo;Couch and takeout, night four?&rdquo;
              </p>
            </div>
          </div>

          <div className="hidden h-8 w-px bg-[#E2E8F0] sm:block" />

          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-[#FFE8EC]">
              <Image
                src="/images/chichi-neutral.png"
                alt="Chihi"
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="text-left">
              <span className="font-heading text-xs font-bold text-[#FF9EAA]">Chihi:</span>
              <p className="text-sm font-medium italic text-[#1E293B]">
                &ldquo;Not tonight. We've got plans.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/RealityCheckSection.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/RealityCheckSection.tsx tests/RealityCheckSection.test.tsx
git commit -m "feat: add RealityCheckSection with narrative hook and mascot whisper banter"
```

---

### Task 5: Core Features Showcase Grid (`FeaturesSection.tsx` & `FeatureCard.tsx`)

**Files:**
- Create: `components/FeatureCard.tsx`
- Create: `components/FeaturesSection.tsx`
- Test: `tests/FeaturesSection.test.tsx`

**Interfaces:**
- Consumes: Spec Section 3 3-card grid (The Fit Check, Dates On The Books, Memories That Stick) with tags, bodies, and highlight pills.
- Produces: `<FeaturesSection />` and `<FeatureCard />`.

- [ ] **Step 1: Write the failing test for FeaturesSection**

Create `tests/FeaturesSection.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/FeaturesSection.test.tsx`
Expected: FAIL with "Cannot find module '@/components/FeaturesSection'".

- [ ] **Step 3: Implement FeatureCard and FeaturesSection components**

Create `components/FeatureCard.tsx`:
```tsx
import React from "react";

export interface FeatureCardProps {
  tag: string;
  title: string;
  description: string;
  pills: string[];
  visualContent: React.ReactNode;
}

export default function FeatureCard({
  tag,
  title,
  description,
  pills,
  visualContent,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all hover:border-[#E05A6D]/40 hover:shadow-md sm:p-8">
      <div>
        <span className="inline-block rounded-full bg-[#FCE7EB] px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-[#E05A6D]">
          {tag}
        </span>
        <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight text-[#1E293B]">
          {title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-[#64748B]">
          {description}
        </p>

        {/* Feature Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {pills.map((pill) => (
            <span
              key={pill}
              className="rounded-lg border border-[#E2E8F0] bg-[#FBF9F9] px-2.5 py-1 text-xs font-medium text-[#1E293B]"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FBF9F9] p-4">
        {visualContent}
      </div>
    </div>
  );
}
```

Create `components/FeaturesSection.tsx`:
```tsx
import React from "react";
import Image from "next/image";
import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-[#E05A6D] sm:text-sm">
            HOW DUODATE WORKS
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-[40px] lg:leading-[46px]">
            Built around the moments that actually matter.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#64748B] sm:text-lg">
            Three focused tools to keep your plans intentional and your memories intact.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: The Fit Check */}
          <FeatureCard
            tag="SIGNATURE FEATURE"
            title="The Fit Check"
            description="Pick the vibe—Casual, Chic, Cozy, or Active. Snap your outfit, lock it in, and see your partner's fit appear side-by-side. Never be the only one in jeans again."
            pills={[
              "Side-by-side Date Ticket",
              "5 Preset Vibe Selectors",
              "Zero outfit spoilers until both lock in",
            ]}
            visualContent={
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="flex items-center gap-2 rounded-full bg-[#FCE7EB] px-3 py-1 font-heading text-xs font-bold text-[#E05A6D]">
                  Vibe: Chic & Elevated ✨
                </div>
                <div className="mt-3 flex gap-3">
                  <div className="h-20 w-16 rounded-lg bg-[#E2E8F0] flex items-center justify-center text-[10px] text-[#64748B] font-medium">Fit A</div>
                  <div className="h-20 w-16 rounded-lg bg-[#E2E8F0] flex items-center justify-center text-[10px] text-[#64748B] font-medium">Fit B</div>
                </div>
              </div>
            }
          />

          {/* Card 2: Dates On The Books */}
          <FeatureCard
            tag="SHARED CALENDAR"
            title="Dates On The Books"
            description="Lock in the restaurant, the time, and the plans in one private space that syncs to both your phones. A live countdown on your home screen keeps the excitement building all week."
            pills={[
              "Real-time synchronization",
              "Live days/hours countdown",
              "Private notes & reservations",
            ]}
            visualContent={
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <span className="font-heading text-xs font-semibold text-[#64748B]">Upcoming Date</span>
                <span className="mt-1 font-heading text-base font-bold text-[#1E293B]">Dinner at Osteria • 7:30 PM</span>
                <span className="mt-2 rounded-full bg-[#1E293B] px-3 py-1 font-heading text-xs font-semibold text-white">
                  ⏳ 2 days, 4 hours
                </span>
              </div>
            }
          />

          {/* Card 3: Memories That Stick */}
          <FeatureCard
            tag="PRIVATE TIMELINE"
            title="Memories That Stick"
            description="Past dates don't vanish into a camera roll of 10,000 grocery screenshots. Save your favorite moments, build your couple milestones, and look back on where you've been."
            pills={[
              "Dedicated shared timeline",
              "Date streak & couple achievements",
              "100% ad-free & private",
            ]}
            visualContent={
              <div className="relative flex items-center justify-center py-4">
                <div className="relative h-24 w-32 rounded-lg bg-white p-2 shadow-sm border border-[#E2E8F0] rotate-[-4deg]">
                  <div className="h-14 w-full rounded bg-[#F3EFEF]" />
                  <span className="mt-1 block text-[10px] font-medium text-[#64748B]">Anniversary Dinner 💖</span>
                </div>
                <div className="relative -ml-6 h-24 w-32 rounded-lg bg-white p-2 shadow-sm border border-[#E2E8F0] rotate-[6deg]">
                  <div className="h-14 w-full rounded bg-[#F3EFEF]" />
                  <span className="mt-1 block text-[10px] font-medium text-[#64748B]">Picnic in the Park 🍷</span>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/FeaturesSection.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/FeatureCard.tsx components/FeaturesSection.tsx tests/FeaturesSection.test.tsx
git commit -m "feat: add FeaturesSection 3-card showcase with pills and visual mockups"
```

---

### Task 6: Meet Huff & Chihi Companions Section (`MascotSection.tsx`)

**Files:**
- Create: `components/MascotSection.tsx`
- Test: `tests/MascotSection.test.tsx`

**Interfaces:**
- Consumes: Spec Section 4 pair profiles (Huff the Cheeky Realist, Chihi the Chief Cheerleader), quotes, bios, and banter bubble.
- Produces: `<MascotSection />`.

- [ ] **Step 1: Write the failing test for MascotSection**

Create `tests/MascotSection.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MascotSection from "@/components/MascotSection";

describe("MascotSection Component", () => {
  it("renders section header, Huff profile, and Chihi profile", () => {
    render(<MascotSection />);

    expect(screen.getByText("MEET YOUR IN-APP COMPANIONS")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Meet your new wingbirds.",
      })
    ).toBeInTheDocument();

    // Profiles
    expect(screen.getByRole("heading", { level: 3, name: "Huff" })).toBeInTheDocument();
    expect(screen.getByText("THE CHEEKY REALIST")).toBeInTheDocument();
    expect(screen.getByText(/Couch and takeout, night four\? Really\?/i)).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 3, name: "Chihi" })).toBeInTheDocument();
    expect(screen.getByText("THE CHIEF CHEERLEADER")).toBeInTheDocument();
    expect(screen.getByText(/Saving this seat for your person\. Let’s make plans!/i)).toBeInTheDocument();
  });

  it("renders real in-app banter callout box with Huff and Chihi dialog", () => {
    render(<MascotSection />);

    expect(screen.getByText(/Your fit's in\. Theirs\? Suspiciously quiet\./i)).toBeInTheDocument();
    expect(screen.getByText(/Give them five minutes! Look at you two though\./i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/MascotSection.test.tsx`
Expected: FAIL with "Cannot find module '@/components/MascotSection'".

- [ ] **Step 3: Implement MascotSection component**

Create `components/MascotSection.tsx`:
```tsx
import React from "react";
import Image from "next/image";

export default function MascotSection() {
  return (
    <section id="mascots" className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-[#E05A6D] sm:text-sm">
            MEET YOUR IN-APP COMPANIONS
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-[40px] lg:leading-[46px]">
            Meet your new wingbirds.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#64748B] sm:text-lg">
            DuoDate isn't a cold calendar tool. Huff and Chihi are here at every milestone—teasing your couch habits and cheering on your next great night out.
          </p>
        </div>

        {/* 2 Companion Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Huff */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all hover:border-[#E05A6D]/40 hover:shadow-md sm:p-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#FCE7EB] px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-[#E05A6D]">
                  THE CHEEKY REALIST
                </span>
                <span className="h-3 w-3 rounded-full bg-[#E05A6D]" />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-[#FCE7EB] p-2">
                  <Image
                    src="/images/huff-neutral.png"
                    alt="Huff the cheeky realist"
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-[#1E293B]">
                    Huff
                  </h3>
                  <p className="font-heading text-sm text-[#E05A6D]">
                    Coral Wingbird
                  </p>
                </div>
              </div>

              <p className="mt-4 text-base leading-relaxed text-[#64748B]">
                Deadpan, dry, and allergic to the couch rut. Huff is the one calling out when your outfit is in but your partner's side of the ticket is suspiciously quiet.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#FBF9F9] p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Signature Quote
              </span>
              <p className="mt-1 font-heading text-base font-bold italic text-[#1E293B]">
                &ldquo;Couch and takeout, night four? Really?&rdquo;
              </p>
            </div>
          </div>

          {/* Chihi */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all hover:border-[#FF9EAA]/60 hover:shadow-md sm:p-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#FFE8EC] px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-[#FF9EAA]">
                  THE CHIEF CHEERLEADER
                </span>
                <span className="h-3 w-3 rounded-full bg-[#FF9EAA]" />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-[#FFE8EC] p-2">
                  <Image
                    src="/images/chichi-neutral.png"
                    alt="Chihi the chief cheerleader"
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-[#1E293B]">
                    Chihi
                  </h3>
                  <p className="font-heading text-sm text-[#FF9EAA]">
                    Blush Pink Wingbird
                  </p>
                </div>
              </div>

              <p className="mt-4 text-base leading-relaxed text-[#64748B]">
                Warm, enthusiastic, and relentless about making things happen. Chihi makes sure the invites get sent, the dates get locked in, and the celebration pops.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#FBF9F9] p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Signature Quote
              </span>
              <p className="mt-1 font-heading text-base font-bold italic text-[#1E293B]">
                &ldquo;Saving this seat for your person. Let’s make plans!&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Real In-App Banter Callout Box */}
        <div className="mt-8 rounded-3xl border border-[#E2E8F0] bg-[#FBF9F9]/80 p-6 backdrop-blur-sm sm:p-8">
          <div className="mb-4 text-center">
            <span className="font-heading text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Real In-App Banter
            </span>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="font-heading text-sm font-bold text-[#E05A6D]">Huff:</span>
              <p className="text-sm font-medium text-[#1E293B]">
                &ldquo;Your fit's in. Theirs? Suspiciously quiet.&rdquo;
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-heading text-sm font-bold text-[#FF9EAA]">Chihi:</span>
              <p className="text-sm font-medium text-[#1E293B]">
                &ldquo;Give them five minutes! Look at you two though.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/MascotSection.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/MascotSection.tsx tests/MascotSection.test.tsx
git commit -m "feat: add MascotSection with Huff & Chihi pair profiles and banter callout"
```

---

### Task 7: Final CTA Banner, 3-Step Setup Strip & Footer (`FinalCtaSection.tsx` & `Footer.tsx`)

**Files:**
- Create: `components/FinalCtaSection.tsx`
- Create: `components/Footer.tsx`
- Test: `tests/FinalCtaSection.test.tsx`
- Test: `tests/Footer.test.tsx`

**Interfaces:**
- Consumes: Spec Section 5 copy deck (H2, 3-step 30-second setup, badges, trust tag, brand column, links bar, copyright).
- Produces: `<FinalCtaSection />` and `<Footer />`.

- [ ] **Step 1: Write the failing tests for FinalCtaSection and Footer**

Create `tests/FinalCtaSection.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FinalCtaSection from "@/components/FinalCtaSection";

describe("FinalCtaSection Component", () => {
  it("renders H2 headline and subhead", () => {
    render(<FinalCtaSection />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Ready to plan your next real date?",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Download the app, share your private invite code, and say goodbye to mismatched outfits and wasted Friday nights\./i
      )
    ).toBeInTheDocument();
  });

  it("renders 3-step setup guide and trust tag", () => {
    render(<FinalCtaSection />);

    expect(screen.getByText(/1\. Download DuoDate/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Share Your Code/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Plan Your Night/i)).toBeInTheDocument();
    expect(
      screen.getByText("100% Private • Just the Two of You • No Social Feeds")
    ).toBeInTheDocument();
  });
});
```

Create `tests/Footer.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer Component", () => {
  it("renders logo, tagline, links, and copyright notice", () => {
    render(<Footer />);

    expect(screen.getByText("Date night, properly planned.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms of Service" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Support & Feedback" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
    expect(
      screen.getByText(/© 2026 DuoDate\. All rights reserved\. Built strictly for two\./i)
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/FinalCtaSection.test.tsx tests/Footer.test.tsx`
Expected: FAIL with missing modules.

- [ ] **Step 3: Implement FinalCtaSection and Footer components**

Create `components/FinalCtaSection.tsx`:
```tsx
import React from "react";

export default function FinalCtaSection() {
  return (
    <section id="download" className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl rounded-3xl border border-[#E2E8F0] bg-gradient-to-br from-[#FFFFFF] to-[#FCE7EB]/50 p-8 shadow-xl sm:p-12 lg:p-16">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-5xl">
            Ready to plan your next real date?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#64748B] sm:text-lg">
            Download the app, share your private invite code, and say goodbye to mismatched outfits and wasted Friday nights.
          </p>
        </div>

        {/* 3-Step Setup Strip */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm text-center">
            <span className="font-heading text-sm font-bold text-[#E05A6D]">
              1. Download DuoDate
            </span>
            <p className="mt-1 text-xs text-[#64748B]">
              Available on iOS and Android.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm text-center">
            <span className="font-heading text-sm font-bold text-[#E05A6D]">
              2. Share Your Code
            </span>
            <p className="mt-1 text-xs text-[#64748B]">
              Send your 6-digit link to your partner.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm text-center">
            <span className="font-heading text-sm font-bold text-[#E05A6D]">
              3. Plan Your Night
            </span>
            <p className="mt-1 text-xs text-[#64748B]">
              Lock in the date, check your fits, and go.
            </p>
          </div>
        </div>

        {/* Store Download Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-3 rounded-2xl bg-[#1E293B] px-5 py-3 text-white shadow-md transition-all hover:bg-black hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E05A6D]"
            aria-label="Download on the App Store"
          >
            <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.04-1.77.92-2.81-.9.04-2 .6-2.63 1.34-.56.64-1.05 1.69-.92 2.7.99.08 2.02-.49 2.63-1.23z" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-300">
                Download on the
              </div>
              <div className="font-heading text-base font-bold leading-tight">
                App Store
              </div>
            </div>
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-3 rounded-2xl bg-[#1E293B] px-5 py-3 text-white shadow-md transition-all hover:bg-black hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E05A6D]"
            aria-label="Get it on Google Play"
          >
            <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a2.003 2.003 0 0 1-.61-1.428V3.242c0-.53.224-1.039.609-1.428zm11.242 11.244l2.585 2.585-11.75 6.786 9.165-9.371zm0-2.116L5.686 1.571l11.75 6.786-2.585 2.585zm1.472 1.058l3.682 2.127a1.696 1.696 0 0 0 0-2.937L16.323 12z" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-300">
                Get it on
              </div>
              <div className="font-heading text-base font-bold leading-tight">
                Google Play
              </div>
            </div>
          </a>
        </div>

        {/* Trust Tag */}
        <p className="mt-6 text-center font-heading text-xs font-medium tracking-wide text-[#64748B]">
          100% Private • Just the Two of You • No Social Feeds
        </p>
      </div>
    </section>
  );
}
```

Create `components/Footer.tsx`:
```tsx
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white py-12 px-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Brand Column */}
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span className="font-heading text-xl font-bold tracking-tight text-[#1E293B]">
              DuoDate
            </span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#E05A6D]" />
          </div>
          <p className="mt-1 text-sm text-[#64748B]">
            Date night, properly planned.
          </p>
        </div>

        {/* Links Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#64748B]">
          <Link href="#privacy" className="transition-colors hover:text-[#1E293B]">
            Privacy Policy
          </Link>
          <Link href="#terms" className="transition-colors hover:text-[#1E293B]">
            Terms of Service
          </Link>
          <Link href="#support" className="transition-colors hover:text-[#1E293B]">
            Support & Feedback
          </Link>
          <Link href="#contact" className="transition-colors hover:text-[#1E293B]">
            Contact
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-[#64748B] sm:text-right">
          © 2026 DuoDate. All rights reserved. Built strictly for two.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/FinalCtaSection.test.tsx tests/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/FinalCtaSection.tsx components/Footer.tsx tests/FinalCtaSection.test.tsx tests/Footer.test.tsx
git commit -m "feat: add FinalCtaSection with 3-step setup strip and brand Footer"
```

---

### Task 8: Page Integration, Metadata, SEO Verification & Build Verification

**Files:**
- Modify: `app/page.tsx:1-35`
- Modify: `app/layout.tsx:1-50`
- Create: `tests/Metadata.test.ts`
- Create: `tests/PageIntegration.test.tsx`

**Interfaces:**
- Consumes: All components from Tasks 2-7, Technical SEO & Metadata specs from Spec Section 5.
- Produces: Complete landing page and passing Next.js production build.

- [ ] **Step 1: Write tests for page metadata and full component integration**

Create `tests/Metadata.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { metadata } from "../app/layout";

describe("Technical SEO & Metadata", () => {
  it("defines exact title and description according to spec", () => {
    expect(metadata.title).toBe("DuoDate — The Private Date Night App for Two");
    expect(metadata.description).toBe(
      "Plan real dates, match your outfits before stepping out, and keep track of your favorite nights together. DuoDate is the private couple's app built strictly for two."
    );
  });

  it("defines Open Graph title and description according to spec", () => {
    expect(metadata.openGraph?.title).toBe(
      "DuoDate — No more hoodie-vs-gown disasters."
    );
    expect(metadata.openGraph?.description).toBe(
      "A private app for couples to plan dates, coordinate outfits, and celebrate their favorite nights together."
    );
  });
});
```

Create `tests/PageIntegration.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

describe("DuoDate Landing Page Integration", () => {
  it("renders all key sections from top to bottom", () => {
    render(<Page />);

    // Navbar
    expect(screen.getByRole("link", { name: "DuoDate" })).toBeInTheDocument();

    // Hero
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "No more hoodie-vs-gown disasters.",
      })
    ).toBeInTheDocument();

    // Reality Check
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "You shouldn't need three chat apps and a coin toss just to go to dinner.",
      })
    ).toBeInTheDocument();

    // Core Features
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Built around the moments that actually matter.",
      })
    ).toBeInTheDocument();

    // Mascots
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Meet your new wingbirds.",
      })
    ).toBeInTheDocument();

    // Final CTA
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Ready to plan your next real date?",
      })
    ).toBeInTheDocument();

    // Footer
    expect(
      screen.getByText(/© 2026 DuoDate\. All rights reserved\. Built strictly for two\./i)
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail before assembly**

Run: `npx vitest run tests/Metadata.test.ts tests/PageIntegration.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Update `app/layout.tsx` with complete metadata and wire up `app/page.tsx`**

Update `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Barlow, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import SmoothScroll from "@/components/SmoothScroll";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DuoDate — The Private Date Night App for Two",
  description:
    "Plan real dates, match your outfits before stepping out, and keep track of your favorite nights together. DuoDate is the private couple's app built strictly for two.",
  openGraph: {
    title: "DuoDate — No more hoodie-vs-gown disasters.",
    description:
      "A private app for couples to plan dates, coordinate outfits, and celebrate their favorite nights together.",
    url: "https://duodate.app",
    siteName: "DuoDate",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowSemiCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBF9F9] text-[#1E293B]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
```

Update `app/page.tsx`:
```tsx
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RealityCheckSection from "@/components/RealityCheckSection";
import FeaturesSection from "@/components/FeaturesSection";
import MascotSection from "@/components/MascotSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBF9F9]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <RealityCheckSection />
        <FeaturesSection />
        <MascotSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Run all unit tests and Next.js production build**

Run: `npm test`
Expected: ALL test files pass.

Run: `npm run build`
Expected: Production build compiles successfully without errors or warnings.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/layout.tsx tests/Metadata.test.ts tests/PageIntegration.test.tsx
git commit -m "feat: complete landing page assembly, SEO metadata, and verification suite"
```
