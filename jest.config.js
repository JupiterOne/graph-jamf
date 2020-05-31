const { defaults } = require("jest-config");

module.exports = {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testMatch: ["<rootDir>/src/**/*.test.{js,ts}"],
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts"],
  testEnvironment: "node",
  clearMocks: true,
  setupFiles: ["dotenv/config"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/JamfClient",
    "!src/jamf/fetchJamfData.ts",
    "!src/utils/toOSXConfigurationParsed.ts",
  ],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 96.26,
      functions: 100,
      lines: 100,
    },
  },
};
