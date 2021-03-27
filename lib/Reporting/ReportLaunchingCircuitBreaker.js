
let maxLaunch = 20;
let currentCount = 0;

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

}

module.exports = ReportLaunchingCircuitBreaker;
