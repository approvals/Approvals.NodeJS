# Approvals

Approval Tests Library - Capturing Human Intelligence

Learn more more about Approvals at [approvaltests.com](http://approvaltests.com)

# Latest Builds

 Service | Status
------------- | -------------
Linux ([Travis CI](https://travis-ci.org/)) | [![Build Status](https://travis-ci.org/approvals/Approvals.NodeJS.png?branch=master)](https://travis-ci.org/approvals/Approvals.NodeJS)
Windows ([AppVeyor](http://appveyor.com)) | [![Build status](https://ci.appveyor.com/api/projects/status/fwyi6sryl03h9em6)](https://ci.appveyor.com/project/JasonJarrett/approvals-nodejs)
Coverage ([Coveralls](https://coveralls.io)) | [![Coverage Status](https://coveralls.io/repos/approvals/Approvals.NodeJS/badge.svg)](https://coveralls.io/r/approvals/Approvals.NodeJS)


## Invoke via:

- [Mocha](http://visionmedia.github.io/mocha/) tests
- [Jasmine](http://pivotal.github.io/jasmine/) tests
- [Approvals API](https://github.com/approvals/Approvals.NodeJS/wiki/Manual-API) (`require('approvals').verify(...)`)
- [Command line Utility](https://github.com/approvals/Approvals.NodeJS/wiki/Command-Line)

## Getting Started

Below is a simple getting started using Mocha. We now support Jasmine as well, just replace mocha with Jasmine below and you should be able to get started.

1. Create a project (folder)

  ```
  mkdir MyProject
  cd MyProject`
  ```

2. Install approvals
  `npm install --save-dev approvals`

3. Install [Mocha](http://visionmedia.github.io/mocha/) globally to execute our tests

  ```
  npm install -g mocha  
  ```

4. Create a sample Mocha test file called `test.js`.

  ```javascript
  require('approvals')
    .configure(/* options - see below */)
    .mocha(__dirname);

  describe('When running some tests', function () {
    it('should be able to use Approvals', function () {
      var data = "Hello World!";
      this.verify(data);  // or this.verifyAsJSON(data)
    });
  });
  ```

5. Test the file with mocha.

  ```
  mocha test.js
  ```

6. You should be presented with a diff tool. (if not, you may need to install one)

## Documentation

[Approvals Github Wiki!](https://github.com/approvals/Approvals.NodeJS/wiki)

## Config (overriding)

The default configuration can be overriden by using the `.configure(...)` as shown below.

```javascript
require('approvals')
  .configure({

    // The strategy for determining which reporter to use will likely
    // change at some point. For now, you can configure priority here.
    // What'd I'd prefer is if each project has a configuraiton file
    // and each user could setup a ~/.approvalConfig file
    // which would contain their preferred merge/diff tools
    reporters:  ["p4merge", "opendiff", "tortoisemerge", "gitdiff"],

    // Some diff tools automatically append an EOL to a merge file
    // Setting this to true helps with those cases...
    appendEOL: false,

    EOL:  require('os').EOL,

    // This helps keep the project clean of files
    // that became stale due to removal of test
    // or after a rename
    errorOnStaleApprovedFiles: true,

    // On some files or projects a Byte Order
    // Mark can be inserted and cause issues,
    // this allows you to force it to be stripped
    stripBOM: false

  })
  .mocha(__dirname); // or .jasmine(__dirname);
/* ... */
```

#### Source Control

- `*.approved.*` files should be checked into source control.
- `*.received.*` files should be **IGNORED**.

  ##### Git

  If you're using [Git](http://git-scm.com) add this to your `.gitignore`:

  ```
  *.received.*
  ```

  Another issue that can crop up is the line-endings as git can change the files depending on checking out the file on linux/mac vs windows.

  The suggested fix is to add `*.approved.* binary` to your `.gitattributes`

## Contributing

Check out the [guidlines](CONTRIBUTING.md)!

## License
Copyright (c) 2012-2014 Llewellyn Falco, Jason Jarrett  
Licensed under the Apache license.
