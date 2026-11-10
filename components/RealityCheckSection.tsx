import React from "react";
import Image from "next/image";

export default function RealityCheckSection() {
  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl text-center">
        {/* Section Eyebrow */}
        <span className="font-heading text-xs font-bold uppercase tracking-[0.08em] text-[#A62639] sm:text-sm">
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
              <span className="font-heading text-xs font-bold text-[#A62639]">Huff:</span>
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
              <span className="font-heading text-xs font-bold text-[#BE3A58]">Chihi:</span>
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
