const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createRequire } = require("node:module");

const root = path.resolve(__dirname, "..");
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "approvals-projects-"));
const frameworks = ["mocha", "jest", "vitest"];

function npm(args, cwd, capture = false) {
  return execFileSync(process.execPath, [process.env.npm_execpath, ...args], {
    cwd,
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
  });
}

try {
  const [{ filename }] = JSON.parse(
    npm(["pack", "--json", "--pack-destination", temporary], root, true),
  );
  for (const framework of [null, ...frameworks]) {
    const project = framework
      ? `${framework === "mocha" ? "mochajs" : framework}-tests`
      : "no-framework";
    const directory = path.join(temporary, project);
    console.log(`\nTesting consumer: ${project}`);
    if (framework) {
      fs.cpSync(path.join(root, "test-projects", project), directory, {
        recursive: true,
        filter: (source) => path.basename(source) !== "node_modules",
      });
    } else {
      fs.mkdirSync(directory);
      fs.writeFileSync(
        path.join(directory, "package.json"),
        '{"private":true}',
      );
    }
    const manifestPath = path.join(directory, "package.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    manifest.dependencies = {
      ...manifest.dependencies,
      "@approval-tests/approvals": `file:${path.join(temporary, filename)}`,
    };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    npm(["install", "--no-audit", "--no-fund", "--ignore-scripts"], directory);

    // Check from inside the installed library, where imports must resolve.
    const consumerRequire = createRequire(manifestPath);
    const libraryRequire = createRequire(
      consumerRequire.resolve("@approval-tests/approvals"),
    );
    for (const other of [...frameworks, "ts-jest"]) {
      if (other === framework) {
        assert.ok(libraryRequire.resolve(other));
      } else {
        assert.throws(() => libraryRequire.resolve(other), {
          code: "MODULE_NOT_FOUND",
        });
      }
    }
    execFileSync(
      process.execPath,
      ["-e", 'require("@approval-tests/approvals")'],
      {
        cwd: directory,
        stdio: "inherit",
      },
    );
    for (const other of frameworks.filter((name) => name !== framework)) {
      const provider = { mocha: "Mocha", jest: "Jest", vitest: "Vitest" }[
        other
      ];
      execFileSync(
        process.execPath,
        [
          "-e",
          `
        const assert = require("node:assert/strict");
        const approvals = require("@approval-tests/approvals");
        const integration = require("@approval-tests/approvals/lib/Providers/${provider}/${provider}Approvals");
        integration.verify("missing framework");
        if (${JSON.stringify(other)} === "mocha") approvals.mocha();
        ${
          other === "mocha"
            ? ""
            : `const { ${provider}Reporter } = require("@approval-tests/approvals/lib/Providers/${provider}/${provider}Reporter");
        const reporter = new ${provider}Reporter();
        assert.equal(reporter.canReportOn("unused"), false);
        reporter.report("missing-approved", "missing-received", {});`
        }
      `,
        ],
        { cwd: directory, stdio: "inherit" },
      );
    }
    if (framework) npm(["test"], directory);
  }
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
