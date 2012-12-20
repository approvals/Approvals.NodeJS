# Approvals

Approval Tests Library - Capturing Human Intelligence

## Getting Started
~~Install the module with: `npm install Approvals`~~ (Well not yet - when we get a version ready :))

```javascript
var Approvals = require('Approvals');
var data = "Hello World!";
Approvals.verify(data); // "awesome"
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing

### Getting started.

```bash
git clone https://github.com/approvals/Approvals.NodeJS.git
cd Approvals.NodeJS
npm install
grunt
```

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

### Debugging the grunt tasks (on Windows)

1. install [node_inspector](https://github.com/dannycoates/node-inspector) >`npm install -g node-inspector`
2. run node_inspector >`node-inspector`
3. Open a webkit browser with the url given after step 2 above.
4. Now run the grunt task by specifying the following > `node --debug-brk C:\Users\{YourUserName}\AppData\Roaming\npm\node_modules\grunt\bin\grunt --force [grunt_task_here]`
5. You should now be able to be able to debug in the browser

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Llewellyn Falco, Jason Jarrett  
Licensed under the Apache license.
