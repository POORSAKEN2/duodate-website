import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StoreBadges from "@/components/StoreBadges";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("StoreBadges — public release", () => {
  it("renders store links when publicRelease is true", () => {
    render(<StoreBadges publicRelease={true} />);

    const appStore = screen.getByRole("link", { name: /Download on the App Store/i });
    const googlePlay = screen.getByRole("link", { name: /Get it on Google Play/i });
    expect(appStore).toHaveAttribute("href", expect.stringContaining("apps.apple.com"));
    expect(googlePlay).toHaveAttribute("href", expect.stringContaining("play.google.com"));
  });

  it("renders no dialog when publicRelease is true", () => {
    render(<StoreBadges publicRelease={true} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("StoreBadges — waitlist mode", () => {
  it("renders buttons instead of links when publicRelease is false", () => {
    render(<StoreBadges publicRelease={false} />);

    expect(screen.getByRole("button", { name: /Download on the App Store/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Get it on Google Play/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /App Store/i })).not.toBeInTheDocument();
  });

  it("opens waitlist modal with email field and Android-first note on badge click", () => {
    render(<StoreBadges publicRelease={false} />);

    fireEvent.click(screen.getByRole("button", { name: /Get it on Google Play/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByText(/due to (a )?limited budget/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Android/)).toBeInTheDocument();
  });

  it("submits email to FormSubmit and shows success message", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);

    render(<StoreBadges publicRelease={false} />);
    fireEvent.click(screen.getByRole("button", { name: /Download on the App Store/i }));
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "fan@example.com" },
    });
    fireEvent.submit(screen.getByTestId("waitlist-form"));

    await waitFor(() => {
      expect(screen.getByText(/you're on the list/i)).toBeInTheDocument();
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://formsubmit.co/ajax/jaldevecais2@gmail.com",
      expect.objectContaining({ method: "POST" })
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.email).toBe("fan@example.com");
  });

  it("shows an error message when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    render(<StoreBadges publicRelease={false} />);
    fireEvent.click(screen.getByRole("button", { name: /Get it on Google Play/i }));
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "fan@example.com" },
    });
    fireEvent.submit(screen.getByTestId("waitlist-form"));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it("closes the modal with the close button", () => {
    render(<StoreBadges publicRelease={false} />);
    fireEvent.click(screen.getByRole("button", { name: /Get it on Google Play/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
