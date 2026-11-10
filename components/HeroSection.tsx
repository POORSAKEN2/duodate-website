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
