import { spawnSync } from "node:child_process";
import path from "node:path";
import { expect, test } from "@jest/globals";

test("approvals --help output", () => {
  const script = path.join(process.cwd(), "bin", "index.js");
  const result = spawnSync(script, ["--help"], {
    encoding: "utf8",
    env: { ...process.env, FORCE_COLOR: "0" },
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || String(result.error));
  }

  expect(result.stdout.replace(/\r\n/g, "\n")).toMatchSnapshot();
});
