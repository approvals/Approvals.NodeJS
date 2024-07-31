# Approvals (Approval Tests for Node.js)

<!-- toc -->
## Contents

  * [Intro](#intro)
  * [Badges](#badges)
  * [Integrations](#integrations)
  * [Getting Started](#getting-started)
    * [Jest Typescript Starter Project](#jest-typescript-starter-project)
    * [Mocha](#mocha)
  * [Documentation](#documentation)
  * [CLI](#cli)
    * [Install Approvals CLI](#install-approvals-cli)
    * [CLI Help](#cli-help)
  * [Simple hello world](#simple-hello-world)
  * [Specify diff reporter (great for C.I.)](#specify-diff-reporter-great-for-ci)
  * [Multiple diff reporters](#multiple-diff-reporters)
  * [Reporters](#reporters)
    * [Built-In Reporters](#built-in-reporters)
  * [Supported Diff Tools](#supported-diff-tools)
    * [Custom Reporter](#custom-reporter)
  * [Configuration](#configuration)
  * [API](#api)
  * [approvals](#approvals)
    * [approvals.reporters](#approvalsreporters)
      * [reporters.MultiReporter](#reportersmultireporter)
    * [approvals~configure(overrideOptions)](#approvalsconfigureoverrideoptions)
    * [approvals~getConfig(overrideOptions) ⇒ <code>Object</code>](#approvalsgetconfigoverrideoptions--codeobjectcode)
    * [approvals~mocha(optionalBaseDir)](#approvalsmochaoptionalbasedir)
    * [approvals~verifyAndScrub(dirName, testName, data, scrubber, optionsOverride)](#approvalsverifyandscrubdirname-testname-data-scrubber-optionsoverride)
    * [approvals~verify(dirName, testName, data, optionsOverride)](#approvalsverifydirname-testname-data-optionsoverride)
    * [approvals~verifyAsJSON(dirName, testName, data, optionsOverride)](#approvalsverifyasjsondirname-testname-data-optionsoverride)
    * [approvals~verifyAsJSONAndScrub(dirName, testName, data, scrubber, optionsOverride)](#approvalsverifyasjsonandscrubdirname-testname-data-scrubber-optionsoverride)
    * [approvals~verifyWithControl(namer, writer, [reporterFactory], [optionsOverride])](#approvalsverifywithcontrolnamer-writer-reporterfactory-optionsoverride)
  * [Source Control](#source-control)
    * [Git](#git)
  * [Contributing](#contributing)
  * [License](#license)<!-- endToc -->

<a name="intro" />

## Intro

Approval Tests Library - **Capturing Human Intelligence**

What is an approval test? Check out a brief [overview here](http://staxmanade.com/2015/01/approval-tests---overview/) or learn more about Approvals at [approvaltests.com](http://approvaltests.com).

<a name="build-details" />

## Badges

| Service                      | Status                                                                                                                                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Package                      | [![npm version](https://badge.fury.io/js/approvals.svg)](https://badge.fury.io/js/approvals)                                                                                                        |
| Github (Linux, Mac, Windows) | [![Build & Test](https://github.com/approvals/Approvals.NodeJS/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/approvals/Approvals.NodeJS/actions/workflows/build-and-test.yml) |

<a name="integrations" />

## Integrations

- [Mocha](http://mochajs.org/) tests, see the getting-started
- [Approvals API](#api) (`require('approvals').verify(...)`)
- [Command line Utility](#cli)

<a name="getting-started" />

## Getting Started

### Jest Typescript Starter Project

If you want to jump start a new project, clone the [Jest Starter Project](https://github.com/approvals/ApprovalTests.TypeScript.Jest.StarterProject)

### Mocha

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

1. Create a sample Mocha test file called `SimpleLogger.test.js`.

   ```javascript
   require("approvals").mocha();

   describe("When running some tests", function () {
     it("should be able to use Approvals", function () {
       var data = "Hello World!";
       this.verify(data); // or this.verifyAsJSON(data)
     });
   });
   ```

1. Test the file with mocha.

   ```shell
   mocha SimpleLogger.test.js
   ```

1. You should be presented with a diff tool. (if not, you may need to install one?)

<a name="documentation">

## Documentation

If using Jest, see [more documentation here](docs/README.md).

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

| Arg                       | Description                                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| \*\*[-f                   | --forceapproveall]\*\*                                                                                                                                                          | Skip the approve step and apply the results to the .approved.txt file (good for a first time run) |
| [--reporter difftool] | supports multiple EX: `--reporter opendiff --reporter gitdiff`                                                                                                                  |
| [--outdir]            | dir to place approval file - defaults to current directory                                                                                                                      |
| [--verbose]           | extra debug info                                                                                                                                                                |
| TODO:                 | We need to extend the supported args to include other approval options. (file an [issue](https://github.com/approvals/Approvals.NodeJS/issues) if you need one that's not here) |

# Examples

## Simple hello world

```
echo 'Hello World!' | approvals helloWorldTest
```

## Specify diff reporter (great for C.I.)

```
echo 'Hello World!' | approvals helloWorldTest --reporter gitdiff
```

## Multiple diff reporters

```
echo 'Hello World!' | approvals helloWorldTest --reporter gitdiff --reporter p4merge
```

```

<!--END-CLI-DOCS-->

<a name="reporters" />

## Reporters

### Built-In Reporters

Any of the following reporter may suite your needs. Some support images, some only diffing text, some on mac and linux, some only on windows... Feel free to configure the system to automatically choose your favorite.

## Supported Diff Tools

| approval name   | Program                                                                                                          | Windows  | Mac/Linux | Notes                                                                                                                                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------- | :------: | :-------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `beyondcompare` | [Beyond Compare](http://www.scootersoftware.com/)                                                                | &#10003; | &#10003;  |                                                                                                                                                                                                                                                  |
| `copycommand`   | [git diff](http://git-scm.com/docs/git-diff) (console diff)                                                      | &#10003; | &#10003;  | Great for C.I. builds runs.                                                                                                                                                                                                                      |
| `diffmerge`     | [DiffMerge](https://sourcegear.com/diffmerge/)                                                                   | &#10003; | &#10003;  |                                                                                                                                                                                                                                                  |
| `donothing`     |                                                                                                                  | &#10003; | &#10003;  | This one does what it says - nothing.                                                                                                                                                                                                            |
| `gitdiff`       | [git diff](http://git-scm.com/docs/git-diff) (console diff)                                                      | &#10003; | &#10003;  | Using git cli to diff files. Useful in C.I. builds                                                                                                                                                                                               |
| `icdiff`        | [Icdiff](https://github.com/jeffkaufman/icdiff)                                                                  | &#10003; | &#10003;  |                                                                                                                                                                                                                                                  |
| `kdiff3`        | [KDiff3](http://kdiff3.sourceforge.net/)                                                                         | &#10003; | &#10003;  |                                                                                                                                                                                                                                                  |
| `kompare`       | [Kompare](https://www.kde.org/applications/development/kompare/)                                                 |    ?     | &#10003;  |                                                                                                                                                                                                                                                  |
| `meld`          | [Meld](http://meldmerge.org/)                                                                                    | &#10003; | &#10003;  |                                                                                                                                                                                                                                                  |
| `multi`         |                                                                                                                  | &#10003; | &#10003;  | This allows you to run multiple reporters at the same time. EX: when verifying images, you might like to use `p4merge` along with the `copycommand` reporter to get the copy CLI command to approve an image as well as view the diff in a tool. |
| `nodediff`      | [nodediff](https://github.com/kpdecker/jsdiff) (console diff)                                                    | &#10003; | &#10003;  | colorized CLI output without a popup of a diff tool                                                                                                                                                                                              |
| `opendiff`      | [opendiff](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/opendiff.1.html) |          | &#10003;  |                                                                                                                                                                                                                                                  |
| `p4merge`       | [p4merge](http://www.perforce.com/product/components/perforce-visual-merge-and-diff-tools)                       | &#10003; | &#10003;  |                                                                                                                                                                                                                                                  |
| `tortoisemerge` | [Tortise merge](http://tortoisesvn.net/docs/release/TortoiseSVN_en/tsvn-dug-merge.html)                          | &#10003; | &#10003;  |                                                                                                                                                                                                                                                  |
| `vimdiff`       |                                                                                                                  | &#10003; | &#10003;  |                                                                                                                                                                                                                                                  |
| `visualstudio`  | [Visual Studio Diff tool](http://msdn.microsoft.com/en-us/library/bb385990.aspx)                                 | &#10003; |           |
| `vscode`        | [Visual Studio Code Diff tool](https://code.visualstudio.com/)                                                   | &#10003; | &#10003;  |
| `vscodium`      | [VSCodium Diff tool](https://vscodium.com/)                                                                      | &#10003; | &#10003;  |

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

1. Starting with the defaults (as shown in the JS object below) this is defined in [lib/config.ts](lib/config.ts).
1. We then take and override the defaults (and only the properties specified) with config in a yaml or json file in your home directory `~/.approvalsConfig`.
1. You can then call [`approvals.configure({...})`](#module_approvals.configure).
1. Then passing any specific configuration at the test level as the last parameter in the verify function `.verify(..., {...overridden config...});`. See [API](#api) for specific parameters.

Here's an example of using a single reporter `p4merge`, and overriding whatever is configured. This will only override this specific test.

```javascript
it("should use a specific reporter", function () {
  this.verify("some data", {
    reporters: ["p4merge"],
  });
});
```

If you have the need to execute multiple reporters on a single failure.

Say you made an "awesomeDiffReporter" and wanted it to run that in combination with a "notifyTheBossViaEmailReporter" you can use the MultiReporter like below.

```javascript
var approvals = require("approvals");
var MultiReporter = approvals.reporters.MultiReporter;

it("should use a multiple reporters", function () {
  this.verify("some data", {
    reporters: [new MultiReporter(["p4merge", "copycommand"])],
  });
});
```

<!-- snippet: default_config -->
<a id='snippet-default_config'></a>
```ts
export const defaultConfig: Config = {
  reporters: [
    "BeyondCompare",
    "diffmerge",
    "p4merge",
    "tortoisemerge",
    "nodediff",
    "opendiff",
    "gitdiff",
  ],
  normalizeLineEndingsTo: false,
  failOnLineEndingDifferences: false,
  appendEOL: true,
  EOL: os.EOL,
  errorOnStaleApprovedFiles: true,
  shouldIgnoreStaleApprovedFile: () => false,
  stripBOM: false,
  forceApproveAll: false,
  blockUntilReporterExits: false,
  maxLaunches: 10,
};
```
<sup><a href='/lib/config.ts#L25-L47' title='Snippet source file'>snippet source</a> | <a href='#snippet-default_config' title='Start of snippet'>anchor</a></sup>
<!-- endSnippet -->

<a name="api" />

## API

<!--BEGIN-API-DOCS-->
<!-- GENERATED - DO NOT MODIFY API DOCS IN THIS README -->
<!-- Update docs in the source ./lib/Approvals.js -->

<a name="module_approvals"></a>

## approvals
Approvals module.


* [approvals](#module_approvals)
    * _static_
        * [.reporters](#module_approvals.reporters)
            * [.MultiReporter](#module_approvals.reporters.MultiReporter)
    * _inner_
        * [~configure(overrideOptions)](#module_approvals..configure)
        * [~getConfig(overrideOptions)](#module_approvals..getConfig) ⇒ <code>Object</code>
        * [~mocha(optionalBaseDir)](#module_approvals..mocha)
        * [~verifyAndScrub(dirName, testName, data, scrubber, optionsOverride)](#module_approvals..verifyAndScrub)
        * [~verify(dirName, testName, data, optionsOverride)](#module_approvals..verify)
        * [~verifyAsJSON(dirName, testName, data, optionsOverride)](#module_approvals..verifyAsJSON)
        * [~verifyAsJSONAndScrub(dirName, testName, data, scrubber, optionsOverride)](#module_approvals..verifyAsJSONAndScrub)
        * [~verifyWithControl(namer, writer, [reporterFactory], [optionsOverride])](#module_approvals..verifyWithControl)

<a name="module_approvals.reporters"></a>

### approvals.reporters
`reporters` gives access to the `MultiReporter`

**Kind**: static property of [<code>approvals</code>](#module_approvals)
**Example**
```js
const MultiReporter = approvals.reporters.MultiReporter
```
<a name="module_approvals.reporters.MultiReporter"></a>

#### reporters.MultiReporter
This allows access to the MultiReporter constructor.
You can use this to run multiple reporters at the same time.

**Kind**: static property of [<code>reporters</code>](#module_approvals.reporters)
**Example**
```js
approvals.verify(__dirname, "multi-reporter-example", "some data", {
  reporters: [
    new MultiReporter('p4merge', 'copycommand')
  ]
});
```
<a name="module_approvals..configure"></a>

### approvals~configure(overrideOptions)
Allows you to provide overrides to the default configuration.

**Kind**: inner method of [<code>approvals</code>](#module_approvals)

| Param | Type |
| --- | --- |
| overrideOptions | <code>\*</code> |

**Example**
```js
const approvals = require('approvals');
approvals.configure({
  reporters: ['p4merge']
});
```
<a name="module_approvals..getConfig"></a>

### approvals~getConfig(overrideOptions) ⇒ <code>Object</code>
Allows the creation of an approvals configuration object using any passed in options to override the defaults.

**Kind**: inner method of [<code>approvals</code>](#module_approvals)
**Returns**: <code>Object</code> - approvals config object with any options overridden.

| Param | Type |
| --- | --- |
| overrideOptions | <code>Object</code> |

<a name="module_approvals..mocha"></a>

### approvals~mocha(optionalBaseDir)
Configure approvals to hook into Mocha tests.

**Kind**: inner method of [<code>approvals</code>](#module_approvals)

| Param | Type | Description |
| --- | --- | --- |
| optionalBaseDir | <code>\*</code> | An optional folder to save approval files to. |

<a name="module_approvals..verifyAndScrub"></a>

### approvals~verifyAndScrub(dirName, testName, data, scrubber, optionsOverride)
Use this to apply the scrubber function to any data before running verify.

**Kind**: inner method of [<code>approvals</code>](#module_approvals)

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
const approvals = require('approvals');
const scrubber = approvals.scrubbers.multiScrubber([
   function (data) {
     return (data || '').replace("some text", "some other text");
   },
   approvals.scrubbers.guidScrubber // to remove guids from the received data
});
approvals.verifyAndScrub(__dirname, 'sample-approval-test', "some text to verify", scrubber);
```
<a name="module_approvals..verify"></a>

### approvals~verify(dirName, testName, data, optionsOverride)
**Kind**: inner method of [<code>approvals</code>](#module_approvals)

| Param | Type | Description |
| --- | --- | --- |
| dirName | <code>string</code> | Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files. |
| testName | <code>string</code> | A file name save string to call the file associated with this test. |
| data | <code>string</code> \| <code>Buffer</code> | Either the string to save as a text file or a Buffer that represents an image |
| optionsOverride | <code>\*</code> | An object that can contain configurational overrides as defined in the approvals configuration object. |

**Example**
```js
// basic approval test
const approvals = require('approvals');
approvals.verify(__dirname, 'sample-approval-test', "some text to verify");
```
**Example**
```js
// basic approval test providing an option to override configuration
const approvals = require('approvals');
approvals.verify(__dirname, 'sample-approval-test', "some text to verify", { normalizeLineEndingsTo: true });
```
<a name="module_approvals..verifyAsJSON"></a>

### approvals~verifyAsJSON(dirName, testName, data, optionsOverride)
You can pass as "data" any javascript object to be JSON.stringified and run verify against.

**Kind**: inner method of [<code>approvals</code>](#module_approvals)

| Param | Type | Description |
| --- | --- | --- |
| dirName | <code>string</code> | Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files. |
| testName | <code>string</code> | A file name safe string to call the file associated with this test. |
| data | <code>string</code> \| <code>Buffer</code> | This can be any JavaScript object/array that will be JSON.stringified before running verify |
| optionsOverride | <code>\*</code> | An object that can contain configurational overrides as defined in the approvals configuration object. |

**Example**
```js
const approvals = require('approvals');
approvals.verifyAndScrub(__dirname, 'sample-approval-test', { a: "some text in an object" });
```
<a name="module_approvals..verifyAsJSONAndScrub"></a>

### approvals~verifyAsJSONAndScrub(dirName, testName, data, scrubber, optionsOverride)
You can pass as "data" any javascript object to be JSON.stringified. Before we run verify the scrubber will be run against the complete string before running verify against it.

**Kind**: inner method of [<code>approvals</code>](#module_approvals)

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
const approvals = require('approvals');
const scrubber = approvals.scrubbers.multiScrubber([
   function (data) {
     return (data || '').replace("some text", "some other text");
   },
   approvals.scrubbers.guidScrubber // to remove guids from the received data
});
approvals.verifyAndScrub(__dirname, 'sample-approval-test', { a: "some text in an object" }, scrubber);
```
<a name="module_approvals..verifyWithControl"></a>

### approvals~verifyWithControl(namer, writer, [reporterFactory], [optionsOverride])
This allows you to take full control of naming and writing files before verifying.

For an example that we use to generate the docs within the readme, check out the [test/readmeTests.ts](test/readmeTests.ts) in this project.

**Kind**: inner method of [<code>approvals</code>](#module_approvals)

| Param | Type |
| --- | --- |
| namer | <code>Object</code> |
| writer | <code>Object</code> |
| [reporterFactory] | <code>function</code> |
| [optionsOverride] | <code>Object</code> |



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
