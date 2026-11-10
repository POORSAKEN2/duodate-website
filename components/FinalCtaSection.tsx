import React from "react";
import Image from "next/image";

export default function FinalCtaSection() {
  return (
    <section id="download" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="relative mx-auto max-w-5xl rounded-3xl border border-[#E2E8F0] bg-gradient-to-br from-[#FFFFFF] to-[#FCE7EB]/50 p-8 shadow-xl sm:p-12 lg:p-16">
        {/* Perched Mascot Image */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/reunion.png"
            alt="Huff and Chihi perched together"
            width={180}
            height={87}
            className="h-auto w-auto max-w-[180px] object-contain"
          />
        </div>

        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-5xl">
            Date night starts before you leave the house.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#64748B] sm:text-lg">
            Download DuoDate, invite your person, and lock in your first date in under two minutes.
          </p>
        </div>

        {/* 3-Step Setup Strip */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm text-center">
            <span className="font-heading text-base font-bold text-[#E05A6D]">
              1. Download for Two
            </span>
            <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
              One invite link connects both phones instantly. No shared passwords, no awkward calendar invites.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm text-center">
            <span className="font-heading text-base font-bold text-[#E05A6D]">
              2. Pick Your First Vibe
            </span>
            <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
              Choose dinner, drinks, casual stroll, or something new. Set the time and lock the dress code.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm text-center">
            <span className="font-heading text-base font-bold text-[#E05A6D]">
              3. Step Out in Sync
            </span>
            <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
              Snap your fit, get your cohesion score, and head out the door knowing neither of you is overdressed.
            </p>
          </div>
        </div>

        {/* Store Download Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
        <p className="mt-6 text-center font-heading text-xs font-medium tracking-wide text-[#64748B]">
          100% Private • Just the Two of You • No Social Feeds
        </p>
      </div>
    </section>
  );
}
