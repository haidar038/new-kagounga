import { describe, expect, it } from "vitest";
import { formatDateLabel, monthName } from "../../src/lib/format";

describe("formatDateLabel", () => {
  it("formats bare ISO dates per locale (parsed as local midnight)", () => {
    expect(formatDateLabel("2026-01-10", "en")).toBe("10 January 2026");
    expect(formatDateLabel("2026-01-10", "id")).toBe("10 Januari 2026");
  });

  it("formats full ISO timestamps without shifting the day (midday UTC)", () => {
    expect(formatDateLabel("2026-01-10T12:00:00.000Z", "en")).toBe("10 January 2026");
    expect(formatDateLabel("2026-01-10T12:00:00.000Z", "id")).toBe("10 Januari 2026");
  });

  it("returns the raw input when invalid", () => {
    expect(formatDateLabel("not-a-date", "en")).toBe("not-a-date");
  });
});

describe("monthName", () => {
  it("localizes month names", () => {
    expect(monthName(0, "en")).toBe("January");
    expect(monthName(0, "id")).toBe("Januari");
  });
});
