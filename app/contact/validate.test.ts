import { describe, it, expect } from "vitest";
import { validate, isHoneypotTripped, isTooFast, MIN_SUBMIT_MS } from "./validate";

function fd(fields: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
}

const base = { name: "Jane", email: "jane@example.com", message: "Hello there" };

describe("validate", () => {
  it("accepts a fully valid submission and trims values", () => {
    const result = validate(fd({ name: "  Jane  ", email: "jane@example.com", message: "  Hi  " }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ name: "Jane", email: "jane@example.com", message: "Hi" });
    }
  });

  it("rejects an empty name", () => {
    const result = validate(fd({ ...base, name: "   " }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeDefined();
  });

  it("rejects an over-long name", () => {
    const result = validate(fd({ ...base, name: "a".repeat(201) }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeDefined();
  });

  it("rejects an invalid email", () => {
    for (const bad of ["nope", "a@b", "a b@c.com", "@x.com", "x@.com"]) {
      const result = validate(fd({ ...base, email: bad }));
      expect(result.ok, `expected "${bad}" to be invalid`).toBe(false);
      if (!result.ok) expect(result.errors.email).toBeDefined();
    }
  });

  it("rejects an empty message", () => {
    const result = validate(fd({ ...base, message: "  " }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBeDefined();
  });

  it("rejects an over-long message", () => {
    const result = validate(fd({ ...base, message: "a".repeat(5001) }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBeDefined();
  });

  it("reports multiple errors at once", () => {
    const result = validate(fd({ name: "", email: "bad", message: "" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.message).toBeDefined();
    }
  });
});

describe("isHoneypotTripped", () => {
  it("is true when the hidden field has any content", () => {
    expect(isHoneypotTripped("anything")).toBe(true);
  });
  it("is false for empty, whitespace, or missing", () => {
    expect(isHoneypotTripped("")).toBe(false);
    expect(isHoneypotTripped("   ")).toBe(false);
    expect(isHoneypotTripped(null)).toBe(false);
  });
});

describe("isTooFast", () => {
  const now = 1_000_000;
  it("is true for a submit faster than the minimum", () => {
    expect(isTooFast(String(now - (MIN_SUBMIT_MS - 1)), now)).toBe(true);
  });
  it("is false for a submit slower than the minimum", () => {
    expect(isTooFast(String(now - (MIN_SUBMIT_MS + 1)), now)).toBe(false);
  });
  it("fails open (false) for missing or unparseable timestamps", () => {
    expect(isTooFast(null, now)).toBe(false);
    expect(isTooFast("", now)).toBe(false);
    expect(isTooFast("not-a-number", now)).toBe(false);
    expect(isTooFast("0", now)).toBe(false);
  });
});
