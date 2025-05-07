import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "nu-html-checker",
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
