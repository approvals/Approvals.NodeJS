import shelljs from "shelljs";
import path from "path";

describe("Command Line", function () {
  it("Should run approvals CLI with basic text input", function (done) {
    const cliTestCommand =
      'echo "Hello\nWorld" | ' +
      path.join("./", "bin", "index.js") +
      " --reporter gitdiff --errorOnStaleApprovedFiles=false --outdir ./test commandlineTest";

    shelljs.exec(cliTestCommand, { async: true }, function (code, output) {
      if (code !== 0) {
        console.error("code:", code, "output:", output);
        throw new Error("cli script failed");
      }
      done();
    });
  });
});
