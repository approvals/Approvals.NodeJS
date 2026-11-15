import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

import { findProgramOnPath } from "../../AUtils";
import { platform } from "../../osTools";
import { GenericDiffReporterBase } from "../GenericDiffReporterBase";

export default class WebStormReporter extends GenericDiffReporterBase {
  constructor(executablePath?: string) {
    super("webstorm");

    this.setCommandArgs = (approved, received) => ["diff", received, approved];

    if (executablePath !== undefined) {
      this.exePath = executablePath;
      return;
    }

    const launchers = platform.isWindows
      ? ["webstorm64.exe", "webstorm.exe"]
      : platform.isMac
        ? ["webstorm"]
        : ["webstorm", "webstorm.sh"];

    for (const launcher of launchers) {
      const executable = findProgramOnPath(launcher);
      if (executable) {
        this.exePath = executable;
        return;
      }
    }

    if (platform.isMac) {
      const applications = ["/Applications", join(homedir(), "Applications")];
      for (const directory of applications) {
        const launcher = join(
          directory,
          "WebStorm.app",
          "Contents",
          "MacOS",
          "webstorm",
        );
        if (existsSync(launcher)) {
          this.exePath = launcher;
          return;
        }
      }
    }
  }
}
