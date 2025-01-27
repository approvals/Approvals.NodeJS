import shelljs from "shelljs";
import path from "path";
import fs from "fs";
import * as os from "node:os";

describe("Command Line", function () {
  it("Should run approvals CLI with basic text input", function (done) {
      // get the absolute path for ./
      // const pwd = process.cwd();
      const pwd = '/Users/il/Documents/git/Approvals.NodeJS';
    var cliTestCommand =
      'echo "Hello\nWorld" | ' +
      path.join(pwd, "/", "bin", "index.js") +
      " --reporter gitdiff --errorOnStaleApprovedFiles=false --outdir "+ pwd + "/test commandlineTest";

      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'example-'));
      process.chdir(tempDir);

    shelljs.exec(cliTestCommand, { async: true }, function (code, output) {
      if (code !== 0) {
        console.error("code:", code, "output:", output);
        throw new Error("cli script failed");
      }
      done();
    });

      process.chdir(pwd);
  });
});
