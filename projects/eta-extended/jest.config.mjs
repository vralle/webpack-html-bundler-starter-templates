import { createJsWithTsEsmPreset } from "ts-jest";

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  ...createJsWithTsEsmPreset(),
  displayName: "eta-extended",
  extensionsToTreatAsEsm: [".ts"],
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
};

export default jestConfig;
