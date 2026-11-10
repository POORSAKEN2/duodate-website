import React from "react";
import Image from "next/image";
import Reveal from "./Reveal";

export default function RealityCheckSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="text-sm font-semibold text-[#6E6E73]">
            The reality of date night
          </span>

          <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-[#1D1D1F] sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            You shouldn&apos;t need three chat apps and a coin toss just to go
            to dinner.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#6E6E73]">
            Half-baked plans buried in message threads. Twenty minutes of
            &ldquo;I don&apos;t mind, what do you want?&rdquo; Mismatched
            outfits at the door. DuoDate cuts the guesswork so date night feels
            like an event, not admin.
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mt-14 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-14"
        >
          <div className="flex items-center gap-3">
            <Image
              src="/images/huff-neutral.png"
              alt="Huff"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <p className="text-sm italic text-[#6E6E73]">
              &ldquo;Couch and takeout, night four?&rdquo;
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/chichi-neutral.png"
              alt="Chihi"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <p className="text-sm italic text-[#6E6E73]">
              &ldquo;Not tonight. We&apos;ve got plans.&rdquo;
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
