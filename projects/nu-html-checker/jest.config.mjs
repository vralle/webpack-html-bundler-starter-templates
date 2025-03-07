import { createJsWithTsEsmPreset } from "ts-jest";

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  ...createJsWithTsEsmPreset(),
  displayName: "nu-html-checker",
  extensionsToTreatAsEsm: [".ts"],
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
};

export default jestConfig;
