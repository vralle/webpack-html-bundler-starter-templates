import { EtaFileResolutionError } from "eta";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EtaExtended, { type EtaExtendedConfig } from "../src/index";

const FIXTURES_DIR = join(__dirname, "__fixtures__");

describe("Unit Tests", () => {
  let etaExtended: EtaExtended;

  beforeEach(() => {
    etaExtended = new EtaExtended();
  });

  afterEach(() => {
    vi.clearAllMocks();
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
        },
      };
      etaExtended = new EtaExtended(config);
      expect(etaExtended.markdownIt.options.html).toBe(true);
    });

    it("should initialize with custom eta config", () => {
      const config: EtaExtendedConfig = {
        autoEscape: false,
      };
      etaExtended = new EtaExtended(config);
      expect(etaExtended.config.autoEscape).toBe(false);
    });
  });

  describe("readFile", () => {
    it("should render markdown into html", () => {
      const result = etaExtended.readFile(join(FIXTURES_DIR, "simple.md"));
      expect(result).toContain("<h1>Hello</h1>");
      expect(result).toContain("<p>This is a test</p>");
    });

    it("should read regular template", () => {
      const result = etaExtended.readFile(join(FIXTURES_DIR, "simple.eta"));
      expect(result).toContain("<h1>{{= title }}</h1>");
    });

    describe("error handling", () => {
      it("throws error for missing template", () => {
        expect(() => etaExtended.readFile("nonexistent.md"))
          .toThrow(EtaFileResolutionError);
        expect(() => etaExtended.readFile("nonexistent.md"))
          .toThrow("Could not find template: nonexistent.md");
      });
    });
  });
});
