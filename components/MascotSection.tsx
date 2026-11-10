import React from "react";
import Image from "next/image";

export default function MascotSection() {
  return (
    <section id="mascots" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-[#E05A6D] sm:text-sm">
            THE COMPANIONS
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-[40px] lg:leading-[46px]">
            Meet Huff & Chihi
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#64748B] sm:text-lg">
            Your date night co-pilots. Huff brings the dry reality check; Chihi brings the unstoppable enthusiasm. They keep you honest, keep you moving, and make sure nobody cancels on the couch.
          </p>
        </div>

        {/* 2 Companion Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Huff Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all hover:border-[#E05A6D]/40 hover:shadow-md sm:p-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#FCE7EB] px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-[#E05A6D]">
                  THE REALIST
                </span>
                <span className="h-3 w-3 rounded-full bg-[#E05A6D]" />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#FCE7EB] p-2">
                  <Image
                    src="/images/huff-neutral.png"
                    alt="Huff the realist"
                    width={64}
                    height={64}
                    className="object-contain"
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
                Deadpan, pragmatic, and allergic to half-baked plans. Huff speaks for the part of you that wants reservations made, timing respected, and outfits coordinated.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#FBF9F9] p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Signature Quote
              </span>
              <p className="mt-1 font-heading text-base font-bold italic text-[#1E293B]">
                &ldquo;Are we really pretending you&apos;re ready when you haven&apos;t picked shoes?&rdquo;
              </p>
            </div>
          </div>

          {/* Chihi Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all hover:border-[#FF9EAA]/60 hover:shadow-md sm:p-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#FFE8EC] px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-[#FF9EAA]">
                  THE OPTIMIST
                </span>
                <span className="h-3 w-3 rounded-full bg-[#FF9EAA]" />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#FFE8EC] p-2">
                  <Image
                    src="/images/chichi-neutral.png"
                    alt="Chihi the optimist"
                    width={64}
                    height={64}
                    className="object-contain"
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
                High energy, romantic, and dedicated to momentum. Chihi makes sure date night actually feels like an adventure, celebrating every locked-in date and shared memory.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#FBF9F9] p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Signature Quote
              </span>
              <p className="mt-1 font-heading text-base font-bold italic text-[#1E293B]">
                &ldquo;I booked the table, picked the playlist, and ironed the shirt. Let&apos;s go!&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Date Night Debrief Banter Box */}
        <div className="mt-8 rounded-3xl border border-[#E2E8F0] bg-[#FBF9F9]/80 p-6 backdrop-blur-sm sm:p-8">
          <div className="mb-4 text-center">
            <span className="font-heading text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              DATE NIGHT DEBRIEF
            </span>
          </div>

          <div className="mx-auto max-w-2xl space-y-3">
            <div className="flex items-start gap-3">
              <span className="font-heading text-sm font-bold text-[#E05A6D]">Huff:</span>
              <p className="text-sm font-medium text-[#1E293B]">
                &ldquo;The restaurant was 12 minutes late on our table.&rdquo;
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-heading text-sm font-bold text-[#FF9EAA]">Chihi:</span>
              <p className="text-sm font-medium text-[#1E293B]">
                &ldquo;And the tiramisu was incredible. 10/10 night.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
