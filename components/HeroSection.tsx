import React from "react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Big DuoDate Title */}
        <h1 className="font-heading text-6xl font-black tracking-tight text-black sm:text-7xl md:text-8xl lg:text-[136px] lg:leading-[0.95] xl:text-[168px] xl:leading-[0.9]">
          DuoDate
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-[#111827] sm:text-lg md:text-xl">
          DuoDate gives you and your partner a private space to plan real dates, sync your outfits before stepping out the door, and track your favorite nights together.
        </p>

        {/* Centered App Store & Google Play Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          {/* Google Play */}
          <a
            href="#download"
            className="inline-flex items-center gap-2.5 rounded-lg border border-[#A6A6A6] bg-black px-4 py-2 text-white shadow-sm transition-all hover:bg-neutral-900 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#E05A6D]"
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
              <div className="text-[9px] font-medium uppercase tracking-wider text-neutral-300">
                GET IT ON
              </div>
              <div className="font-heading text-sm font-bold leading-tight text-white sm:text-base">
                Google Play
              </div>
            </div>
          </a>

          {/* App Store */}
          <a
            href="#download"
            className="inline-flex items-center gap-2.5 rounded-lg border border-[#A6A6A6] bg-black px-4 py-2 text-white shadow-sm transition-all hover:bg-neutral-900 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#E05A6D]"
            aria-label="Download on the App Store"
          >
            <svg className="h-6 w-6 flex-shrink-0 fill-white" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.04-1.77.92-2.81-.9.04-2 .6-2.63 1.34-.56.64-1.05 1.69-.92 2.7.99.08 2.02-.49 2.63-1.23z" />
            </svg>
            <div className="text-left">
              <div className="text-[9px] font-medium leading-tight text-neutral-300">
                Download on the
              </div>
              <div className="font-heading text-sm font-bold leading-tight text-white sm:text-base">
                App Store
              </div>
            </div>
          </a>
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
