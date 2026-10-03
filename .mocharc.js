module.exports = {
  require: ["ts-node/register"],
  reporter: "mocha-multi-reporters",
  reporterOption: ["configFile=.mocha-multi-reporters.json"],
  slow: 500,
  timeout: 5000,
};
