import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { fetchAdminDashboardData } from "@/lib/admin/analytics";
import { getDemoDashboardData } from "@/lib/admin/demo-data";

export async function GET(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const daysParam = Number(url.searchParams.get("days") ?? "30");
  const rangeDays = Number.isFinite(daysParam)
    ? Math.min(Math.max(daysParam, 7), 90)
    : 30;
  const demo = url.searchParams.get("demo") === "1";

  if (demo) {
    return NextResponse.json(getDemoDashboardData(rangeDays));
  }

  const data = await fetchAdminDashboardData(rangeDays);
  if (!data) {
    return NextResponse.json(
      { error: "Supabase credentials are not configured." },
      { status: 503 }
    );
  }

  return NextResponse.json(data);
}
