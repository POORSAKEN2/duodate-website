import "@testing-library/jest-dom";

// jsdom has no matchMedia; gsap's ScrollTrigger needs it at import time
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      // report reduced motion so Reveal skips gsap (which would hide content via autoAlpha in jsdom)
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
