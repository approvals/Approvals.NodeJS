import { Reporter } from "../../Core/Reporter";
import { ReporterFactory } from "../ReporterFactory";

export default class MultiReporter implements Reporter {
  private reporters: Reporter[];
  public name: string;
  constructor(reporters) {
    reporters = reporters || [];
    if (!Array.isArray(reporters)) {
      throw new Error("reporters arguments is not an array of reporters");
    }

    this.reporters = ReporterFactory.loadAllReporters(reporters);

    this.name =
      "Multi (" +
      this.reporters
        .map(function (r) {
          return r.name;
        })
        .join(", ") +
      ")";
  }

  canReportOn(fileName) {
    return this.reporters.every(function (reporter) {
      return reporter.canReportOn(fileName);
    });
  }

  report(approvedFilePath, receivedFilePath, options) {
    var errors: any[] = [];
    this.reporters.forEach(function (reporter) {
      try {
        reporter.report(approvedFilePath, receivedFilePath, options);
      } catch (err) {
        errors.push(err);
      }
    });

    if (errors.length === 1) {
      throw errors[0];
    } else if (1 < errors.length) {
      var errorMessage =
        "There were multiple errors:\n\n" +
        errors
          .map((err) => {
            return "  " + err.toString();
          })
          .join("\n");

      throw new Error(errorMessage);
    }
  }
}
