import { type ChildProcess, execFile, spawn } from "node:child_process";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import validate, { defaultLogger, type VnuReport } from "../src/index";

vi.mock("node:child_process", () => ({
  execFile: vi.fn(),
  spawn: vi.fn(),
}));

describe("Unit Tests", () => {
  let mockExecFile: ReturnType<typeof vi.fn>;
  let mockSpawn: ReturnType<typeof vi.fn>;
  const mockConsole = {
    error: vi.fn(),
    info: vi.fn(),
    log: vi.fn(),
  };

  const createMockChildProcess = (): ChildProcess => ({
    stdin: { write: vi.fn(), end: vi.fn() },
    stdout: { on: vi.fn() },
    stderr: { on: vi.fn() },
    on: vi.fn((event, callback) => {
      if (event === "close") setTimeout(() => callback(0), 10);
      return this;
    }),
    kill: vi.fn(),
  } as unknown as ChildProcess);

  const mockJavaVersion = (version: string) => {
    mockExecFile.mockImplementation((_cmd, _args, _opts, callback) => {
      if (callback) {
        callback(null, "", `java version "${version}"`);
      }
      return {} as ChildProcess;
    });
  };

  const setupValidationTest = (javaVersion = "11.0.12") => {
    mockJavaVersion(javaVersion);
    const mockChildProcess = createMockChildProcess();
    mockSpawn.mockReturnValue(mockChildProcess);
    return mockChildProcess;
  };

  beforeEach(() => {
    mockExecFile = vi.mocked(execFile);
    mockSpawn = vi.mocked(spawn);

    vi.spyOn(process, "exit").mockImplementation((code?: number | string | null) => {
      throw new Error(`process.exit unexpectedly called with "${code}"`);
    });

    vi.spyOn(console, "error").mockImplementation(mockConsole.error);
    vi.spyOn(console, "info").mockImplementation(mockConsole.info);
    vi.spyOn(console, "log").mockImplementation(mockConsole.log);

    vi.clearAllMocks();
    setupValidationTest();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("validate function", () => {
    test("should proceed with validation for valid Java version", async () => {
      setupValidationTest();

      validate(["test.html"]);

      expect(mockSpawn).toHaveBeenCalledOnce();
      expect(mockSpawn).toHaveBeenCalledWith(
        "java",
        expect.arrayContaining(["-jar"]),
        expect.objectContaining({
          stdio: expect.anything(),
        }),
      );

      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining("Nu validation start running"),
      );
    });

    test("should exit with error when Java is not available", () => {
      mockExecFile.mockImplementation((_cmd, _args, _opts, callback) => {
        if (callback) {
          callback(new Error("Java not found"), "", "");
        }
        return {} as ChildProcess;
      });

      expect(() => validate(["test.html"])).toThrow('process.exit unexpectedly called with "1"');
      expect(mockConsole.error).toHaveBeenCalledWith(expect.stringContaining("Java is missing"));
    });

    test("should exit with error for unsupported Java version", () => {
      setupValidationTest("1.7.0_80");

      expect(() => validate(["test.html"])).toThrow('process.exit unexpectedly called with "1"');
      expect(mockConsole.error).toHaveBeenCalledWith(expect.stringContaining("Unsupported Java version"));
    });

    test("should exit with error when no files provided", () => {
      expect(() => validate([])).toThrow('process.exit unexpectedly called with "1"');
      expect(mockConsole.error).toHaveBeenCalledWith(expect.stringContaining("No files to check"));
    });
  });

  describe("validate with custom options", () => {
    test("should use custom logger when provided", () => {
      const customLogger = vi.fn();
      setupValidationTest();

      validate(["test.html"], { logger: customLogger });
      expect(mockSpawn).toHaveBeenCalled();
    });

    test("should use custom ignores when provided", () => {
      const customIgnores = ["custom-ignore-pattern"];
      setupValidationTest();

      validate(["test.html"], { ignores: customIgnores });

      const spawnArgs = mockSpawn.mock.calls[0]?.[1] as string[] | undefined;
      expect(spawnArgs?.join(" ")).toContain("custom-ignore-pattern");
    });
  });

  describe("defaultLogger", () => {
    const createMockReport = (messages: VnuReport["messages"]): VnuReport => ({ messages });

    test("should log all message types correctly", () => {
      const mockVnuReport = createMockReport([
        {
          type: "error",
          message: "Test error message",
          url: "file:test.html",
          lastLine: 1,
          firstColumn: 1,
        },
        {
          type: "info",
          subType: "warning",
          message: "Test warning message",
          url: "file:test.html",
          lastLine: 2,
          firstColumn: 1,
        },
        {
          type: "info",
          message: "Test info message",
          url: "file:test.html",
          lastLine: 3,
          firstColumn: 1,
        },
      ]);

      defaultLogger(mockVnuReport, ["test.html"]);
      expect(mockConsole.error).toHaveBeenCalled();
      expect(mockConsole.info).toHaveBeenCalledWith(expect.stringContaining("Checked 1 file(s)"));
      expect(mockConsole.info).toHaveBeenCalledWith(expect.stringContaining("Found 1 error(s)"));
      expect(mockConsole.info).toHaveBeenCalledWith(expect.stringContaining("Found 1 warning(s)"));
    });

    test("should handle empty messages", () => {
      defaultLogger(createMockReport([]), ["test.html"]);
      expect(mockConsole.error).not.toHaveBeenCalled();
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining("Nu checker found no errors or warnings"),
      );
    });
  });
});
