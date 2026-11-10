import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white py-12 px-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Brand Column */}
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span className="font-heading text-xl font-bold tracking-tight text-[#1E293B]">
              DuoDate
            </span>
            <span className="inline-block h-2 w-2 rounded-full bg-[#E05A6D]" />
          </div>
          <p className="mt-1 text-sm text-[#64748B]">
            Built exclusively for couples who still date each other.
          </p>
        </div>

        {/* Links Bar */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#64748B]"
        >
          <Link href="#privacy" className="transition-colors hover:text-[#1E293B]">
            Privacy Policy
          </Link>
          <Link href="#terms" className="transition-colors hover:text-[#1E293B]">
            Terms of Service
          </Link>
          <Link href="#support" className="transition-colors hover:text-[#1E293B]">
            Support
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#1E293B]"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#1E293B]"
          >
            TikTok
          </a>
        </nav>

        {/* Copyright */}
        <div className="text-center text-xs text-[#64748B] sm:text-right">
          © 2026 DuoDate. All rights reserved. Built strictly for two.
        </div>
      </div>
    </footer>
  );
}
