import * as _ from "lodash";
import * as fs from "fs";
import * as cfg from "../config";
import { StringWriter } from "../StringWriter";
import { FileApprover } from "../FileApprover";
import { ReporterFactory } from "../Reporting/ReporterFactory";
import * as aUtils from "../AUtils";

import { MochaNamer } from "./Mocha/MochaNamer";

function beforeEachLoaderFunction(
  Namer: typeof MochaNamer,
  dirName: string,
  that: any,
): void {
  // Add methods to the test context
  that.approvals = { getCurrentReporters };
  that.verify = verify;
  that.verifyAsJSON = verifyAsJSON;

  function getCurrentReporters(options?: any) {
    options = options || cfg.currentConfig();
    const reporterCandidates = ReporterFactory.loadAllReporters(
      options.reporters,
    );
    return reporterCandidates;
  }
  function verify(data: any, overrideOptions?: any) {
    // @ts-ignore
    const context = this as Mocha.Context;
    const namer = new Namer(context, dirName);

    const newOptions = _.defaults(overrideOptions || {}, cfg.currentConfig());

    const reporterFactory = function () {
      return { getCurrentReporters }.getCurrentReporters(newOptions);
    };

    const writer = new StringWriter(newOptions, data);
    FileApprover.verify(namer, writer, reporterFactory);
  }

  function verifyAsJSON(data: any, overrideOptions?: any) {
    // @ts-ignore
    this.verify(aUtils.stringifyKeysInOrder(data), overrideOptions);
  }
}

export function beforeEachVerifierBase(
  Namer: typeof MochaNamer,
  usageSample: string,
  dirName: string,
): void {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }

  // Make sure it's a valid directory
  const stats = fs.lstatSync(dirName);
  if (!stats.isDirectory()) {
    throw new Error(
      `Invalid directory [${dirName}]. Try using the following syntax. > ${usageSample}`,
    );
  }
  beforeEach(function () {
    return beforeEachLoaderFunction(Namer, dirName, this);
  });
}
