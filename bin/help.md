# approvals

Usage: approvals testName
  **[--reporter difftool]** : supports multiple EX: `--reporter opendiff --reporter gitdiff`
  **[--outdir]**            : dir to place approval file - defaults to current directory
  **[--verbose]**           : extra debug info
  **TODO:**                 : We need to extend the supported args to include other approval options. (file an [issue](https://github.com/approvals/Approvals.NodeJS/issues) if you need one that's not here)

# Examples

    echo 'Hello World!' | approvals helloWorldTest --reporter gitdiff
