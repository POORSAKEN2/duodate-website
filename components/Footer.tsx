import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-xs text-[#6E6E73] sm:flex-row">
        {/* Brand */}
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center gap-1.5 sm:justify-start">
            <span className="font-heading text-base font-bold tracking-tight text-[#1D1D1F]">
              DuoDate
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E05A6D]" />
          </div>
          <p className="mt-1">
            Built exclusively for couples who still date each other.
          </p>
        </div>

        {/* Links */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-5"
        >
          <Link href="#privacy" className="transition-colors hover:text-[#1D1D1F]">
            Privacy Policy
          </Link>
          <Link href="#terms" className="transition-colors hover:text-[#1D1D1F]">
            Terms of Service
          </Link>
          <Link href="#support" className="transition-colors hover:text-[#1D1D1F]">
            Support
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#1D1D1F]"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#1D1D1F]"
          >
            TikTok
          </a>
        </nav>

        {/* Copyright */}
        <div className="text-center sm:text-right">
          © 2026 DuoDate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
