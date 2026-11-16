import { createEmptyFileIfNotExists } from "../../AUtils";
import { platform } from "../../osTools";
import { GenericDiffReporterBase } from "../GenericDiffReporterBase";

function findInstalledVisualStudioPathUsingDotNet() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const edge = require("edge");

  const getVisualStudioPath = edge.func(function () {
    /*
        async (input) => {
          // pulled this from https://github.com/approvals/ApprovalTests.Net/blob/master/ApprovalTests/Reporters/VisualStudioReporter.cs
          return (string)Microsoft.Win32.Registry.GetValue(@"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\devenv.exe", "", @"Microsoft Visual Studio 11.0\Common7\IDE\devenv.exe");
        }
      */
  });
  return getVisualStudioPath(null, true);
}

export default class VisualStudioReporter extends GenericDiffReporterBase {
  constructor() {
    super("VisualStudio");

    if (platform.isWindows) {
      this.exePath = findInstalledVisualStudioPathUsingDotNet();
    }
  }

  canReportOn(fileName) {
    if (platform.isWindows) {
      return super.canReportOn(fileName);
    }

    return false;
  }

  report(approved, received) {
    createEmptyFileIfNotExists(approved);

    const ps = this.spawn(this.exePath, ["/diff", received, approved], {
      detached: true,
    });

    ps.stdout.on("data", function (data) {
      console.log("reporter stdout: " + data);
    });

    ps.stderr.on("data", function (data) {
      console.log("reporter stderr: " + data);
    });
  }
}
