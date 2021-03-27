const FinalMessages = require("../FinalMessages");
var NodeDiffReporter = require('./Reporters/nodediffReporter');

let maxLaunch = 10;
let currentCount = 0;
let reroutedCount = 0;

class ReportLaunchingCircuitBreaker {

  static setMaxLaunch(value) {
    maxLaunch = value;
  }

  static get currentCount() {
    return currentCount;
  }

  static notifyLaunched() {
    currentCount++;
  }

  static isLimitExceeded() {
    return maxLaunch <= currentCount;
  }

  static check(approved, received, options) {

    if (this.isLimitExceeded()) {

      reroutedCount++;

      FinalMessages.addKeyMessage("maxLaunches", `config.maxLaunches (${maxLaunch}) exceeded: ${reroutedCount} diff(s) shown in console above...`);

      (new NodeDiffReporter()).report(approved, received, options);

      return true;
    }

    this.notifyLaunched();

    return false;

  }

}

module.exports = ReportLaunchingCircuitBreaker;
