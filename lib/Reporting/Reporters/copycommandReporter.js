
class Reporter {
  constructor() {

    this.name = "CopyCommand";
  }

  canReportOn() {
    return true;
  }

  report(approvedFilePath, receivedFilePath) {

    var programs = {
      'win32': {
        clipboard: 'clip',
        fileCopy: 'copy'
      },
      'linux': {
        clipboard: 'xclip -selection clipboard',
        fileCopy: 'copy'
      },
      'darwin': {
        clipboard: 'pbcopy',
        fileCopy: 'cp'
      }
    };

    var selectedPrograms = programs[process.platform];

    // EX: "copy my-file.received.txt my-file.approved.txt"
    var copyFragment = "'" + receivedFilePath + "' '" + approvedFilePath + "'";

    if (selectedPrograms) {
      var cp = require('child_process');
      cp.execSync(selectedPrograms.clipboard, {
        input: selectedPrograms.fileCopy + ' ' + copyFragment
      });
    } else {
      // some sort of fallback copy command logged to the console
      console.log('cp ' + copyFragment);
    }

  }

}

module.exports = Reporter;
