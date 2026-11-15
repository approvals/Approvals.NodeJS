import { exec } from "child_process";

import { Config } from "../config";
import { Reporter } from "../Core/Reporter";
import { platform } from "../osTools";

export class ReportByOpeningTheReceivedFile implements Reporter {
  name: string = "ReportByOpeningTheReceivedFile";

  canReportOn(_fileName: string): boolean {
    return true;
  }

  report(
    _approvedFileName: string,
    receivedFileName: string,
    _options?: Partial<Config>,
  ): void {
    const openCommand = platform.isWindows ? "start" : "open";
    const shell = `${openCommand} "${receivedFileName}"`;
    exec(shell);
  }
}
