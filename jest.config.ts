import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",

  testEnvironment: "node",

  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  testMatch: [
    "**/controllers/**/*.test.ts",
    "**/services/**/*.test.ts",
    "**/repositories/**/*.test.ts",
  ],

  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts", "!src/**/*.d.ts", "!src/server.ts"],

  modulePathIgnorePatterns: ["<rootDir>/postgres-data/"],

  watchPathIgnorePatterns: ["<rootDir>/postgres-data/"],
};

export default config;
