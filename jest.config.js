const { defaults } = require("jest-config");

module.exports = {
  globalSetup: "./jest.globalSetup.js",
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
      statements: 98,
      branches: 90,
      functions: 100,
      lines: 98,
    },
  },
};
