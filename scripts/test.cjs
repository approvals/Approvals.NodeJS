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

try {
  require("./test-isolated.cjs").runSuites(
    framework ? [framework] : [null, "mocha", "jest", "vitest"],
  );
} catch (error) {
  console.error(error.message);
  process.exit(error.status || 1);
}
