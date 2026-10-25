import { describe, expect, it } from "vitest";
import { COLLABORATORS, getCollaborators } from "../../src/data/collaborators";
import idAbout from "../../src/locales/id/about.json";

const ID_ROLES = (idAbout as { roles?: Record<string, { role?: string; alt?: string }> }).roles ?? {};

describe("collaborators", () => {
  // Regresi rename "Joshua" -> "Jae": overlay ID dicocokkan berdasarkan nama;
  // key locale yang tidak ikut diganti membuat entri kehilangan role/alt ID.
  it("setiap nama kolaborator punya key overlay di locale ID", () => {
    const keys = Object.keys(ID_ROLES);
    for (const c of COLLABORATORS) {
      expect(keys, `roles.ID tidak punya key "${c.name}"`).toContain(c.name);
    }
    expect(keys).toHaveLength(COLLABORATORS.length);
  });

  it("locale ID menerapkan overlay role/alt Indonesia", () => {
    const jae = getCollaborators("id").find((c) => c.name === "Jae");
    expect(jae?.role).toBe("Seniman Visual");
    expect(jae?.alt).toBe("Potret Jae");
  });

  it("locale EN memakai nilai dasar tanpa overlay", () => {
    expect(getCollaborators("en")).toEqual(COLLABORATORS);
  });
});
