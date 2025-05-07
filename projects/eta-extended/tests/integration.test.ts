import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EtaExtended from "../src/index";

const FIXTURES_DIR = join(__dirname, "__fixtures__");

describe("Integration Tests", () => {
  let etaExtended: EtaExtended;

  beforeEach(() => {
    etaExtended = new EtaExtended({
      views: FIXTURES_DIR,
      tags: ["{{", "}}"],
      useWith: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("render", () => {
    it("should render markdown into html", () => {
      const result = etaExtended.render("simple.md", {});
      expect(result).toContain("<h1>Hello</h1>");
      expect(result).toContain("<p>This is a test</p>");
    });

    it("should render data in markdown", () => {
      const result = etaExtended.render("data.md", { title: "Hello" });
      expect(result).toContain("<h1>Hello</h1>");
    });

    it("should render ETA template", () => {
      const result = etaExtended.render("simple", { title: "Hello" });
      expect(result).toContain("<h1>Hello</h1>");
    });

    it("should include markdown in ETA", () => {
      const result = etaExtended.render("import-simple-md", {});
      expect(result).toContain("<h1>Hello</h1>");
      expect(result).toContain("<p>This is a test</p>");
    });

    it("should pass data to included markdown", () => {
      const result = etaExtended.render("import-data-md", { title: "Hello" });
      expect(result).toContain("<h1>Hello</h1>");
    });
  });
});
