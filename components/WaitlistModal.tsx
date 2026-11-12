"use client";

import React, { useEffect, useState } from "react";

const WAITLIST_ENDPOINT = "https://formsubmit.co/ajax/jaldevecais2@gmail.com";

type Status = "idle" | "sending" | "sent" | "error";

export default function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          _subject: "DuoDate waitlist signup",
        }),
      });
      if (!res.ok) throw new Error(`FormSubmit responded ${res.status}`);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 text-left shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3
            id="waitlist-title"
            className="font-heading text-2xl font-bold text-[#1D1D1F]"
          >
            Join the waitlist
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1 text-[#6E6E73] transition-colors hover:bg-[#F5F5F7] hover:text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#E05A6D]"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {status === "sent" ? (
          <p className="mt-4 text-[#1D1D1F]">
            You&apos;re on the list! We&apos;ll email you personally the moment
            DuoDate is ready.
          </p>
        ) : (
          <>
            <p className="mt-3 text-sm leading-relaxed text-[#6E6E73]">
              DuoDate isn&apos;t out yet — and due to a limited budget, it will
              launch on Android (Google Play) first. Leave your email and
              we&apos;ll personally email you the moment the app is ready.
            </p>

            <form
              data-testid="waitlist-form"
              onSubmit={handleSubmit}
              className="mt-5"
            >
              <label
                htmlFor="waitlist-email"
                className="block text-sm font-medium text-[#1D1D1F]"
              >
                Email
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-[#1D1D1F] placeholder:text-neutral-400 focus:border-[#E05A6D] focus:outline-none focus:ring-2 focus:ring-[#E05A6D]/30"
              />

              {status === "error" && (
                <p className="mt-3 text-sm text-red-600">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-5 w-full rounded-2xl bg-[#111827] px-5 py-3 font-heading font-bold text-white transition-all hover:bg-black disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#E05A6D] focus:ring-offset-2"
              >
                {status === "sending" ? "Joining…" : "Join waitlist"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
