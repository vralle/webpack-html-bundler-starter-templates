import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "TailwindCSS",
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
