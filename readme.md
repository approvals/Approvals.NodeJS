# Approvals

Approval Tests Library - Capturing Human Intelligence

## Build Status
[![Build Status](https://travis-ci.org/approvals/Approvals.NodeJS.png?branch=master)](https://travis-ci.org/approvals/Approvals.NodeJS)

## Getting Approvals
    npm install approvals

## Documentation

[Approvals Github Wiki!](https://github.com/approvals/Approvals.NodeJS/wiki)

## Examples

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
    - Jasime
    - Vows

Can you think any other testing frameworks should integrate with? Consider submitting a pull request, or report a Github issue for discussion.

## Contributing

### Getting started.

```bash
git clone https://github.com/approvals/Approvals.NodeJS.git
cd Approvals.NodeJS
npm install
npm install -g grunt
grunt
```

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

### Debugging the grunt tasks (on Windows)

1. install [node_inspector](https://github.com/dannycoates/node-inspector) >`npm install -g node-inspector`
2. run node_inspector >`node-inspector`
3. type a 'debugger;' statement where you'd like to stop in the code.
4. Now run the grunt task by specifying the following > `node --debug-brk C:\Users\{YourUserName}\AppData\Roaming\npm\node_modules\grunt\bin\grunt --force [grunt_task_here]`
5. Open a webkit browser with the url printed in step 2 above.
6. Happy bug hunting!

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Llewellyn Falco, Jason Jarrett  
Licensed under the Apache license.
