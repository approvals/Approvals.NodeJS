"use strict";

import fs from "fs";

import shelljs from "shelljs";
import GenericDiffReporterBase from "../GenericDiffReporterBase";
import { platform } from "../../osTools";
import { searchForExecutable } from "../../AUtils";

export default class P4MergeReporter extends GenericDiffReporterBase {
  constructor() {
    super("P4Merge");

    var app = null;
    if (platform.isMac) {
      try {
        app = shelljs.ls(
          "/Applications/p4merge.app/Contents/Resources/launchp4merge",
        )[0];
      } catch (err) {
        console.error(err);
      }

      try {
        // `shelljs.find` will `process.exit` on error - so test the folder exists first
        if (fs.existsSync("/opt/homebrew-cask/Caskroom/p4merge")) {
          app =
            app ||
            shelljs
              .find("/opt/homebrew-cask/Caskroom/p4merge")
              .filter(function (item) {
                return item.indexOf("launchp4merge") >= 0;
              })[0];
        }
      } catch (err) {
        //console.error(err);
      }
    }

    this.exePath = app || searchForExecutable("Perforce", "p4merge.exe");
  }
}
