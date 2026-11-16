import fs from "fs";

import { ApprovedFileLog } from "../../Logs/ApprovedFileLog";
import { FailedFileLog } from "../../Logs/FailedFileLog";
import { LogUtils } from "../../Logs/LogUtils";

export let jestInitializingRun = false;

export function initializeGlobalsForJest() {
  ApprovedFileLog.forceClearLogFile();
  FailedFileLog.forceClearFileLog();
  jestInitializingRun = true;
}

function wasCreatedInLast24Hours(file: string): boolean {
  const creationDate = fs.statSync(file).birthtime;
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return creationDate > twentyFourHoursAgo;
}

export function helpUserSetupJest(fileToCheck: string) {
  LogUtils.ensureTempDirectoryExists();
  if (fs.existsSync(fileToCheck) && wasCreatedInLast24Hours(fileToCheck)) {
    return;
  }
  const helpMessage = `
**********************************************
Jest needs to be set up for logging.
More information at https://github.com/approvals/Approvals.NodeJS/blob/master/docs/how_tos/InitializeJestForLogging.md
**********************************************
`;
  console.log(helpMessage);
}
