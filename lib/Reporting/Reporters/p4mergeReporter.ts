import fs from "fs";

import shelljs from "shelljs";

import { searchForExecutable } from "../../AUtils";
import { platform } from "../../osTools";
import { GenericDiffReporterBase } from "../GenericDiffReporterBase";

const MAC_APPLICATIONS_LAUNCHER =
  "/Applications/p4merge.app/Contents/Resources/launchp4merge";
const HOMEBREW_CASK_FOLDER = "/opt/homebrew-cask/Caskroom/p4merge";

function findInMacApplications(): string | null {
  return fs.existsSync(MAC_APPLICATIONS_LAUNCHER)
    ? MAC_APPLICATIONS_LAUNCHER
    : null;
}

function findInHomebrewCask(): string | undefined {
  try {
    // `shelljs.find` will `process.exit` on error - so test the folder exists first
    if (fs.existsSync(HOMEBREW_CASK_FOLDER)) {
      return shelljs
        .find(HOMEBREW_CASK_FOLDER)
        .filter((item) => item.indexOf("launchp4merge") >= 0)[0];
    }
  } catch {
    // best effort: fall back to searching for the Windows executable
  }
  return undefined;
}

function findOnMac(): string | null | undefined {
  return findInMacApplications() || findInHomebrewCask();
}

export default class P4MergeReporter extends GenericDiffReporterBase {
  constructor() {
    super("P4Merge");

    const app = platform.isMac ? findOnMac() : null;
    this.exePath = app || searchForExecutable("Perforce", "p4merge.exe");
  }
}
