# Quick check

Run `./quick_check.sh` after each refactoring step. It builds all TypeScript, lints, and runs
all three framework suites directly using local workspace dependencies. It prints elapsed seconds
and the exit code last, including on failure. Do not pipe it into tail or grep.

This initial implementation runs all local tests rather than selecting tests by filename.
It does not install dependencies or verify missing-framework behavior: all optional frameworks
are present together. It has no branch filtering. Use `./build_and_test.sh` before completing work;
that uses the existing isolated harness, including framework-free core validation.
