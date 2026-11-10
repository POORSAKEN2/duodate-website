import React from "react";
import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-[#E05A6D] sm:text-sm">
            HOW DUODATE WORKS
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl lg:text-[40px] lg:leading-[46px]">
            Built around the moments that actually matter.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#64748B] sm:text-lg">
            Three focused tools to keep your plans intentional and your memories intact.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: The Fit Check */}
          <FeatureCard
            tag="SIGNATURE FEATURE"
            title="The Fit Check"
            description="Pick the vibe—Casual, Chic, Cozy, or Active. Snap your outfit, lock it in, and see your partner's fit appear side-by-side. Never be the only one in jeans again."
            pills={[
              "Side-by-side Date Ticket",
              "5 Preset Vibe Selectors",
              "Zero outfit spoilers until both lock in",
            ]}
            visualContent={
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="flex items-center gap-2 rounded-full bg-[#FCE7EB] px-3 py-1 font-heading text-xs font-bold text-[#E05A6D]">
                  Vibe: Chic & Elevated ✨
                </div>
                <div className="mt-3 flex gap-3">
                  <div className="h-20 w-16 rounded-lg bg-[#E2E8F0] flex items-center justify-center text-[10px] text-[#64748B] font-medium">Fit A</div>
                  <div className="h-20 w-16 rounded-lg bg-[#E2E8F0] flex items-center justify-center text-[10px] text-[#64748B] font-medium">Fit B</div>
                </div>
              </div>
            }
          />

          {/* Card 2: Dates On The Books */}
          <FeatureCard
            tag="SHARED CALENDAR"
            title="Dates On The Books"
            description="Lock in the restaurant, the time, and the plans in one private space that syncs to both your phones. A live countdown on your home screen keeps the excitement building all week."
            pills={[
              "Real-time synchronization",
              "Live days/hours countdown",
              "Private notes & reservations",
            ]}
            visualContent={
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <span className="font-heading text-xs font-semibold text-[#64748B]">Upcoming Date</span>
                <span className="mt-1 font-heading text-base font-bold text-[#1E293B]">Dinner at Osteria • 7:30 PM</span>
                <span className="mt-2 rounded-full bg-[#1E293B] px-3 py-1 font-heading text-xs font-semibold text-white">
                  ⏳ 2 days, 4 hours
                </span>
              </div>
            }
          />

          {/* Card 3: Memories That Stick */}
          <FeatureCard
            tag="PRIVATE TIMELINE"
            title="Memories That Stick"
            description="Past dates don't vanish into a camera roll of 10,000 grocery screenshots. Save your favorite moments, build your couple milestones, and look back on where you've been."
            pills={[
              "Dedicated shared timeline",
              "Date streak & couple achievements",
              "100% ad-free & private",
            ]}
            visualContent={
              <div className="relative flex items-center justify-center py-4">
                <div className="relative h-24 w-32 rounded-lg bg-white p-2 shadow-sm border border-[#E2E8F0] rotate-[-4deg]">
                  <div className="h-14 w-full rounded bg-[#F3EFEF]" />
                  <span className="mt-1 block text-[10px] font-medium text-[#64748B]">Anniversary Dinner 💖</span>
                </div>
                <div className="relative -ml-6 h-24 w-32 rounded-lg bg-white p-2 shadow-sm border border-[#E2E8F0] rotate-[6deg]">
                  <div className="h-14 w-full rounded bg-[#F3EFEF]" />
                  <span className="mt-1 block text-[10px] font-medium text-[#64748B]">Picnic in the Park 🍷</span>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
