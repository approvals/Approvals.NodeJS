import { execSync } from "node:child_process";

import { Reporter } from "../../Core/Reporter";

export default class CopyCommandReporter implements Reporter {
  public name: string;

  constructor() {
    this.name = "CopyCommand";
  }

  canReportOn(): boolean {
    return true;
  }

  report(approvedFilePath, receivedFilePath): void {
    const programs = {
      win32: {
        clipboard: "clip",
        fileCopy: "copy",
      },
      linux: {
        clipboard: "xclip -selection clipboard",
        fileCopy: "copy",
      },
      darwin: {
        clipboard: "pbcopy",
        fileCopy: "cp",
      },
    };

    const selectedPrograms = programs[process.platform];

    const quotedReceivedAndApprovedPaths =
      "'" + receivedFilePath + "' '" + approvedFilePath + "'";

    if (selectedPrograms) {
      execSync(selectedPrograms.clipboard, {
        input: selectedPrograms.fileCopy + " " + quotedReceivedAndApprovedPaths,
      });
    } else {
      // some sort of fallback copy command logged to the console
      console.log("cp " + quotedReceivedAndApprovedPaths);
    }
  }
}
