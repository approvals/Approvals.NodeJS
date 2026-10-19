module.exports = {
  spec: ["test/mocha/**/*[Tt]ests.js", "test/mocha/**/*[Tt]ests.mjs"],
  require: ["ts-node/register"],
  reporter: "mocha-multi-reporters",
  "reporter-option": ["configFile=.mocha-multi-reporters.json"],
  slow: 500,
  timeout: 5000,
};
