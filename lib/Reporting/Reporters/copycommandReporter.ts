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

    // EX: "copy my-file.received.txt my-file.approved.txt"
    const copyFragment =
      "'" + receivedFilePath + "' '" + approvedFilePath + "'";

    if (selectedPrograms) {
      const cp = require("child_process");
      cp.execSync(selectedPrograms.clipboard, {
        input: selectedPrograms.fileCopy + " " + copyFragment,
      });
    } else {
      // some sort of fallback copy command logged to the console
      console.log("cp " + copyFragment);
    }
  }
}
