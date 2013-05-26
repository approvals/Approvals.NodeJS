# Approvals

Approval Tests Library - Capturing Human Intelligence

Learn more more about Approvals at [approvaltests.com](http://approvaltests.com)

## Build Status
[![Build Status](https://travis-ci.org/approvals/Approvals.NodeJS.png?branch=master)](https://travis-ci.org/approvals/Approvals.NodeJS)

## Getting Approvals
    npm install approvals

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

#### Mocha
```javascript
require('approvals').mocha(__dirname);
describe('And a Mocha sub-describe', function () {
	it('should be able to use Approvals', function () {
		var data = "Hello World!";
		this.verify(data);
	});
});
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
