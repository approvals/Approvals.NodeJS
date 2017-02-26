## Contributing

### Dependencies

- [`node && npm`](http://nodejs.org)
- `gulp` - you can install that with `npm install -g gulp`

### Getting started.

```bash
git clone https://github.com/approvals/Approvals.NodeJS.git
cd Approvals.NodeJS
npm install
gulp
```

In lieu of a formal styleguide, take care to maintain the existing coding style, most style rules enforce by [eslint](http://eslint.org/). Add unit tests for any new or changed functionality. Lint and test your code using [gulp](https://github.com/gulpjs/gulp).

### How to release a new version

> These are more notes for me (@staxmanade) so I can recall how to do a release

# Inspect package before publish

```
npm pack
```

# Release
```
npm version patch
npm publish
```
