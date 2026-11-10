import React from "react";
import Image from "next/image";

export default function DateTicketPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-3xl border border-[#E2E8F0] bg-white p-4 shadow-xl sm:p-6">
      {/* Mascot perched on corner */}
      <div className="absolute -top-10 right-4 z-10 w-20 sm:w-24">
        <Image
          src="/images/hello-wingbirds.png"
          alt="Huff & Chihi thumbs up"
          width={120}
          height={80}
          className="drop-shadow-md"
        />
      </div>

      {/* Ticket Header */}
      <div className="mb-4 flex items-center justify-between border-b border-dashed border-[#E2E8F0] pb-3">
        <div>
          <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#A62639]">
            Friday Date Night
          </span>
          <h4 className="font-heading text-lg font-bold text-[#1E293B]">
            Osteria & Rooftop Bar
          </h4>
        </div>
        <div className="rounded-full bg-[#FCE7EB] px-2.5 py-1 text-xs font-bold text-[#A62639]">
          7:30 PM
        </div>
      </div>

      {/* Side-by-side Outfits */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Partner A */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FBF9F9] p-3 text-center">
          <div className="relative mx-auto mb-2 aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F3EFEF]">
            <Image
              src="/images/date-sample-1.jpg"
              alt="Partner outfit: Cocktail Dress"
              fill
              className="object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              Locked In ✓
            </span>
          </div>
          <div className="font-heading text-xs font-semibold text-[#1E293B]">
            Cocktail Dress
          </div>
          <p className="text-[11px] text-[#64748B]">Chic & Elevated</p>
        </div>

        {/* Partner B */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FBF9F9] p-3 text-center">
          <div className="relative mx-auto mb-2 aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F3EFEF]">
            <Image
              src="/images/date-sample-2.jpg"
              alt="Partner outfit: Blazer & Oxford"
              fill
              className="object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              Locked In ✓
            </span>
          </div>
          <div className="font-heading text-xs font-semibold text-[#1E293B]">
            Blazer & Oxford
          </div>
          <p className="text-[11px] text-[#64748B]">Tailored & Crisp</p>
        </div>
      </div>

      {/* Cohesion Status Badge */}
      <div className="mt-4 flex items-center justify-center rounded-2xl bg-[#FCE7EB] py-2.5 px-4 text-center">
        <span className="font-heading text-sm font-bold tracking-tight text-[#A62639]">
          COHESION CHECK: MATCHED ✨
        </span>
      </div>
    </div>
  );
}
