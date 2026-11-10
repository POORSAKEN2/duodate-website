import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0]/80 bg-[#FBF9F9]/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 md:py-4">
        <Link
          href="/"
          className="group flex items-center gap-2 font-heading text-2xl font-bold tracking-tight text-[#1E293B] transition-colors hover:text-[#E05A6D] focus:outline-none"
        >
          DuoDate
          <span className="inline-block h-2 w-2 rounded-full bg-[#E05A6D]" />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="#features"
            className="hidden text-sm font-medium text-[#64748B] transition-colors hover:text-[#1E293B] sm:inline-block"
          >
            Features
          </Link>
          <Link
            href="#mascots"
            className="hidden text-sm font-medium text-[#64748B] transition-colors hover:text-[#1E293B] sm:inline-block"
          >
            Huff & Chihi
          </Link>
          <a
            href="#download"
            className="rounded-full bg-[#E05A6D] px-5 py-2.5 font-heading text-sm font-semibold tracking-wide text-white shadow-sm transition-all hover:bg-[#C94557] hover:shadow active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#E05A6D] focus:ring-offset-2"
          >
            Download App
          </a>
        </div>
      </div>
    </header>
  );
}
