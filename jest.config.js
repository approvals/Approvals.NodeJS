/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [ "**/__tests__/**/*.?(m)js?(x)", "**/?(*.)+(spec|test).?(m)js?(x)" ],
  transform: {},
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "./test-reports/", outputName: "jest-test-results.xml" }],
  ],
  // being-snippet: jest_config_setup
  globalSetup: "./test/Providers/Jest/JestGlobalSetup.mjs",
  // end-snippet
};
