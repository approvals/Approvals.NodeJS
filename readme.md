# Approvals 

Approval Tests Library - Capturing Human Intelligence

Learn more more about Approvals at [approvaltests.com](http://approvaltests.com)

# Latest Builds

- linux: [![Build Status](https://travis-ci.org/approvals/Approvals.NodeJS.png?branch=master)](https://travis-ci.org/approvals/Approvals.NodeJS) (Thanks to [travis-ci](http://travis-ci.org))
- windows: [![Build status](https://ci.appveyor.com/api/projects/status/fwyi6sryl03h9em6)](https://ci.appveyor.com/project/JasonJarrett/approvals-nodejs) (Thanks to [AppVeyor](http://AppVeyor.com))


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
    require('approvals').mocha(__dirname);
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

## Usage

#### Config (override)

The default configuration can be overriden by using the `.configure(...)` as shown below.

```javascript
require('approvals')
    .configure({
        reporters:  ["p4merge", "opendiff", "tortoisemerge", "gitdiff"],
        appendEOL: false, // default is (still up for discussion, but currently true on windows false everywhere else
        EOL:  require('os').EOL,
        errorOnStaleApprovedFiles: true,
    }).mocha(__dirname); // or .jasmine(__dirname);
/* ... */
```

#### Approved File Artifacts
The `*.approved.*` files must be checked into source your source control. This can be an issue with git as it will change the line endings. 
The suggested fix is to add
`*.approved.* binary` to your `.gitattributes`

#### Others?

- TODO:
    - [Vows](http://vowsjs.org/)

Can you think any other testing frameworks that approvals should integrate with? Consider submitting a pull request, or report a Github issue for discussion.

## Contributing

Check out the [guidlines](CONTRIBUTING.md)!

## License
Copyright (c) 2012-2014 Llewellyn Falco, Jason Jarrett  
Licensed under the Apache license.
