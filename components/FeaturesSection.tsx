import React from "react";
import Image from "next/image";
import FeatureCard from "./FeatureCard";
import Reveal from "./Reveal";

export default function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 bg-[#F5F5F7] px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <Reveal className="text-center">
          <span className="text-sm font-semibold text-[#6E6E73]">
            Core features
          </span>
          <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-[#1D1D1F] sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            Everything you need to keep date night alive.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[#6E6E73]">
            Three focused tools to keep your plans intentional and your memories intact.
          </p>
        </Reveal>

        {/* 3-Card Grid */}
        <Reveal delay={0.1} className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: The Fit Check */}
          <FeatureCard
            tag="OUTFIT HARMONY"
            title="The Fit Check"
            description="Snap what you're wearing before you leave the house. DuoDate gives you an instant cohesion score so nobody shows up overdressed, underdressed, or wearing clashing neon."
            pills={[
              "Side-by-side outfit preview",
              "Instant cohesion score",
              "Discreet tweak suggestions",
            ]}
            visualContent={
              <div className="flex flex-col py-1">
                {/* Vibe Status Pill - Glassmorphism translucent badge */}
                <div className="flex items-center justify-between rounded-xl border border-black/[0.04] bg-white/70 px-3 py-2 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                  <div className="inline-flex items-center gap-1.5 font-heading text-xs font-bold text-[#A62639]">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E05A6D] opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E05A6D]" />
                    </span>
                    Vibe: Chic & Elevated
                  </div>
                  <span className="inline-flex items-center rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-semibold text-[#059669]">
                    96% Match
                  </span>
                </div>

                {/* Real Outfits Side-by-Side with Apple subtle depth & corner radius */}
                <div className="mt-3.5 grid grid-cols-2 gap-3">
                  <div className="group/item relative overflow-hidden rounded-2xl border border-black/[0.05] bg-white p-2 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F3EFEF]">
                      <Image
                        src="/images/date-sample-1.jpg"
                        alt="Partner A outfit sample"
                        fill
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/item:scale-105"
                      />
                      <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md shadow-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Ready
                      </span>
                    </div>
                    <span className="mt-2 block font-heading text-xs font-semibold tracking-tight text-[#1E293B]">Cocktail Dress</span>
                  </div>

                  <div className="group/item relative overflow-hidden rounded-2xl border border-black/[0.05] bg-white p-2 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F3EFEF]">
                      <Image
                        src="/images/date-sample-2.jpg"
                        alt="Partner B outfit sample"
                        fill
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/item:scale-105"
                      />
                      <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md shadow-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Ready
                      </span>
                    </div>
                    <span className="mt-2 block font-heading text-xs font-semibold tracking-tight text-[#1E293B]">Tailored Blazer</span>
                  </div>
                </div>
              </div>
            }
          />

          {/* Card 2: Dates On The Books */}
          <FeatureCard
            tag="INTENTIONAL SCHEDULING"
            title="Dates On The Books"
            description="No more open-ended 'we should hang out sometime.' Lock in a venue, a time, and a dress code with one tap. Add notes, pin locations, and get gentle nudges before the night begins."
            pills={[
              "Dedicated date cards",
              "Synced reminders for two",
              "Venue & dress code locking",
            ]}
            visualContent={
              <div className="flex flex-col py-1">
                {/* Event Ticket Surface - Apple Wallet inspired card */}
                <div className="rounded-2xl border border-black/[0.05] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569]">
                      <span className="h-2 w-2 rounded-full bg-[#E05A6D] shadow-[0_0_6px_rgba(224,90,109,0.5)]" />
                      Upcoming Reservation
                    </span>
                    <span className="rounded-full border border-[#E05A6D]/20 bg-[#FCE7EB]/80 px-2.5 py-0.5 font-heading text-xs font-bold text-[#A62639]">
                      Fri • 7:30 PM
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-heading text-lg font-bold tracking-tight text-[#1E293B]">
                      Dinner at Osteria & Bar
                    </h4>
                    <p className="mt-0.5 text-xs font-medium text-[#64748B]">
                      Table for 2 • Dress code: Smart Casual
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-black/[0.05] pt-3">
                    <span className="text-[11px] font-medium text-[#64748B]">Countdown</span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-2.5 py-1 font-heading text-xs font-semibold text-white shadow-xs">
                      <span className="text-[10px]">⏳</span> 2 days, 4 hours
                    </span>
                  </div>
                </div>
              </div>
            }
          />

          {/* Card 3: Memories That Stick */}
          <FeatureCard
            tag="COUPLE MEMORY BOX"
            title="Memories That Stick"
            description="Rate your night, drop private photos, and build an ongoing timeline of where you've been together. Because the best nights shouldn't get lost in your camera roll."
            pills={[
              "Private couple timeline",
              "Post-date rating prompts",
              "Photo capsule per date",
            ]}
            visualContent={
              <div className="relative flex flex-col items-center justify-center py-3">
                {/* Layered Keepsake Stack with tactile Apple photo depth */}
                <div className="relative h-34 w-full max-w-[250px]">
                  {/* Background photo card */}
                  <div className="absolute top-1 left-3 h-28 w-38 rotate-[-6deg] rounded-2xl border border-black/[0.06] bg-white p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-[-2deg] hover:scale-105">
                    <div className="relative h-15 w-full overflow-hidden rounded-xl bg-[#F3EFEF]">
                      <Image
                        src="/images/date-sample-2.jpg"
                        alt="Memories thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="mt-1.5 block text-[11px] font-medium text-[#475569]">
                      Picnic in the Park 🍷
                    </span>
                  </div>

                  {/* Foreground photo card with elevated floating shadow */}
                  <div className="absolute top-2.5 right-3 h-28 w-38 rotate-[4deg] rounded-2xl border border-black/[0.06] bg-white p-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-[1deg] hover:scale-105">
                    <div className="relative h-15 w-full overflow-hidden rounded-xl bg-[#F3EFEF]">
                      <Image
                        src="/images/date-sample-1.jpg"
                        alt="Anniversary dinner thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#1E293B]">
                        Osteria Night
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#FCE7EB] px-1.5 py-0.5 text-[10px] font-bold text-[#A62639]">
                        10/10 ✨
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
