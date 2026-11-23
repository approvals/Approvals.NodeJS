import fs from "fs";
import os from "os";
import path from "path";

import { expect } from "chai";
import sinon from "sinon";

import { FinalMessages } from "../../../lib/FinalMessages.js";
import {
  setNamer,
  verify,
} from "../../../lib/Providers/Mocha/MochaApprovals.js";
import { ReportLaunchingCircuitBreaker } from "../../../lib/Reporting/ReportLaunchingCircuitBreaker.js";

describe("ReportLaunchingCircuitBreaker", function () {
  let directory: string;
  let approved: string;
  let received: string;
  let sandbox: sinon.SinonSandbox;
  let output: string[];

  beforeEach(function () {
    setNamer(this);
    ReportLaunchingCircuitBreaker.reset();
    FinalMessages.clear();
    directory = fs.mkdtempSync(path.join(os.tmpdir(), "circuit breaker "));
    approved = path.join(directory, "a.approved.txt");
    received = path.join(directory, "a.received.txt");
    fs.writeFileSync(approved, "same");
    fs.writeFileSync(received, "same");
    output = [];
    sandbox = sinon.createSandbox();
    sandbox.stub(console, "log").callsFake((...args) => {
      output.push(`${args.join(" ")}\n`);
    });
    sandbox.stub(process.stdout, "write").callsFake((text: any) => {
      output.push(String(text));
      return true;
    });
  });

  afterEach(function () {
    sandbox.restore();
    ReportLaunchingCircuitBreaker.reset();
    FinalMessages.clear();
    fs.rmSync(directory, { recursive: true, force: true });
  });

  it("lets reports launch while under the limit", function () {
    ReportLaunchingCircuitBreaker.setMaxLaunch(2);

    const rerouted = ReportLaunchingCircuitBreaker.check(
      approved,
      received,
      {},
    );

    expect(rerouted).to.equal(false);
    expect(ReportLaunchingCircuitBreaker.currentCount).to.equal(1);
    expect(FinalMessages.getMessages()).to.deep.equal([]);
    expect(output).to.deep.equal([]);
  });

  it("reroutes to the nodediff reporter once the limit is exceeded", function () {
    ReportLaunchingCircuitBreaker.setMaxLaunch(0);

    const rerouted = ReportLaunchingCircuitBreaker.check(
      approved,
      received,
      {},
    );

    const text = output.join("").split(directory).join("<dir>");
    const messages = FinalMessages.getMessages().join("\n");
    sandbox.restore();
    expect(rerouted).to.equal(true);
    expect(ReportLaunchingCircuitBreaker.currentCount).to.equal(0);
    verify(`${text}\nfinal messages:\n${messages}`);
  });
});
