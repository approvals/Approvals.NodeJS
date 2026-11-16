import * as fs from "fs";

import * as _ from "lodash";

import * as aUtils from "../AUtils";
import * as cfg from "../config";
import { FileApprover } from "../FileApprover";
import { ReporterFactory } from "../Reporting/ReporterFactory";
import { StringWriter } from "../StringWriter";

import { MochaNamer } from "./Mocha/MochaNamer";

function beforeEachLoaderFunction(
  Namer: typeof MochaNamer,
  dirName: string,
  that: any,
): void {
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
  function verify(this: Mocha.Context, data: any, overrideOptions?: any) {
    const namer = new Namer(this, dirName);

    const newOptions = _.defaults(overrideOptions || {}, cfg.currentConfig());

    const reporterFactory = function () {
      return { getCurrentReporters }.getCurrentReporters(newOptions);
    };

    const writer = new StringWriter(newOptions, data);
    FileApprover.verify(namer, writer, reporterFactory);
  }

  function verifyAsJSON(this: any, data: any, overrideOptions?: any) {
    this.verify(aUtils.stringifyKeysInOrder(data), overrideOptions);
  }
}

function ensureDirectoryExists(dirName: string, usageSample: string): void {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
  if (!fs.lstatSync(dirName).isDirectory()) {
    throw new Error(
      `Invalid directory [${dirName}]. Try using the following syntax. > ${usageSample}`,
    );
  }
}

export function beforeEachVerifierBase(
  Namer: typeof MochaNamer,
  usageSample: string,
  dirName: string,
): void {
  ensureDirectoryExists(dirName, usageSample);
  beforeEach(function (this: any) {
    return beforeEachLoaderFunction(Namer, dirName, this);
  });
}
