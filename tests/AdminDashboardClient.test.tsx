import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { getDemoDashboardData } from "@/lib/admin/demo-data";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AdminDashboardClient", () => {
  it("renders overview KPIs and switches cleanly between analytics tabs", () => {
    const demoData = getDemoDashboardData(30);
    render(
      <AdminDashboardClient initialData={demoData} isAuthConfigured={true} />
    );

    expect(screen.getByText(/DuoDate Admin/i)).toBeInTheDocument();
    expect(screen.getByText("Total Downloads")).toBeInTheDocument();
    expect(screen.getByText("Avg Use / User")).toBeInTheDocument();

    // Switch to App Downloads tab
    const downloadsTab = screen.getByRole("tab", { name: /App Downloads/i });
    fireEvent.click(downloadsTab);
    expect(downloadsTab).toHaveAttribute("aria-selected", "true");

    const downloadsPanel = screen.getByRole("tabpanel", {
      name: /App Downloads/i,
    });
    expect(downloadsPanel).not.toHaveAttribute("hidden");
    expect(within(downloadsPanel).getByText("Ethan Cole")).toBeInTheDocument();

    // Filter downloads by search query
    const searchInput = within(downloadsPanel).getByLabelText(
      "Search app downloads"
    );
    fireEvent.change(searchInput, { target: { value: "Sofia" } });
    expect(within(downloadsPanel).getByText("Sofia Reyes")).toBeInTheDocument();
    expect(
      within(downloadsPanel).queryByText("Ethan Cole")
    ).not.toBeInTheDocument();

    // Switch to Usage & Time tab
    const usageTab = screen.getByRole("tab", { name: /Usage & Time/i });
    fireEvent.click(usageTab);
    expect(usageTab).toHaveAttribute("aria-selected", "true");

    const usagePanel = screen.getByRole("tabpanel", { name: /Usage & Time/i });
    expect(usagePanel).not.toHaveAttribute("hidden");
    expect(within(usagePanel).getByText("Maya Lin")).toBeInTheDocument();

    // Switch to Supabase Setup tab
    const setupTab = screen.getByRole("tab", { name: /Supabase Setup/i });
    fireEvent.click(setupTab);
    expect(setupTab).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByText("Supabase Table Connection Status")
    ).toBeInTheDocument();
  });
});
