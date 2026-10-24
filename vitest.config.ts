import { defineConfig } from "vitest/config";

// Data layer + utils murni (D-031): environment node, tanpa jsdom/DOM.
// Skema file: tests/**/*.spec.ts (tanpa DB - beda dengan CMS `tests/int/*.int.spec.ts`).
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.spec.ts"],
  },
});
