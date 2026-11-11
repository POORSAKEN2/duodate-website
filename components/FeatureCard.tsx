import React from "react";

export interface FeatureCardProps {
  title: string;
  description: string;
  visualContent: React.ReactNode;
  className?: string;
}

export default function FeatureCard({
  title,
  description,
  visualContent,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/80 p-6 sm:p-8 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#E05A6D]/25 hover:shadow-[0_20px_40px_-15px_rgba(224,90,109,0.12),0_8px_20px_rgba(0,0,0,0.04)] ${className}`}
    >
      {/* Specular rim highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
      />

      <div className="relative z-10">
        <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-[#1D1D1F] sm:text-[26px]">
          {title}
        </h3>

        <p className="mt-2.5 text-[15px] leading-relaxed text-[#6E6E73]">
          {description}
        </p>
      </div>

      {/* Visual stage */}
      <div className="relative z-10 mt-8 flex flex-1 flex-col justify-center">
        {visualContent}
      </div>
    </div>
  );
}
