# Approvals (Approval Tests for Node.js)

##### Table of Contents

- [Intro](#intro)
- [Builds](#builds)
- [Integrations](#integrations)
- [Getting Started](#getting-started)
- [API](#api)
- [Wiki](#wiki)
- [Reporters](#reporters)
- [Configuration](#configuration)
- [Source Control](#source-control)
- [Contributing](#contributing)
- [License](#license)


<a name="intro" />

## Intro

Approval Tests Library - **Capturing Human Intelligence**

What is an approval test? Check out a brief [overview here](http://staxmanade.com/2015/01/approval-tests---overview/) or learn more more about Approvals at [approvaltests.com](http://approvaltests.com).

<a name="build-details" />

## Builds

 Service | Status
------------- | -------------
Linux ([Travis CI](https://travis-ci.org/)) | [![Build Status](https://travis-ci.org/approvals/Approvals.NodeJS.png?branch=master)](https://travis-ci.org/approvals/Approvals.NodeJS)
Windows ([AppVeyor](http://appveyor.com)) | [![Build status](https://ci.appveyor.com/api/projects/status/fwyi6sryl03h9em6)](https://ci.appveyor.com/project/JasonJarrett/approvals-nodejs)


<a name="integrations" />

## Integrations

- [Mocha](http://mochajs.org/) tests, see the getting-started
- ~~[Jasmine](http://jasmine.github.io/) tests~~ (removed support due to lack of integration knowledge)
- [Approvals API](https://github.com/approvals/Approvals.NodeJS/wiki/Manual-API) (`require('approvals').verify(...)`)
- [Command line Utility](https://github.com/approvals/Approvals.NodeJS/wiki/Command-Line)

<a name="getting-started" />

## Getting Started

Below is a simple getting started using Mocha.

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


<a name="api" />

## API

<!--BEGIN-API-DOCS-->
<!--END-API-DOCS-->

<a name="wiki">

## Wiki

There are some other documentation items over in the github wiki:

[Approvals Github Wiki!](https://github.com/approvals/Approvals.NodeJS/wiki)

<a name="reporters" />

## Reporters

Any of the following reporter may suite your needs. Some support images, some only diffing text, some on mac and linux, some only on windows... Feel free to configure the system to automatically choose your favorite.

    "beyondcompare",
    "copycommand",
    "diffmerge",
    "donothing",
    "gitdiff",
    "icdiff",
    "kdiff3",
    "kompare",
    "meld",
    "multi",
    "nodediff",
    "opendiff",
    "p4merge",
    "tortoisemerge",
    "vimdiff",
    "visualstudio",

Along with the built-in reporters, you can create your own custom reporter just by taking this sample and filling out the interface with your custom reporters desired behavior.

```
    /* OR a custom reporter object. Below is an example custom reporter */
    {
      /**
       * Determine if the file that needs to be reported on can be handled by this reporter object.
       * @param {string} receivedFilePath - The path to a received file.
       */
      canReportOn(receivedFilePath) {
        return true;
      }

      /**
       * Apply the logic necessary to report a difference.
       *  EX:
       *     - Open a diff program using the approved & received files
       *     - Generate and email a report showing the differences.
       * @param {string} approvedFilePath - The path to a approved file.
       * @param {string} receivedFilePath - The path to a received file.
       */
      // Actually execute the diff against the two files
      report(approvedFilePath, receivedFilePath) {
        // Do some reporting.
        // Typicall by launching a diff tool
      }
    }
```

<a name="configuration" />

## Configuration

Or more, controlling the behavior of approvals through various tweaks to configuration.

Approvals uses the below configuration to drive it's behavior. How you communicate that configuration to approvals can happen in a number of ways.

The default configuration as defined below can be overridden by using the following strategy.

> NOTE: Priority/order of config selection comes from the below list where the first item have the defined defaults and each next step having a potential to override the previous if a configuration value is specified.

1. Starting with the defaults (as shown in the JS object below) this is defined in [lib/config.js](lib/config.js).
1. We then take and override the defaults (and only the properties specified) with config in a yaml or json file in you're home directory `~/.approvalsConfig`.
1. Overrides with an `approvals.configure({...})` (not a recommended approach).
1. Then passing any specific configuration at the test level as the last parameter in the verify function `.verify(..., {...overridden config...});`. See [API](#api) for specific parameters.

Here's an example of using a single reporter `p4merge`, and overriding whatever is configured. This will only override this specific test.

```javascript
it("should use a specific reporter", function () {
  this.verify('some data', {
    reporters: ['p4merge']
  });
});
```

If you have the need to execute multiple reporters on a single failure.

Say you made an "awesomeDiffReporter" and wanted it to run that in combination with a "notifyTheBossViaEmailReporter" you can use the MultiReporter like below.

```javascript
var approvals = require('approvals');
var MultiReporter = approvals.reporters.MultiReporter

it("should use a multiple reporters", function () {
  this.verify('some data', {
    reporters: [
      new MultiReporter(['p4merge', 'commandclipboard'])
    ]
  });
});
```

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
    /* OR a custom reporter object. See the above example of how to create a custom reporter. */
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

<a name="source-control" />

## Source Control

The approvals tool generates 2 files and you likely want to ignore one and check in the other.

- `*.received.*` files should be **IGNORED**.
- `*.approved.*` You'll likely want to keep the approved files in source control.

### Git

  If you're using [Git](http://git-scm.com) add this to your `.gitignore`:

  ```text
  *.received.*
  ```

  Another issue that can crop up is the line-endings as git can change the files depending on checking out the file on linux/mac vs windows.

  A possible fix for this is to add `*.approved.* binary` to your `.gitattributes` (but that makes viewing diffs as you check in a pain).

<a name="contributing" />

## Contributing

Check out the [guidelines](CONTRIBUTING.md)!

## License

Copyright (c) 2012-2017 Llewellyn Falco, Jason Jarrett
Licensed under the Apache license.
