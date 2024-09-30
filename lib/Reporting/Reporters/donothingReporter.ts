import { Reporter } from "../../Core/Reporter";

export default class DoNothingReporter implements Reporter {
  name: string = "DoNothing";

  canReportOn() {
    return true;
  }

  report() {
    // Do nothing
  }
}
