const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const approvals = require("../lib/Approvals");

for (const framework of ["Mocha", "Jest", "Vitest"]) {
  const integration = require(
    `../lib/Providers/${framework}/${framework}Approvals`,
  );
  integration.verify("missing framework");
  if (framework !== "Mocha") {
    const { [`${framework}Reporter`]: Reporter } = require(
      `../lib/Providers/${framework}/${framework}Reporter`,
    );
    const reporter = new Reporter();
    assert.equal(reporter.canReportOn("unused"), false);
    reporter.report("missing-approved", "missing-received", {});
  }
}
approvals.mocha();

// Core verification must still compare files when no framework is installed.
approvals.configure({
  reporters: ["donothing"],
  errorOnStaleApprovedFiles: false,
  forceApproveAll: false,
});
const directory = path.join(__dirname, "..", ".approval_tests_temp");
fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(
  path.join(directory, "core.approved.txt"),
  "Hello from core\n",
);
approvals.verify(directory, "core", "Hello from core");
assert.equal(fs.existsSync(path.join(directory, "core.received.txt")), false);
assert.throws(() => approvals.verify(directory, "core", "different text"));
