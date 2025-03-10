import { describe, expect, it } from "@jest/globals";
import { join } from "node:path";
import EtaExtended from "../src/index";

describe("EtaExtended Integration Tests", () => {
  const templateDir = join(__dirname, "__fixtures__");
  const eta = new EtaExtended({
    views: templateDir,
    tags: ["{{", "}}"],
  });

  describe("render", () => {
    describe("markdown", () => {
      it("should render into html", () => {
        const result = eta.render("simple.md", {});

        expect(result).toContain("<h1>Hello</h1>");
        expect(result).toContain("<p>This is a test</p>");
      });

      it("should render data", () => {
        const result = eta.render("data.md", { title: "Hello World" });
        expect(result).toContain("<h1>Hello World</h1>");
      });
    });

    describe("regular templates", () => {
      it("should read regular template", () => {
        const result = eta.render("simple.eta", {});
        expect(result).toContain("<h1>Title</h1>");
      });

      it("should render markdown part into html", () => {
        const result = eta.render("import.eta", {});
        expect(result).toContain("<h1>Hello</h1>");
        expect(result).toContain("<p>This is a test</p>");
      });

      it("should render data inside markdown part", () => {
        const result = eta.render("import-data.eta", { title: "Hello World" });
        expect(result).toContain("<h1>Hello World</h1>");
      });
    });
  });

  describe("error handling", () => {
    it("throws error for missing template", () => {
      expect(() => {
        eta.render("non-existent.md", {});
      }).toThrow("Could not find template");
    });
  });
});
