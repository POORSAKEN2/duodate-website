import React from "react";

export interface FeatureCardProps {
  tag: string;
  title: string;
  description: string;
  pills: string[];
  visualContent: React.ReactNode;
}

export default function FeatureCard({
  tag,
  title,
  description,
  pills,
  visualContent,
}: FeatureCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/80 p-6 sm:p-8 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#E05A6D]/25 hover:shadow-[0_20px_40px_-15px_rgba(224,90,109,0.12),0_8px_20px_rgba(0,0,0,0.04)] active:scale-[0.99] active:transition-transform active:duration-100">
      {/* Apple specular rim highlight (light catching top edge) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
      />

      {/* Subtle ambient blur glow on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#E05A6D]/10 to-transparent blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100"
      />

      <div className="relative z-10">
        {/* Header pill & status indicator */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E05A6D]/20 bg-[#FCE7EB]/70 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.06em] text-[#A62639] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E05A6D] shadow-[0_0_6px_rgba(224,90,109,0.5)]" />
            {tag}
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100/80 transition-colors group-hover:bg-[#FCE7EB]">
            <span className="h-2 w-2 rounded-full bg-slate-300 transition-all duration-300 group-hover:scale-125 group-hover:bg-[#E05A6D]" />
          </span>
        </div>

        {/* Title with Apple typographic optical balance */}
        <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-[#1E293B] sm:text-[26px]">
          {title}
        </h3>
        
        {/* Descriptive Body */}
        <p className="mt-2.5 text-[15px] leading-relaxed text-[#64748B]">
          {description}
        </p>

        {/* Feature Pills: frosted glass chips with tactile hover */}
        <div className="mt-6 flex flex-wrap gap-2">
          {pills.map((pill) => (
            <span
              key={pill}
              className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.05] bg-white/90 px-3 py-1.5 text-xs font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-200 hover:border-[#E05A6D]/30 hover:bg-white hover:text-[#A62639] active:scale-[0.97]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#E05A6D]/70 transition-transform duration-200 group-hover:scale-110" />
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Visual Stage Container: Apple-grade inset stage */}
      <div className="relative z-10 mt-8 overflow-hidden rounded-[20px] border border-black/[0.04] bg-gradient-to-b from-[#FBF9F9]/80 to-[#F5F1F1]/80 p-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-sm transition-colors duration-300 group-hover:border-black/[0.07] group-hover:bg-[#F5F1F1]/90">
        {visualContent}
      </div>
    </div>
  );
}
