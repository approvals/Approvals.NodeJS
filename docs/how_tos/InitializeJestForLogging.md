# How to initialize Jest for logging

<!-- toc -->

## Contents

- [Steps](#steps)
  - [Step 1 - Add to `jest.config.js`](#step-1---add-to-jestconfigjs)
  - [Step 2 - Create a `JestGlobalSetup.ts` file](#step-2---create-a-jestglobalsetupts-file)
- [Where should I create the `JestGlobalSetup.ts` file located](#where-should-i-create-the-jestglobalsetupts-file-located)<!-- endToc -->

## Steps

### Step 1 - Add to `jest.config.js`

<!-- snippet: jest_config_setup -->

<a id='snippet-jest_config_setup'></a>

```js
globalSetup: "./test/Providers/Jest/JestGlobalSetup.mjs",
```

<sup><a href='/jest.config.js#L20-L22' title='Snippet source file'>snippet source</a> | <a href='#snippet-jest_config_setup' title='Start of snippet'>anchor</a></sup>

<!-- endSnippet -->

### Step 2 - Create a `JestGlobalSetup.ts` file

<!-- snippet: JestGlobalSetup.mts -->

<a id='snippet-JestGlobalSetup.mts'></a>

```mts
import { initializeGlobalsForJest } from "../../../lib/Providers/Jest/JestSetup.js";

export default async function globalSetup(): Promise<void> {
  initializeGlobalsForJest();
}
```

<sup><a href='/test/Providers/Jest/JestGlobalSetup.mts#L1-L5' title='Snippet source file'>snippet source</a> | <a href='#snippet-JestGlobalSetup.mts' title='Start of snippet'>anchor</a></sup>

<!-- endSnippet -->

## Where should I create the `JestGlobalSetup.ts` file located

This file, `JestGlobalSetup.ts` is your file and can be located anywhere in your test code.
just be sure to reference it in the `jest.config.js`
