import React from "react";
import Image from "next/image";
import Reveal from "./Reveal";

export default function MascotSection() {
  return (
    <section id="mascots" className="scroll-mt-20 bg-white px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <Reveal className="text-center">
          <span className="text-sm font-semibold text-[#6E6E73]">
            The companions
          </span>
          <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-[#1D1D1F] sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            Meet Huff &amp; Chihi
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[#6E6E73]">
            Your date night co-pilots. Huff brings the dry reality check; Chihi
            brings the unstoppable enthusiasm.
          </p>
        </Reveal>

        {/* 2 Companion Tiles */}
        <Reveal delay={0.1} className="mt-16 grid gap-6 md:grid-cols-2">
          {/* Huff */}
          <div className="flex flex-col rounded-3xl bg-[#F5F5F7] p-8 sm:p-10">
            <div className="flex items-center gap-5">
              <Image
                src="/images/huff-neutral.png"
                alt="Huff the realist"
                width={96}
                height={96}
                className="h-24 w-24 object-contain"
              />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E05A6D]">
                  The Realist
                </span>
                <h3 className="font-heading text-3xl font-bold tracking-tight text-[#1D1D1F]">
                  Huff
                </h3>
                <p className="text-sm font-medium text-[#6E6E73]">
                  Coral Wingbird
                </p>
              </div>
            </div>

            <p className="mt-6 text-base leading-relaxed text-[#6E6E73]">
              Deadpan, pragmatic, and allergic to half-baked plans. Huff speaks
              for the part of you that wants reservations made, timing
              respected, and outfits coordinated.
            </p>

            <p className="mt-6 font-heading text-lg font-bold italic tracking-tight text-[#1D1D1F]">
              &ldquo;Are we really pretending you&apos;re ready when you
              haven&apos;t picked shoes?&rdquo;
            </p>
          </div>

          {/* Chihi */}
          <div className="flex flex-col rounded-3xl bg-[#F5F5F7] p-8 sm:p-10">
            <div className="flex items-center gap-5">
              <Image
                src="/images/chichi-neutral.png"
                alt="Chihi the optimist"
                width={96}
                height={96}
                className="h-24 w-24 object-contain"
              />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E05A6D]">
                  The Optimist
                </span>
                <h3 className="font-heading text-3xl font-bold tracking-tight text-[#1D1D1F]">
                  Chihi
                </h3>
                <p className="text-sm font-medium text-[#6E6E73]">
                  Blush Pink Wingbird
                </p>
              </div>
            </div>

            <p className="mt-6 text-base leading-relaxed text-[#6E6E73]">
              High energy, romantic, and dedicated to momentum. Chihi makes
              sure date night actually feels like an adventure, celebrating
              every locked-in date and shared memory.
            </p>

            <p className="mt-6 font-heading text-lg font-bold italic tracking-tight text-[#1D1D1F]">
              &ldquo;I booked the table, picked the playlist, and ironed the
              shirt. Let&apos;s go!&rdquo;
            </p>
          </div>
        </Reveal>

        {/* Date Night Debrief */}
        <Reveal delay={0.15} className="mx-auto mt-16 max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
            Date night debrief
          </span>
          <div className="mt-4 space-y-2">
            <p className="text-base text-[#1D1D1F]">
              <span className="font-heading font-bold text-[#E05A6D]">Huff:</span>{" "}
              &ldquo;The restaurant was 12 minutes late on our table.&rdquo;
            </p>
            <p className="text-base text-[#1D1D1F]">
              <span className="font-heading font-bold text-[#E05A6D]">Chihi:</span>{" "}
              &ldquo;And the tiramisu was incredible. 10/10 night.&rdquo;
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
