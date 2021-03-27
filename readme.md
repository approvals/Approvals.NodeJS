# Approvals (Approval Tests for Node.js)

##### Table of Contents

- [Intro](#intro)
- [Builds](#builds)
- [Integrations](#integrations)
- [Getting Started](#getting-started)
- [CLI](#cli)
- [Reporters](#reporters)
- [Configuration](#configuration)
- [API](#api)
- [Source Control](#source-control)
- [Contributing](#contributing)
- [License](#license)


<a name="intro" />

## Intro

Approval Tests Library - **Capturing Human Intelligence**

What is an approval test? Check out a brief [overview here](http://staxmanade.com/2015/01/approval-tests---overview/) or learn more about Approvals at [approvaltests.com](http://approvaltests.com).

<a name="build-details" />

## Badges

 Service | Status
------------- | -------------
Package | [![npm version](https://badge.fury.io/js/approvals.svg)](https://badge.fury.io/js/approvals)
Github Linux | [![Build & Test](https://github.com/approvals/Approvals.NodeJS/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/approvals/Approvals.NodeJS/actions/workflows/build-and-test.yml)
Windows ([AppVeyor](http://appveyor.com)) | [![Build status](https://ci.appveyor.com/api/projects/status/fwyi6sryl03h9em6)](https://ci.appveyor.com/project/JasonJarrett/approvals-nodejs)

<a name="integrations" />

## Integrations

- [Mocha](http://mochajs.org/) tests, see the getting-started
- [Approvals API](#api) (`require('approvals').verify(...)`)
- [Command line Utility](#cli)

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

<a name="cli">

## CLI

Approvals.NodeJS has a version that can be run as a command line tool.

You can check out the `Examples` section of the below CLI help. Or a blog post introducing the tool here: [Approval Tests - Command Line Tool (CLI)](http://staxmanade.com/2015/02/approval-tests---command-line-tool--cli-/).

### Install Approvals CLI

```
npm install -g approvals
```

### CLI Help

By running `approvals --help`

<!--BEGIN-CLI-DOCS-->
<!-- GENERATED - DO NOT MODIFY API DOCS IN THIS README -->
<!-- Update docs in the source ./bin/help.md -->
```

# Usage

`approvals testName [options]`

        [-f | --forceapproveall]   : Skip the approve step and apply the results to the .approved.txt file (good for a first time run)

        [--reporter difftool]      : supports multiple EX: `--reporter opendiff --reporter gitdiff`

        [--outdir]                 : dir to place approval file - defaults to current directory

        [--verbose]                : extra debug info

        TODO:                      : We need to extend the supported args to include other approval options. (file an [issue](https://github.com/approvals/Approvals.NodeJS/issues) if you need one that's not here)

# Examples

## Simple hello world

  echo 'Hello World!' | approvals helloWorldTest

## Specify diff reporter (great for C.I.)

  echo 'Hello World!' | approvals helloWorldTest --reporter gitdiff

## Multiple diff reporters

  echo 'Hello World!' | approvals helloWorldTest --reporter gitdiff --reporter p4merge

```

<!--END-CLI-DOCS-->

<a name="reporters" />

## Reporters

### Built-In Reporters
Any of the following reporter may suite your needs. Some support images, some only diffing text, some on mac and linux, some only on windows... Feel free to configure the system to automatically choose your favorite.

## Supported Diff Tools

| approval name | Program        | Windows       | Mac/Linux  | Notes  |
| ------------- | -------------- |:-------------:|:----------:| ------ |
| `beyondcompare` | [Beyond Compare](http://www.scootersoftware.com/) | &#10003; | &#10003; | |
| `copycommand` | [git diff](http://git-scm.com/docs/git-diff) (console diff) | &#10003; | &#10003; | Great for C.I. builds runs. |
| `diffmerge` | [DiffMerge](https://sourcegear.com/diffmerge/) | &#10003; | &#10003; |  |
| `donothing` |  | &#10003; | &#10003; | This one does what it says - nothing. |
| `gitdiff` | [git diff](http://git-scm.com/docs/git-diff) (console diff) | &#10003; | &#10003; | Using git cli to diff files. Useful in C.I. builds |
| `icdiff` | [Icdiff](https://github.com/jeffkaufman/icdiff) | &#10003; | &#10003; |  |
| `kdiff3` | [KDiff3](http://kdiff3.sourceforge.net/) | &#10003; | &#10003; |  |
| `kompare` | [Kompare](https://www.kde.org/applications/development/kompare/) | ? | &#10003; |  |
| `meld` | [Meld](http://meldmerge.org/) | &#10003; | &#10003; |  |
| `multi` |  | &#10003; | &#10003; | This allows you to run multiple reporters at the same time. EX: when verifying images, you might like to use `p4merge` along with the `copycommand` reporter to get the copy CLI command to approve an image as well as view the diff in a tool. |
| `nodediff` | [nodediff](https://github.com/kpdecker/jsdiff) (console diff) | &#10003; | &#10003; | colorized CLI output without a popup of a diff tool |
| `opendiff` | [opendiff](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/opendiff.1.html) |  | &#10003; | |
| `p4merge` | [p4merge](http://www.perforce.com/product/components/perforce-visual-merge-and-diff-tools) | &#10003; | &#10003; | |
| `tortoisemerge` | [Tortise merge](http://tortoisesvn.net/docs/release/TortoiseSVN_en/tsvn-dug-merge.html) | &#10003; | &#10003; | |
| `vimdiff` |  | &#10003; | &#10003; |  |
| `visualstudio` | [Visual Studio Diff tool](http://msdn.microsoft.com/en-us/library/bb385990.aspx) | &#10003; |  |
| `vscode` | [Visual Studio Code Diff tool](https://code.visualstudio.com/) | &#10003; | &#10003; |


### Custom Reporter

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
       * @param {string} approvedFilePath - The path to an approved file.
       * @param {string} receivedFilePath - The path to a received file.
       */
      // Actually execute the diff against the two files
      report(approvedFilePath, receivedFilePath) {
        // Do some reporting.
        // Typically by launching a diff tool
      }
    }
```

<a name="configuration" />

## Configuration

Or more, controlling the behavior of approvals through various tweaks to configuration.

Approvals uses the below configuration to drive its behavior. How you communicate that configuration to approvals can happen in several ways.

The default configuration as defined below can be overridden by using the following strategy.

> NOTE: Priority/order of config selection comes from the below list where the first item have the defined defaults and each next step having a potential to override the previous if a configuration value is specified.

1. Starting with the defaults (as shown in the JS object below) this is defined in [lib/config.js](lib/config.js).
1. We then take and override the defaults (and only the properties specified) with config in a yaml or json file in your home directory `~/.approvalsConfig`.
1. You can then call [`approvals.configure({...})`](#module_approvals.configure).
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
      new MultiReporter(['p4merge', 'copycommand'])
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
  reporters: [
    "opendiff",
    "p4merge",
    "tortoisemerge",
    "nodediff",
    "gitdiff",
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
  stripBOM: false,

  //DANGER: this can be used to force-approve a file during a test run.
  // Can be used for first time-run or if lots of tests are failing because
  // of a change you know is correct. AGAIN DANGER - don't ever check code
  // in that configures this to be on...)
  forceApproveAll: false,

  // Default to `false` - launching each diff tool in the background, failing the test and
  // moving on to the next test. If `true` will launch the diff tool and block/wait (if diff tool supports this) until
  // the user exits the diff tool before continuing on with the rest of the tests.
  blockUntilReporterExits: false,

  // The number of reporters (diff tools) launched before before approval tests stops launching new reporters.
  // This is to avoid overloading a system with too many processes.
  // NOTE: This value is only used if `blockUntilReporterExits` is `false`.
  maxLaunches: 10

};
```


<a name="api" />

## API

<!--BEGIN-API-DOCS-->
<!-- GENERATED - DO NOT MODIFY API DOCS IN THIS README -->
<!-- Update docs in the source ./lib/Approvals.js -->

<a name="module_approvals"></a>

## approvals
Approvals module.


* [approvals](#module_approvals)
    * [.configure](#module_approvals.configure)
    * [.getConfig](#module_approvals.getConfig) ⇒ <code>Object</code>
    * [.verify](#module_approvals.verify)
    * [.verifyAndScrub](#module_approvals.verifyAndScrub)
    * [.verifyAsJSON](#module_approvals.verifyAsJSON)
    * [.verifyAsJSONAndScrub](#module_approvals.verifyAsJSONAndScrub)
    * [.verifyWithControl](#module_approvals.verifyWithControl)
    * [.mocha](#module_approvals.mocha)
    * [.reporters](#module_approvals.reporters)
    * [.scrubbers](#module_approvals.scrubbers)

<a name="module_approvals.configure"></a>

### approvals.configure
Allows you to provide overrides to the default configuration.

**Kind**: static property of [<code>approvals</code>](#module_approvals)

| Param | Type |
| --- | --- |
| overrideOptions | <code>\*</code> |

**Example**
```js
var approvals = require('approvals');
approvals.configure({
  reporters: ['p4merge']
});
```
<a name="module_approvals.getConfig"></a>

### approvals.getConfig ⇒ <code>Object</code>
Allows the creation of an approvals configuration object using any passed in options to override the defaults.

**Kind**: static property of [<code>approvals</code>](#module_approvals)
**Returns**: <code>Object</code> - approvals config object with any options overridden.

| Param | Type |
| --- | --- |
| overrideOptions | <code>Object</code> |

<a name="module_approvals.verify"></a>

### approvals.verify
**Kind**: static property of [<code>approvals</code>](#module_approvals)

| Param | Type | Description |
| --- | --- | --- |
| dirName | <code>string</code> | Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files. |
| testName | <code>string</code> | A file name save string to call the file associated with this test. |
| data | <code>string</code> \| <code>Buffer</code> | Either the string to save as a text file or a Buffer that represents an image |
| optionsOverride | <code>\*</code> | An object that can contain configurational overrides as defined in the approvals configuration object. |

**Example**
```js
// basic approval test
var approvals = require('approvals');
approvals.verify(__dirname, 'sample-approval-test', "some text to verify");
```
**Example**
```js
// basic approval test providing an option to override configuration
var approvals = require('approvals');
approvals.verify(__dirname, 'sample-approval-test', "some text to verify", { normalizeLineEndingsTo: true });
```
<a name="module_approvals.verifyAndScrub"></a>

### approvals.verifyAndScrub
Use this to apply the scrubber function to any data before running verify.

**Kind**: static property of [<code>approvals</code>](#module_approvals)

| Param | Type | Description |
| --- | --- | --- |
| dirName | <code>string</code> | Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files. |
| testName | <code>string</code> | A file name safe string to call the file associated with this test. |
| data | <code>string</code> \| <code>Buffer</code> | Either the string to save as a text file or a Buffer that represents an image |
| scrubber | <code>\*</code> | A function that takes a string and returns a string. Approvals will call this if it exists to scrub the "data" before writing to any files. |
| optionsOverride | <code>\*</code> | An object that can contain configurational overrides as defined in the approvals configuration object. |

**Example**
```js
// basic approval test with a custom scrubber
var approvals = require('approvals');
var scrubber = approvals.scrubbers.multiScrubber([
   function (data) {
     return (data || '').replace("some text", "some other text");
   },
   approvals.scrubbers.guidScrubber // to remove guids from the received data
});
approvals.verifyAndScrub(__dirname, 'sample-approval-test', "some text to verify", scrubber);
```
<a name="module_approvals.verifyAsJSON"></a>

### approvals.verifyAsJSON
You can pass as "data" any javascript object to be JSON.stringified and run verify against.

**Kind**: static property of [<code>approvals</code>](#module_approvals)

| Param | Type | Description |
| --- | --- | --- |
| dirName | <code>string</code> | Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files. |
| testName | <code>string</code> | A file name safe string to call the file associated with this test. |
| data | <code>string</code> \| <code>Buffer</code> | This can be any JavaScript object/array that will be JSON.stringified before running verify |
| optionsOverride | <code>\*</code> | An object that can contain configurational overrides as defined in the approvals configuration object. |

**Example**
```js
var approvals = require('approvals');
approvals.verifyAndScrub(__dirname, 'sample-approval-test', { a: "some text in an object" });
```
<a name="module_approvals.verifyAsJSONAndScrub"></a>

### approvals.verifyAsJSONAndScrub
You can pass as "data" any javascript object to be JSON.stringified. Before we run verify the scrubber will be run against the complete string before running verify against it.

**Kind**: static property of [<code>approvals</code>](#module_approvals)

| Param | Type | Description |
| --- | --- | --- |
| dirName | <code>string</code> | Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files. |
| testName | <code>string</code> | A file name safe string to call the file associated with this test. |
| data | <code>string</code> \| <code>Buffer</code> | This can be any JavaScript object/array that will be JSON.stringified before running verify |
| scrubber | <code>\*</code> | A function that takes a string and returns a string. Approvals will call this if it exists to scrub the "data" before writing to any files. |
| optionsOverride | <code>\*</code> | An object that can contain configurational overrides as defined in the approvals configuration object. |

**Example**
```js
// basic approval test with a custom scrubber
var approvals = require('approvals');
var scrubber = approvals.scrubbers.multiScrubber([
   function (data) {
     return (data || '').replace("some text", "some other text");
   },
   approvals.scrubbers.guidScrubber // to remove guids from the received data
});
approvals.verifyAndScrub(__dirname, 'sample-approval-test', { a: "some text in an object" }, scrubber);
```
<a name="module_approvals.verifyWithControl"></a>

### approvals.verifyWithControl
This allows you to take full control of naming and writing files before verifying.

For an example that we use to generate the docs within the readme, check out the [test/readmeTests.js](test/readmeTests.js) in this project.

**Kind**: static property of [<code>approvals</code>](#module_approvals)

| Param | Type |
| --- | --- |
| namer | <code>Object</code> |
| writer | <code>Object</code> |
| [reporterFactory] | <code>function</code> |
| [optionsOverride] | <code>Object</code> |

<a name="module_approvals.mocha"></a>

### approvals.mocha
Configure approvals to hook into Mocha tests.

**Kind**: static property of [<code>approvals</code>](#module_approvals)

| Param | Type | Description |
| --- | --- | --- |
| optionalBaseDir | <code>\*</code> | An optional folder to save approval files to. |

<a name="module_approvals.reporters"></a>

### approvals.reporters
`reporters` gives access to the `MultiReporter`

**Kind**: static property of [<code>approvals</code>](#module_approvals)
**Example**
```js
var MultiReporter = approvals.reporters.MultiReporter
```
<a name="module_approvals.scrubbers"></a>

### approvals.scrubbers
Contains some helpful and util scrubbers that can be used for scrubbing data before saving to a received file.

**Kind**: static property of [<code>approvals</code>](#module_approvals)


<!--END-API-DOCS-->

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
