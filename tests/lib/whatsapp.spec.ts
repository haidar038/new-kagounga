import { describe, expect, it } from "vitest";
import { contactMessage, inquiryMessage, orderMessage, waLink } from "../../src/lib/whatsapp";

describe("waLink", () => {
  it("builds a wa.me link with the encoded message", () => {
    expect(waLink("Halo!")).toBe(`https://wa.me/628111538111?text=${encodeURIComponent("Halo!")}`);
  });
});

describe("message builders", () => {
  it("localizes order messages", () => {
    expect(orderMessage("Popeda Soup", "en")).toContain("Popeda Soup");
    expect(orderMessage("Popeda Soup", "id")).toContain("memesan Popeda Soup");
  });

  it("localizes inquiry messages", () => {
    expect(inquiryMessage("Sago", "B2B", "en")).toContain("Sago (B2B)");
    expect(inquiryMessage("Sago", "B2B", "id")).toContain("mengenai Sago (B2B)");
  });

  it("builds the contact body with subject and message", () => {
    const en = contactMessage("Ana", "ana@x.com", "Halo", "Isi pesan", "en");
    expect(en).toContain("Ana (ana@x.com)");
    expect(en).toContain("Subject: Halo");
    expect(en).toContain("Isi pesan");
    const id = contactMessage("Ana", "ana@x.com", "Halo", "Isi", "id");
    expect(id).toContain("Subjek: Halo");
  });
});
