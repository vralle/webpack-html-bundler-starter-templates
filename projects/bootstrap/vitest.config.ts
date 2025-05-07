import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "Bootstrap Classic",
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
