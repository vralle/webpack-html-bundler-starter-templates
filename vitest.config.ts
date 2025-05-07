import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    workspace: ["projects/*/vitest.config.ts"],
  },
});
