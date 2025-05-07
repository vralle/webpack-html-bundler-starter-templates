import fs from "node:fs";
import path from "node:path";
import { afterAll, describe, expect, test } from "vitest";
import webpackConfig from "../webpack.config.mjs";
import compile from "./helpers/compile";

const OUTPUT_DIR = path.join("..", "dist");

describe("compilation", () => {
  afterAll(() => {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  });

  test("should compile without errors", async () => {
    const stats = await compile({ ...webpackConfig, stats: "errors-warnings" });
    expect(stats.hasErrors()).toBe(false);
  });
});
