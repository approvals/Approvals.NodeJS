export class JestUtils {
  static isJestRunning() {
    return !!process.env.JEST_WORKER_ID;
  }
}
