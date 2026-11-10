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
    <div className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all hover:border-[#E05A6D]/40 hover:shadow-md sm:p-8">
      <div>
        <span className="inline-block rounded-full bg-[#FCE7EB] px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-[#E05A6D]">
          {tag}
        </span>
        <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight text-[#1E293B]">
          {title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-[#64748B]">
          {description}
        </p>

        {/* Feature Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {pills.map((pill) => (
            <span
              key={pill}
              className="rounded-lg border border-[#E2E8F0] bg-[#FBF9F9] px-2.5 py-1 text-xs font-medium text-[#1E293B]"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FBF9F9] p-4">
        {visualContent}
      </div>
    </div>
  );
}
