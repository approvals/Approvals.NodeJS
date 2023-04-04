<a id="top"></a>

# How to Configure Reporters with Options

<!-- toc -->
## Contents

  * [Why Configure Reporters](#why-configure-reporters)
  * [How to Select a Reporter](#how-to-select-a-reporter)
  * [See Also](#see-also)<!-- endToc -->

## Why Configure Reporters

If you want to view failures in different ways, such as with different diff tools.

## How to Select a Reporter

At the moment, you need to take advantage of the `ConfigModifier` in `Options`.

Here is an example.

<!-- snippet: configure-reporter-with-options -->
<a id='snippet-configure-reporter-with-options'></a>
```ts
let configModifier: ConfigModifier = c => {
  c.reporters = [
    new JestReporter(),
    "BeyondCompare",
  ]
  return c;
};
let options = new Options();
options = options.withConfig(configModifier);

verify('Hello', options);
```
<sup><a href='/test/Providers/Jest/JestReporter.test.ts#L10-L22' title='Snippet source file'>snippet source</a> | <a href='#snippet-configure-reporter-with-options' title='Start of snippet'>anchor</a></sup>
<!-- endSnippet -->

**Note** when passing in multiple reporters, it will use the first one that works on your system.

## See Also

- [Available Reporters](https://github.com/approvals/Approvals.NodeJS#built-in-reporters)
- [Options](../reference/Options.md)
- [Reporters](../reference/Reporters.md)

---

[Back to User Guide](/doc/README.md#top)
