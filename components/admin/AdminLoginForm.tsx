"use client";

import React, { useId, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm({
  isAuthConfigured,
}: {
  isAuthConfigured: boolean;
}) {
  const router = useRouter();
  const passwordId = useId();
  const hintId = useId();
  const errorId = useId();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const clientInvalid = touched && password.trim().length === 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true);
    setServerError(null);

    if (!password.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setServerError(data.error ?? "Unable to sign in.");
        setSubmitting(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setServerError("Network error while signing in. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate={false}>
      <div className="admin-field">
        <label
          htmlFor={passwordId}
          className="block text-sm font-semibold text-[#1D1D1F]"
        >
          Admin Password
        </label>
        <p id={hintId} className="mt-1 text-xs text-[#6E6E73]">
          Matches <code className="rounded bg-[#F5F5F7] px-1.5 py-0.5 text-[#1D1D1F]">ADMIN_DASHBOARD_PASSWORD</code> in your server environment.
        </p>

        <div className="relative mt-2">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            disabled={!isAuthConfigured || submitting}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (serverError) setServerError(null);
            }}
            onBlur={() => setTouched(true)}
            aria-invalid={clientInvalid || Boolean(serverError)}
            aria-describedby={
              clientInvalid || serverError ? `${hintId} ${errorId}` : hintId
            }
            placeholder="Enter admin password"
            className="admin-input w-full rounded-xl border border-[#E8E8ED] bg-white px-4 py-3 pr-20 text-sm text-[#1D1D1F] placeholder:text-[#98989D] transition-colors focus:border-[#E05A6D] focus:outline-none focus:ring-2 focus:ring-[#E05A6D]/25 disabled:cursor-not-allowed disabled:bg-[#F5F5F7]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#6E6E73] transition-colors hover:bg-[#F5F5F7] hover:text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#E05A6D]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div
          id={errorId}
          role={serverError ? "alert" : undefined}
          className={`mt-2 text-xs font-medium text-[#C94557] ${
            clientInvalid || serverError ? "block" : "admin-error-msg"
          }`}
        >
          <span role="img" aria-label="Error">
            !
          </span>{" "}
          {serverError ?? "Enter your admin dashboard password to continue."}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isAuthConfigured || submitting}
        className="w-full rounded-2xl bg-[#1D1D1F] px-5 py-3 font-heading text-base font-bold text-white transition-all hover:bg-black active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#E05A6D] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
