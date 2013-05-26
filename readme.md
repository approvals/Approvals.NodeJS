# Approvals

Approval Tests Library - Capturing Human Intelligence

Learn more more about Approvals at [approvaltests.com](http://approvaltests.com)

## Build Status
[![Build Status](https://travis-ci.org/approvals/Approvals.NodeJS.png?branch=master)](https://travis-ci.org/approvals/Approvals.NodeJS)

## Getting Started

1. Create a project (folder)

    ```
    mkdir MyProject
    cd MyProject`
    ```
2. Install approals
    `npm install approvals` or if you have a package.json include it as a dev dependency `npm install approvals --save-dev`

3. Install [Mocha](http://visionmedia.github.io/mocha/) globally to execute our tests

    ```
    npm install -g mocha    
    ```

4. Create a sample Mocha test file.

    ```javascript
    require('approvals').mocha(__dirname);
    describe('When running some tests', function () {
        it('should be able to use Approvals', function () {
            var data = "Hello World!";
            this.verify(data);
        });
    });
    ```

5. Test the file

    ```
    mocha test.js
    ```

6. You should be presented with a diff tool. (if not, you may need to install one)

## Documentation

[Approvals Github Wiki!](https://github.com/approvals/Approvals.NodeJS/wiki)

## Examples

#### Config (override)
```javascript
require('approvals')
    .configure({
        reporters:  ["p4merge", "opendiff", "tortisemerge", "gitdiff"],
        appendEOL: false, // default is (still up for discussion, but currently true on windows false everywhere else
        EOL:  require('os').EOL
    })
/* ... */
```

#### Others?

- TODO:
    - Manual calls for verify/naming/etc.
    - Jasime
    - Vows

Can you think any other testing frameworks should integrate with? Consider submitting a pull request, or report a Github issue for discussion.

## Contributing

Check out the [guidlines](CONTRIBUTING.md)!

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Llewellyn Falco, Jason Jarrett  
Licensed under the Apache license.
