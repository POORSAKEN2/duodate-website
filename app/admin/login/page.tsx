import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import {
  isAdminAuthConfigured,
  isAdminAuthenticated,
} from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin Sign In • DuoDate",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const authConfigured = isAdminAuthConfigured();
  const authed = await isAdminAuthenticated();
  if (authConfigured && authed) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F5F7] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#E8E8ED] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-heading text-base font-bold text-[#1D1D1F] hover:text-[#E05A6D]"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#E05A6D] text-xs font-bold text-white">
              D
            </span>
            DuoDate
          </Link>
          <span className="rounded-full bg-[#FCE7EB] px-2.5 py-0.5 text-[11px] font-semibold text-[#A62639]">
            Admin
          </span>
        </div>

        <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight text-[#1D1D1F]">
          Analytics Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-[#6E6E73]">
          Sign in to inspect app downloads, user session times, and couple analytics.
        </p>

        {!authConfigured && (
          <div className="mt-5 rounded-2xl border border-[#F59E0B]/40 bg-[#FFFBEB] p-4 text-xs text-[#78350F]">
            <p className="font-semibold text-[#92400E]">
              Server setup required
            </p>
            <p className="mt-1 leading-relaxed">
              Add <code className="font-semibold">ADMIN_DASHBOARD_PASSWORD</code> and your Supabase keys to{" "}
              <code>.env.local</code>, then restart the server.
            </p>
            <Link
              href="/admin?demo=1"
              className="mt-3 inline-flex items-center rounded-xl bg-[#92400E] px-3 py-1.5 font-semibold text-white hover:bg-[#78350F]"
            >
              Preview Dashboard with Sample Data
            </Link>
          </div>
        )}

        <AdminLoginForm isAuthConfigured={authConfigured} />

        <div className="mt-6 border-t border-[#F2F2F6] pt-4 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-[#6E6E73] hover:text-[#1D1D1F]"
          >
            &larr; Back to duodate.app
          </Link>
        </div>
      </div>
    </div>
  );
}
