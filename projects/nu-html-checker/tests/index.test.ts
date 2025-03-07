import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { type ChildProcess, execFile, spawn } from "node:child_process";
import validate, { defaultLogger, type VnuReport } from "../src/index";

// Mock child_process
jest.mock("node:child_process");

describe("HTML Checker Tests", () => {
  let mockExecFile: jest.SpiedFunction<typeof execFile>;
  let mockSpawn: jest.SpiedFunction<typeof spawn>;
  let mockConsoleError: jest.SpiedFunction<typeof console.error>;
  let mockConsoleInfo: jest.SpiedFunction<typeof console.info>;
  let mockConsoleLog: jest.SpiedFunction<typeof console.log>;

  // Helper function to create a mock child process
  const createMockChildProcess = (): ChildProcess => ({
    stderr: {
      on: jest.fn(),
    },
    on: jest.fn(),
  } as unknown as ChildProcess);

  // Helper function to mock Java version response
  const mockJavaVersion = (version: string) => {
    mockExecFile.mockImplementation((_cmd, _args, _opts, callback) => {
      if (callback) {
        callback(null, "", `java version "${version}"`);
      }
      return {} as ChildProcess;
    });
  };

  // Helper function to setup validation environment
  const setupValidationTest = (javaVersion = "11.0.12") => {
    mockJavaVersion(javaVersion);
    const mockChildProcess = createMockChildProcess();
    mockSpawn.mockReturnValue(mockChildProcess);
    return mockChildProcess;
  };

  beforeEach(() => {
    mockExecFile = execFile as jest.MockedFunction<typeof execFile>;
    mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    mockConsoleInfo = jest.spyOn(console, "info").mockImplementation(() => undefined);
    mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => undefined);
    jest.spyOn(process, "exit").mockImplementation((code?: string | number | null) => {
      throw new Error(`Process.exit called with code: ${code}`);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validate function", () => {
    test("should exit with error when no files provided", () => {
      expect(() => validate([])).toThrow("Process.exit called with code: 1");
      expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining("No files to check"));
    });

    test("should exit with error when Java is not available", () => {
      mockExecFile.mockImplementation((_cmd, _args, _opts, callback) => {
        if (callback) {
          callback(new Error("Java not found"), "", "");
        }
        return {} as ChildProcess;
      });

      expect(() => validate(["test.html"])).toThrow("Process.exit called with code: 1");
      expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining("Java is missing"));
    });

    test("should exit with error for unsupported Java version", () => {
      setupValidationTest("1.7.0_80");

      expect(() => validate(["test.html"])).toThrow("Process.exit called with code: 1");
      expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining("Unsupported Java version"));
    });

    test("should proceed with validation for valid Java version", () => {
      setupValidationTest();

      validate(["test.html"]);
      expect(mockSpawn).toHaveBeenCalled();
      expect(mockConsoleInfo).toHaveBeenCalledWith(expect.stringContaining("Nu validation start running"));
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
      expect(mockConsoleError).toHaveBeenCalled();
      expect(mockConsoleInfo).toHaveBeenCalledWith(expect.stringContaining("Checked 1 file(s)"));
      expect(mockConsoleInfo).toHaveBeenCalledWith(expect.stringContaining("Found 1 error(s)"));
      expect(mockConsoleInfo).toHaveBeenCalledWith(expect.stringContaining("Found 1 warning(s)"));
    });

    test("should handle empty messages", () => {
      defaultLogger(createMockReport([]), ["test.html"]);
      expect(mockConsoleError).not.toHaveBeenCalled();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining("Nu checker found no errors or warnings"),
      );
    });
  });

  describe("validate with custom options", () => {
    test("should use custom logger when provided", () => {
      const customLogger = jest.fn();
      setupValidationTest();

      validate(["test.html"], { logger: customLogger });
      expect(mockSpawn).toHaveBeenCalled();
    });

    test("should use custom ignores when provided", () => {
      const customIgnores = ["custom-ignore-pattern"];
      setupValidationTest();

      validate(["test.html"], { ignores: customIgnores });
      expect(mockSpawn).toHaveBeenCalledWith(
        "java",
        expect.arrayContaining(['--filterpattern "custom-ignore-pattern"']),
        expect.any(Object),
      );
    });
  });
});
