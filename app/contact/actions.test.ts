import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoisted so the vi.mock factory below can reference it.
const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }));

vi.mock("resend", () => ({
  Resend: vi.fn(() => ({ emails: { send: mockSend } })),
}));

import { sendContactEmail, type ContactState } from "./actions";

const idle: ContactState = { status: "idle" };

function fd(fields: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
}

// A valid, human-paced submission (timestamp 5s in the past).
function validForm(overrides: Record<string, string> = {}): FormData {
  return fd({
    name: "Jane",
    email: "jane@example.com",
    message: "Hello there",
    _ts: String(Date.now() - 5000),
    ...overrides,
  });
}

beforeEach(() => {
  mockSend.mockReset();
  mockSend.mockResolvedValue({ data: { id: "email-1" }, error: null });
  process.env.RESEND_API_KEY = "test-key";
});

describe("sendContactEmail", () => {
  it("sends and returns ok for a valid submission", async () => {
    const state = await sendContactEmail(idle, validForm());
    expect(state.status).toBe("ok");
    expect(mockSend).toHaveBeenCalledOnce();
    const payload = mockSend.mock.calls[0][0];
    expect(payload.to).toBe("hello@a11.studio");
    expect(payload.replyTo).toBe("jane@example.com");
    expect(payload.text).toContain("Hello there");
  });

  it("silently drops a honeypot hit without sending", async () => {
    const state = await sendContactEmail(idle, validForm({ _gotcha: "i am a bot" }));
    expect(state.status).toBe("ok");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("silently drops a too-fast submit without sending", async () => {
    const state = await sendContactEmail(idle, validForm({ _ts: String(Date.now()) }));
    expect(state.status).toBe("ok");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns field errors and does not send invalid input", async () => {
    const state = await sendContactEmail(idle, validForm({ name: "", email: "bad" }));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.name).toBeDefined();
    expect(state.fieldErrors?.email).toBeDefined();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns a fallback error and does not send when the API key is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const state = await sendContactEmail(idle, validForm());
    expect(state.status).toBe("error");
    expect(state.message).toContain("hello@a11.studio");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns a fallback error when Resend reports an error", async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: "rejected" } });
    const state = await sendContactEmail(idle, validForm());
    expect(state.status).toBe("error");
    expect(state.message).toContain("hello@a11.studio");
  });

  it("returns a fallback error when the send throws", async () => {
    mockSend.mockRejectedValue(new Error("network down"));
    const state = await sendContactEmail(idle, validForm());
    expect(state.status).toBe("error");
    expect(state.message).toContain("hello@a11.studio");
  });
});
