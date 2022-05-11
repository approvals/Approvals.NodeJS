# Usage

`approvals testName [options]`

| Arg | Description |
| --- | ----------- |
| **[-f | --forceapproveall]**   | Skip the approve step and apply the results to the .approved.txt file (good for a first time run) |
| **[--reporter difftool]**      | supports multiple EX: `--reporter opendiff --reporter gitdiff` |
| **[--outdir]**                 | dir to place approval file - defaults to current directory |
| **[--verbose]**                | extra debug info |
| **TODO:**                      | We need to extend the supported args to include other approval options. (file an [issue](https://github.com/approvals/Approvals.NodeJS/issues) if you need one that's not here) |

# Examples

## Simple hello world

```
echo 'Hello World!' | approvals helloWorldTest
 ```

## Specify diff reporter (great for C.I.)

```
echo 'Hello World!' | approvals helloWorldTest --reporter gitdiff
```

## Multiple diff reporters

```
echo 'Hello World!' | approvals helloWorldTest --reporter gitdiff --reporter p4merge
```
