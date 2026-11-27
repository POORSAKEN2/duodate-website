import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

afterEach(() => {
  vi.restoreAllMocks();
  pushMock.mockReset();
  refreshMock.mockReset();
});

describe("AdminLoginForm", () => {
  it("renders accessible password field with autocomplete and toggle", () => {
    render(<AdminLoginForm isAuthConfigured={true} />);

    const input = screen.getByLabelText("Admin Password");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("autocomplete", "current-password");
    expect(input).toBeRequired();

    const toggle = screen.getByRole("button", { name: /show password/i });
    fireEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
  });

  it("displays an error alert when authentication fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Incorrect admin password." }),
      })
    );

    render(<AdminLoginForm isAuthConfigured={true} />);
    fireEvent.change(screen.getByLabelText("Admin Password"), {
      target: { value: "bad-pass" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Sign In" }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Incorrect admin password."
      );
    });
  });

  it("redirects to /admin on successful sign in", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      })
    );

    render(<AdminLoginForm isAuthConfigured={true} />);
    fireEvent.change(screen.getByLabelText("Admin Password"), {
      target: { value: "good-pass" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Sign In" }).closest("form")!);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/admin");
    });
  });
});
