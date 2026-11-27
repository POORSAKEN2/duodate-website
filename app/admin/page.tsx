import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { fetchAdminDashboardData } from "@/lib/admin/analytics";
import {
  isAdminAuthConfigured,
  isAdminAuthenticated,
} from "@/lib/admin/auth";
import { getDemoDashboardData } from "@/lib/admin/demo-data";
import { getSupabaseConfigStatus } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Analytics • DuoDate",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const wantsDemo = params.demo === "1";
  const rawDays = Number(typeof params.days === "string" ? params.days : "30");
  const rangeDays = Number.isFinite(rawDays)
    ? Math.min(Math.max(rawDays, 7), 90)
    : 30;

  const authConfigured = isAdminAuthConfigured();
  const authed = await isAdminAuthenticated();
  const supabaseStatus = getSupabaseConfigStatus();

  // Allow demo preview only if explicitly requested while unconfigured OR while authenticated
  if (wantsDemo && (!authConfigured || authed)) {
    return (
      <AdminDashboardClient
        initialData={getDemoDashboardData(rangeDays)}
        isAuthConfigured={authConfigured && authed}
      />
    );
  }

  if (!authConfigured || !authed) {
    redirect("/admin/login");
  }

  const liveData = await fetchAdminDashboardData(rangeDays);

  if (!liveData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] px-4 py-12">
        <div className="w-full max-w-xl rounded-3xl border border-[#E8E8ED] bg-white p-6 shadow-sm sm:p-8">
          <span className="inline-flex rounded-full bg-[#FCE7EB] px-3 py-1 text-xs font-semibold text-[#A62639]">
            Supabase Connection Needed
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold text-[#1D1D1F]">
            Connect your Supabase project
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#6E6E73]">
            You&apos;re signed in, but the server still needs your Supabase URL and Service Role key in{" "}
            <code className="rounded bg-[#F5F5F7] px-1.5 py-0.5 text-[#1D1D1F]">.env.local</code>.
          </p>

          <ul className="mt-5 space-y-2 text-xs text-[#1D1D1F]">
            <li className="flex items-center justify-between rounded-2xl bg-[#F5F5F7] px-4 py-3">
              <code>NEXT_PUBLIC_SUPABASE_URL</code>
              <span className={supabaseStatus.hasUrl ? "font-semibold text-[#146C34]" : "font-semibold text-[#C94557]"}>
                {supabaseStatus.hasUrl ? "Set" : "Missing"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-2xl bg-[#F5F5F7] px-4 py-3">
              <code>SUPABASE_SERVICE_ROLE_KEY</code>
              <span className={supabaseStatus.hasServiceRoleKey ? "font-semibold text-[#146C34]" : "font-semibold text-[#C94557]"}>
                {supabaseStatus.hasServiceRoleKey ? "Set" : "Missing"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-2xl bg-[#F5F5F7] px-4 py-3">
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              <span className={supabaseStatus.hasAnonKey ? "font-semibold text-[#146C34]" : "font-semibold text-[#6E6E73]"}>
                {supabaseStatus.hasAnonKey ? "Set" : "Optional"}
              </span>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin?demo=1"
              className="rounded-2xl bg-[#1D1D1F] px-5 py-2.5 font-heading text-sm font-bold text-white hover:bg-black"
            >
              Preview with Sample Data
            </Link>
            <Link
              href="/admin"
              className="rounded-2xl border border-[#E8E8ED] bg-white px-5 py-2.5 font-heading text-sm font-bold text-[#1D1D1F] hover:bg-[#F5F5F7]"
            >
              Retry Connection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardClient
      initialData={liveData}
      isAuthConfigured={authConfigured}
    />
  );
}
