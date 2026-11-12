import React from "react";
import Image from "next/image";
import StoreBadges from "./StoreBadges";

export default function HeroSection({ publicRelease }: { publicRelease: boolean }) {
  return (
    <section className="relative overflow-hidden bg-white px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        {/* Big DuoDate Title */}
        <h1 className="font-heading text-6xl font-black tracking-tight text-black sm:text-8xl md:text-[130px] md:leading-[0.9] lg:text-[200px] lg:leading-[0.88] xl:text-[278px] xl:leading-[0.85]">
          DuoDate
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-[#111827] sm:text-lg md:text-xl">
          DuoDate gives you and your partner a private space to plan real dates, sync your outfits before stepping out the door, and track your favorite nights together.
        </p>

        {/* Centered App Store & Google Play Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          <StoreBadges publicRelease={publicRelease} variant="hero" />
        </div>

        {/* Wingbirds Mascot Illustration */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <Image
            src="/images/hello-wingbirds.png"
            alt="DuoDate Wingbirds Huff and Chihi waving hello"
            width={529}
            height={328}
            priority
            className="h-auto w-64 object-contain drop-shadow-sm sm:w-72 md:w-80 lg:w-[360px]"
          />
        </div>
      </div>
    </section>
  );
}
