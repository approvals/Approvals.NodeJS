import { ApprovedFileLog } from "../../Logs/ApprovedFileLog";
import { FailedFileLog } from "../../Logs/FailedFileLog";
import fs from "fs";

export let jestInitializingRun = false;

export function initializeGlobalsForJest() {
  ApprovedFileLog.forceClearLogFile();
  FailedFileLog.forceClearFileLog();
  jestInitializingRun = true;
}

export function helpUserSetupJest(fileToCheck: string) {
  // Check if the file exists
  if (fs.existsSync(fileToCheck)) {
    // Get the date that fileToCheck was created
    const fileStats = fs.statSync(fileToCheck);
    const fileCreationDate = fileStats.birthtime;

    // Check if the date was in the last 24 hours
    const currentDate = new Date();
    const twentyFourHoursAgo = new Date(
      currentDate.getTime() - 24 * 60 * 60 * 1000,
    );
    const isFileRecent = fileCreationDate > twentyFourHoursAgo;

    if (isFileRecent) {
      return;
    }
  }
  console.log(`Set up jest!`);
}
