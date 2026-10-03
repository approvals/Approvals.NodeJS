## Contributing

### Dependencies

- [`node && npm`](http://nodejs.org)

### Getting started.

```bash
git clone https://github.com/approvals/Approvals.NodeJS.git
cd Approvals.NodeJS
./build_and_test.sh
```

In lieu of a formal styleguide, take care to maintain the existing coding style, most style rules enforce by [eslint](http://eslint.org/). Add unit tests for any new or changed functionality. Run `./build_and_test.sh` before submitting changes.

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
