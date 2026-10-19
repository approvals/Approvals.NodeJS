const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createRequire } = require("node:module");

const root = path.resolve(__dirname, "..");
const frameworks = ["mocha", "jest", "vitest"];

function npm(args, cwd) {
  execFileSync(process.execPath, [process.env.npm_execpath, ...args], {
    cwd,
    stdio: "inherit",
    env: { ...process.env, NODE_PATH: "" },
  });
}

function copyReceivedFiles(directory, destination) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    const target = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyReceivedFiles(source, target);
    } else if (entry.name.includes(".received.")) {
      fs.mkdirSync(destination, { recursive: true });
      fs.copyFileSync(source, target);
    }
  }
}

function runSuites(selected, { coverage = false, args = [] } = {}) {
  const original = JSON.parse(fs.readFileSync(path.join(root, "package.json")));
  for (const framework of frameworks) {
    assert.equal(original.peerDependenciesMeta?.[framework]?.optional, true);
    assert.equal(original.dependencies[framework], undefined);
  }
  for (const framework of selected) {
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "approvals-suite-"),
    );
    console.log(
      `\nRunning isolated ${framework || "framework-free core"} tests`,
    );
    try {
      for (const file of [
        "lib",
        "bin",
        "readme.md",
        ".npmrc",
        ".mocharc.js",
        ".mocha-multi-reporters.json",
        "jest.config.js",
        "vitest.config.ts",
        "tsconfig.json",
        ".nycrc",
        "scripts/check-core.cjs",
      ]) {
        fs.cpSync(path.join(root, file), path.join(directory, file), {
          recursive: true,
        });
      }
      let suite;
      if (framework) {
        fs.cpSync(
          path.join(root, "test", framework),
          path.join(directory, "test", framework),
          {
            recursive: true,
            filter: (source) =>
              path.basename(source) !== "node_modules" &&
              !path.basename(source).includes(".received."),
          },
        );
        suite = JSON.parse(
          fs.readFileSync(
            path.join(directory, "test", framework, "package.json"),
          ),
        );
      }
      const manifest = { ...original };
      delete manifest.workspaces;
      delete manifest.peerDependencies;
      delete manifest.peerDependenciesMeta;
      // This directory is a test harness. Only the selected suite's framework
      // is installed; the root's workspace links must not bring in the others.
      manifest.devDependencies = framework
        ? { ...original.devDependencies, ...suite.devDependencies }
        : {};
      manifest.scripts = {
        test: framework
          ? suite.scripts[coverage ? "test:coverage" : "test:suite"]
          : "node scripts/check-core.cjs",
      };
      fs.writeFileSync(
        path.join(directory, "package.json"),
        JSON.stringify(manifest, null, 2),
      );
      const lock = JSON.parse(
        fs.readFileSync(path.join(root, "package-lock.json")),
      );
      lock.packages[""] = manifest;
      for (const [name, entry] of Object.entries(lock.packages)) {
        if (entry.link || name.startsWith("test/")) delete lock.packages[name];
      }
      fs.writeFileSync(
        path.join(directory, "package-lock.json"),
        JSON.stringify(lock),
      );
      npm(
        [
          "install",
          "--workspaces=false",
          "--include=dev",
          "--ignore-scripts",
          "--no-audit",
          "--no-fund",
        ],
        directory,
      );

      const libraryRequire = createRequire(
        path.join(directory, "lib", "Approvals.js"),
      );
      for (const other of [...frameworks, "ts-jest"]) {
        if (
          other === framework ||
          (other === "ts-jest" && framework === "jest")
        ) {
          assert.ok(libraryRequire.resolve(other));
        } else {
          assert.throws(() => libraryRequire.resolve(other), {
            code: "MODULE_NOT_FOUND",
          });
        }
      }
      npm(["test", "--", ...args], directory);
    } finally {
      for (const artifact of ["test-reports", "coverage", ".nyc_output"]) {
        const source = path.join(directory, artifact);
        if (fs.existsSync(source))
          fs.cpSync(source, path.join(root, artifact), { recursive: true });
      }
      if (framework && fs.existsSync(path.join(directory, "test", framework))) {
        copyReceivedFiles(
          path.join(directory, "test", framework),
          path.join(root, "test", framework),
        );
      }
      const readmeReceived = path.join(directory, "readme.received.md");
      if (fs.existsSync(readmeReceived))
        fs.copyFileSync(readmeReceived, path.join(root, "readme.received.md"));
      fs.rmSync(directory, { recursive: true, force: true });
    }
  }
}

module.exports = { runSuites };

if (require.main === module) {
  const [framework, ...args] = process.argv.slice(2);
  if (!frameworks.includes(framework)) {
    console.error(
      "Usage: node scripts/test-isolated.cjs mocha|jest|vitest [test arguments]",
    );
    process.exit(2);
  }
  try {
    runSuites([framework], {
      coverage: args.includes("--coverage"),
      args: args.filter((arg) => arg !== "--coverage"),
    });
  } catch (error) {
    console.error(error.message);
    process.exit(error.status || 1);
  }
}
