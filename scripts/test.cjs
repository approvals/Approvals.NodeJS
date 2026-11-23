const usage = "Usage: npm test -- [--framework mocha|jest|vitest]";
const args = process.argv.slice(2);
let framework;

if (args.length === 1 && args[0] === "--help") {
  console.log(usage);
  process.exit(0);
}

if (args.length) {
  if (args.length === 2 && args[0] === "--framework") {
    framework = args[1];
  } else if (args.length === 1 && args[0].startsWith("--framework=")) {
    framework = args[0].slice("--framework=".length);
  }
  if (!["mocha", "jest", "vitest"].includes(framework)) {
    console.error(usage);
    process.exit(2);
  }
}

if (framework) {
  try {
    require("./test-isolated.cjs").runSuites([framework]);
  } catch (error) {
    console.error(error.message);
    process.exit(error.status || 1);
  }
} else {
  runAllSuitesInParallel();
}

// Each suite installs into its own temporary directory, so they can run at
// the same time. `group` holds each suite's output until it is done and prints
// the suites in the order listed, so their output never interleaves.
function runAllSuitesInParallel() {
  const { concurrently } = require("concurrently");
  const suites = ["core", "mocha", "jest", "vitest"];
  const { result } = concurrently(
    suites.map((suite) => ({
      name: suite,
      command: `node scripts/test-isolated.cjs ${suite}`,
    })),
    { group: true, prefix: "none", successCondition: "all" },
  );
  result.then(
    () => process.exit(0),
    () => process.exit(1),
  );
}
