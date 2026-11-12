"use client";

import React, { useState } from "react";
import WaitlistModal from "./WaitlistModal";

// shortcut: placeholder store URLs, replace with real listing URLs at launch
const APP_STORE_URL = "https://apps.apple.com/app/duodate";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.duodate.app";

type Variant = "hero" | "cta";

const badgeClass: Record<Variant, string> = {
  hero: "group inline-flex items-center gap-3 rounded-2xl border border-neutral-800 bg-[#111827] px-5 py-2.5 text-white shadow-sm transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#E05A6D] focus:ring-offset-2",
  cta: "group inline-flex items-center gap-3 rounded-2xl bg-[#111827] px-5 py-3 text-white transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#E05A6D] focus:ring-offset-2",
};

function AppStoreBadgeContent() {
  return (
    <>
      <svg className="h-7 w-7 flex-shrink-0 fill-white" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.04-1.77.92-2.81-.9.04-2 .6-2.63 1.34-.56.64-1.05 1.69-.92 2.7.99.08 2.02-.49 2.63-1.23z" />
      </svg>
      <div className="text-left">
        <div className="text-[11px] font-medium leading-tight text-neutral-300">
          Download on the
        </div>
        <div className="font-heading text-base font-bold leading-tight text-white">
          App Store
        </div>
      </div>
    </>
  );
}

function GooglePlayBadgeContent() {
  return (
    <>
      <svg className="h-6 w-6 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M3.609 1.814L13.792 12 3.61 22.186a2.003 2.003 0 0 1-.61-1.428V3.242c0-.53.224-1.039.609-1.428z"
        />
        <path
          fill="#EA4335"
          d="M14.851 13.058l2.585 2.585-11.75 6.786 9.165-9.371z"
        />
        <path
          fill="#34A853"
          d="M14.851 10.942L5.686 1.571l11.75 6.786-2.585 2.585z"
        />
        <path
          fill="#FBBC04"
          d="M16.323 12l3.682 2.127a1.696 1.696 0 0 0 0-2.937L16.323 12z"
        />
      </svg>
      <div className="text-left">
        <div className="text-[11px] font-medium leading-tight text-neutral-300">
          Get it on
        </div>
        <div className="font-heading text-base font-bold leading-tight text-white">
          Google Play
        </div>
      </div>
    </>
  );
}

export default function StoreBadges({
  publicRelease,
  variant = "hero",
}: {
  publicRelease: boolean;
  variant?: Variant;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const className = badgeClass[variant];

  const badges: Array<{
    label: string;
    href: string;
    content: React.ReactNode;
  }> = [
    {
      label: "Download on the App Store",
      href: APP_STORE_URL,
      content: <AppStoreBadgeContent />,
    },
    {
      label: "Get it on Google Play",
      href: PLAY_STORE_URL,
      content: <GooglePlayBadgeContent />,
    },
  ];

  return (
    <>
      {badges.map((badge) =>
        publicRelease ? (
          <a
            key={badge.label}
            href={badge.href}
            className={className}
            aria-label={badge.label}
          >
            {badge.content}
          </a>
        ) : (
          <button
            key={badge.label}
            type="button"
            className={className}
            aria-label={badge.label}
            onClick={() => setModalOpen(true)}
          >
            {badge.content}
          </button>
        )
      )}
      {modalOpen && <WaitlistModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
