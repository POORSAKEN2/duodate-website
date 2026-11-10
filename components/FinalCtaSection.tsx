import React from "react";
import Image from "next/image";
import Reveal from "./Reveal";

export default function FinalCtaSection() {
  return (
    <section id="download" className="scroll-mt-20 bg-[#F5F5F7] px-4 py-24 sm:px-6 sm:py-32">
      <Reveal className="mx-auto max-w-3xl text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/reunion.png"
            alt="Huff and Chihi perched together"
            width={180}
            height={87}
            className="h-auto w-auto max-w-[180px] object-contain"
          />
        </div>

        <h2 className="font-heading text-4xl font-bold tracking-tight text-[#1D1D1F] sm:text-5xl lg:text-[64px] lg:leading-[1.03]">
          Date night starts before you leave the house.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-[#6E6E73]">
          Download DuoDate, invite your person, and lock in your first date in
          under two minutes.
        </p>

        {/* Steps as one quiet line */}
        <p className="mt-8 text-sm font-medium text-[#6E6E73]">
          Download for two&ensp;·&ensp;Pick your vibe&ensp;·&ensp;Step out in
          sync
        </p>

        {/* Store Download Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#download"
            className="group inline-flex items-center gap-3 rounded-2xl bg-[#111827] px-5 py-3 text-white transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#E05A6D] focus:ring-offset-2"
            aria-label="Download on the App Store"
          >
            <svg className="h-7 w-7 flex-shrink-0 fill-white" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.04-1.77.92-2.81-.9.04-2 .6-2.63 1.34-.56.64-1.05 1.69-.92 2.7.99.08 2.02-.49 2.63-1.23z" />
            </svg>
            <div className="text-left">
              <div className="text-[11px] font-medium leading-tight text-neutral-300">
                Download on the
              </div>
              <div className="font-heading text-base font-bold leading-tight text-white">
                App Store
              </div>
            </div>
          </a>

          <a
            href="#download"
            className="group inline-flex items-center gap-3 rounded-2xl bg-[#111827] px-5 py-3 text-white transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#E05A6D] focus:ring-offset-2"
            aria-label="Get it on Google Play"
          >
            <svg className="h-6 w-6 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M3.609 1.814L13.792 12 3.61 22.186a2.003 2.003 0 0 1-.61-1.428V3.242c0-.53.224-1.039.609-1.428z"
              />
              <path
                fill="#EA4335"
                d="M14.851 13.058l2.585 2.585-11.75 6.786 9.165-9.371z"
              />
              <path
                fill="#34A853"
                d="M14.851 10.942L5.686 1.571l11.75 6.786-2.585 2.585z"
              />
              <path
                fill="#FBBC04"
                d="M16.323 12l3.682 2.127a1.696 1.696 0 0 0 0-2.937L16.323 12z"
              />
            </svg>
            <div className="text-left">
              <div className="text-[11px] font-medium leading-tight text-neutral-300">
                Get it on
              </div>
              <div className="font-heading text-base font-bold leading-tight text-white">
                Google Play
              </div>
            </div>
          </a>
        </div>

        {/* Trust Tag */}
        <p className="mt-8 text-xs font-medium tracking-wide text-[#6E6E73]">
          100% Private&ensp;·&ensp;Just the Two of You&ensp;·&ensp;No Social
          Feeds
        </p>
      </Reveal>
    </section>
  );
}
