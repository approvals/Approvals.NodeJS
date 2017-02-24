# Approvals

Approval Tests Library - Capturing Human Intelligence

Learn more more about Approvals at [approvaltests.com](http://approvaltests.com)

## Latest Builds

 Service | Status
------------- | -------------
Linux ([Travis CI](https://travis-ci.org/)) | [![Build Status](https://travis-ci.org/approvals/Approvals.NodeJS.png?branch=master)](https://travis-ci.org/approvals/Approvals.NodeJS)
Windows ([AppVeyor](http://appveyor.com)) | [![Build status](https://ci.appveyor.com/api/projects/status/fwyi6sryl03h9em6)](https://ci.appveyor.com/project/JasonJarrett/approvals-nodejs)


## Invoke via

- [Mocha](http://mochajs.org/) tests
- [Jasmine](http://jasmine.github.io/) tests
- [Approvals API](https://github.com/approvals/Approvals.NodeJS/wiki/Manual-API) (`require('approvals').verify(...)`)
- [Command line Utility](https://github.com/approvals/Approvals.NodeJS/wiki/Command-Line)

## Getting Started

Below is a simple getting started using Mocha. We now support Jasmine as well, just replace mocha with Jasmine below and you should be able to get started.

1. Create a project (folder)

    ```shell
    mkdir MyProject
    cd MyProject`
    ```

1. Install approvals

    ```shell
    npm install --save-dev approvals
    ```

1. Install [Mocha](http://mochajs.org/) globally to execute our tests

    ```shell
    npm install -g mocha
    ```

1. Create a sample Mocha test file called `test.js`.

    ```javascript
    require('approvals')
      .mocha();

    describe('When running some tests', function () {
      it('should be able to use Approvals', function () {
        var data = "Hello World!";
        this.verify(data);  // or this.verifyAsJSON(data)
      });
    });
    ```

1. Test the file with mocha.

    ```shell
    mocha test.js
    ```

1. You should be presented with a diff tool. (if not, you may need to install one?)

## Documentation

[Approvals Github Wiki!](https://github.com/approvals/Approvals.NodeJS/wiki)

## Config (overriding)

The default configuration as defined below can be overridden by using the following strategy.

Priority is given the config at the bottom of the list (going up).

1. Starting with the defaults (as shown below) and defined in [lib/config.js](lib/config.js).
1. Override any defaults with config in a yaml or json file in `~/.approvalsConfig`.
1. Then override with an `approvals.configure({...})` (not recommended in general).
1. Then passing any specific configuration at the test level as the last parameter in the `.verify(..., {...overridden config...});`.

```javascript
var defaultConfig = {
  // The strategy for determining which reporter to use will likely
  // change at some point. For now, you can configure priority here.
  // What I'd prefer is if each project has a configuration file
  // and each user could setup a ~/.approvalConfig file
  // which would contain their preferred merge/diff tools
  reporters:  [
    "opendiff",
    "p4merge",
    "tortoisemerge",
    "nodediff",
    "gitdiff"

/* OR a custom reporter object. Below describes the reporter object interface:

  // If you want to provide a custom reporter
  // you can't do this with the config yml file
  // but can be passed anywhere a config object is accepted
  // and must have the following interface
  {

    // this is used in exception reporting etc. Just give it a name :)
    name: string;

    // This is used to determine if the reporter can report on the specified file
    // EX: an image differ vs a txt differ...
    canReportOn(receivedFilePath: string): boolean;

    // Actually execute the diff against the two files
    report(approvedFilePath: string, receivedFilePath: string): void;
  }
*/
  ],

  // If you need to normalize text file line-endings
  // you can set this to something like "\n" or "\r\n"
  //
  // default value here of false or undefined will not apply any
  // line-ending replacement before writing the approval received file
  normalizeLineEndingsTo: false, // default

  // If approvals determines things are different, it will replacement
  // line endings CRLF with just LF and re-compare. If they are the same
  // approvals will log a warning that the files are the same except for
  // line endings. Flip this to `true` to fail tests if line-endings
  // are different
  failOnLineEndingDifferences: false,

  // Some diff tools automatically append an EOL to a merge file
  // Setting this to true helps with those cases... (Also see EOL below
  // for what is appended)
  appendEOL: true,

  // When appendEOL above is true, this value defines what will be appended at the end of the file.
  // It's really a bad name as it's not End-of-Line... but -end-of-file err end-of-line-at-end-of-file :P
  EOL:  require('os').EOL,

  // This helps keep the project clean of files
  // that became stale due to removal of tests
  // or after a rename
  errorOnStaleApprovedFiles: true,

  // This is a function called when the proc is exiting and we're
  // validating any stale *.approved.txt files. You can override
  // this function to ignore validation of some files or not
  shouldIgnoreStaleApprovedFile: function(/*fileName*/) { return false; },

  // On some files or projects a Byte Order
  // Mark can be inserted and cause issues,
  // this allows you to force it to be stripped
  stripBOM: false

  //DANGER: this can be used to force-approve a file during a test run.
  // Can be used for first time-run or if lots of tests are failing because
  // of a change you know is correct. AGAIN DANGER - don't ever check code
  // in that configures this to be on...)
  forceApproveAll: false

};
```

## Source Control

The approvals tool can generate files that you'll want to configure source control ex: `.gitignore`.

- `*.received.*` files should be **IGNORED**.
- `*.approved.*` You'll likely want to keep the approved files in source control.

### Git

  If you're using [Git](http://git-scm.com) add this to your `.gitignore`:

  ```text
  *.received.*
  ```

  Another issue that can crop up is the line-endings as git can change the files depending on checking out the file on linux/mac vs windows.

  A possible fix for this is to add `*.approved.* binary` to your `.gitattributes` (but that makes viewing diffs as you check in a pain).

## Contributing

Check out the [guidelines](CONTRIBUTING.md)!

## License

Copyright (c) 2012-2015 Llewellyn Falco, Jason Jarrett
Licensed under the Apache license.
