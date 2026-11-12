import React from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import StoreBadges from "./StoreBadges";

export default function FinalCtaSection({ publicRelease }: { publicRelease: boolean }) {
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
          <StoreBadges publicRelease={publicRelease} variant="cta" />
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
