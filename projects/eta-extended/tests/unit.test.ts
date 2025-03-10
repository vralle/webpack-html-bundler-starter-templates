import { beforeEach, describe, expect, it } from "@jest/globals";
import { EtaFileResolutionError } from "eta";
import fs from "node:fs";
import { join } from "node:path";
import EtaExtended, { type EtaExtendedConfig } from "../src/index";

describe("EtaExtended Unit Tests", () => {
  const templateDir = join(__dirname, "__fixtures__");
  let etaExtended: EtaExtended;

  beforeEach(() => {
    etaExtended = new EtaExtended();
  });

  describe("constructor", () => {
    it("should initialize with default config", () => {
      expect(etaExtended.markdownIt).toBeDefined();
      expect(etaExtended.config).toBeDefined();
    });

    it("should initialize with custom markdown-it config", () => {
      const config: EtaExtendedConfig = {
        markdownItConfig: {
          html: true,
          breaks: true,
        },
      };
      etaExtended = new EtaExtended(config);
      expect(etaExtended.markdownIt.options.html).toBe(true);
      expect(etaExtended.markdownIt.options.breaks).toBe(true);
    });

    it("should initialize with custom eta config", () => {
      const config: EtaExtendedConfig = {
        tags: ["{{", "}}"],
        autoEscape: false,
      };
      etaExtended = new EtaExtended(config);
      expect(etaExtended.config.tags).toEqual(["{{", "}}"]);
      expect(etaExtended.config.autoEscape).toBe(false);
    });

    it("should merge markdown-it and eta configs correctly", () => {
      const config: EtaExtendedConfig = {
        tags: ["{{", "}}"],
        markdownItConfig: {
          html: true,
        },
      };
      etaExtended = new EtaExtended(config);
      expect(etaExtended.config.tags).toEqual(["{{", "}}"]);
      expect(etaExtended.markdownIt.options.html).toBe(true);
      expect(etaExtended.config).not.toHaveProperty("markdownItConfig");
    });
  });

  describe("readFile", () => {
    it("should render markdown into html", () => {
      const result = etaExtended.readFile(join(templateDir, "simple.md"));
      expect(result).toContain("<h1>Hello</h1>");
      expect(result).toContain("<p>This is a test</p>");
    });

    it("should read regular template", () => {
      const result = etaExtended.readFile(join(templateDir, "simple.eta"));
      expect(result).toContain("<h1>Title</h1>");
    });

    describe("error handling", () => {
      it("throws error for missing template", () => {
        expect(() => etaExtended.readFile("nonexistent.md"))
          .toThrow(EtaFileResolutionError);
        expect(() => etaExtended.readFile("nonexistent.md"))
          .toThrow("Could not find template: nonexistent.md");
      });

      it("should propagate other fs errors", () => {
        const mockReadFileSync = jest.spyOn(fs, "readFileSync");
        mockReadFileSync.mockImplementation(() => {
          throw new Error("Permission denied");
        });

        expect(() => etaExtended.readFile("denied.md"))
          .toThrow("Permission denied");
        mockReadFileSync.mockClear();
      });
    });

    describe("file extension handling", () => {
      const mockReadFileSync = jest.spyOn(fs, "readFileSync");

      beforeEach(() => {
        mockReadFileSync.mockReturnValue("# Test");
      });

      afterEach(() => {
        mockReadFileSync.mockClear();
      });

      it("should handle mixed case extensions", () => {
        const result = etaExtended.readFile("test.Md");
        expect(result).toContain("<h1>Test</h1>");
      });

      it("should handle files with multiple dots", () => {
        const result = etaExtended.readFile("test.special.md");
        expect(result).toContain("<h1>Test</h1>");
      });
    });
  });
});
