import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:h-14 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-heading text-lg font-bold tracking-tight text-[#1D1D1F] transition-colors hover:text-[#E05A6D] focus:outline-none"
        >
          DuoDate
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E05A6D]" />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/#features"
            className="hidden text-xs font-medium text-[#6E6E73] transition-colors hover:text-[#1D1D1F] sm:inline-block"
          >
            Features
          </Link>
          <Link
            href="/#mascots"
            className="hidden text-xs font-medium text-[#6E6E73] transition-colors hover:text-[#1D1D1F] sm:inline-block"
          >
            Huff &amp; Chihi
          </Link>
          <a
            href="/#download"
            className="rounded-full bg-[#E05A6D] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#C94557] focus:outline-none focus:ring-2 focus:ring-[#E05A6D] focus:ring-offset-2"
          >
            Download
          </a>
        </div>
      </div>
    </header>
  );
}
