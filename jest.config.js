/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [ "**/__tests__/**/*.?(m)js?(x)", "**/?(*.)+(spec|test).?(m)js?(x)" ]
};
