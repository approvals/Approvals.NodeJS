const { spawnSync } = require("node:child_process");

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

const scripts = framework
  ? ["lint", framework]
  : ["lint", "mocha", "jest", "vitest", "test:projects"];

for (const script of scripts) {
  const result = spawnSync(
    process.execPath,
    [process.env.npm_execpath, "run", script],
    { stdio: "inherit" },
  );
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}
