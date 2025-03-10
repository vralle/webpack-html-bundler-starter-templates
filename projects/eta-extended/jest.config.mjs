import { createJsWithTsEsmPreset } from "ts-jest";

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  ...createJsWithTsEsmPreset(),
  displayName: "eta-extended",
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "mjs", "js"],
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
};

export default jestConfig;
