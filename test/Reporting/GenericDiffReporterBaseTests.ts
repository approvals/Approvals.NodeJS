import fs from "fs";
import {expect} from "chai";
import GenericDiffReporterBase from "../../lib/Reporting/GenericDiffReporterBase";
import sinon from "sinon";

describe("GenericDiffReporterBase", function () {
    let sandbox;
    let reporter;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        reporter = new GenericDiffReporterBase("test");
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe("default base behavior of", function () {
        describe("isReporterAvailable", function () {
            it("should report true if the app is found", function () {
                sandbox.stub(fs, "existsSync").callsFake(() => true);
                expect(reporter.isReporterAvailable()).to.equal(true);
            });

            it("should report false if the app is not found", function () {
                sandbox.stub(fs, "existsSync").callsFake(() => false);
                expect(reporter.isReporterAvailable()).to.equal(false);
            });

            it("should only look up on fs once", function () {
                const fake = sandbox.stub(fs, "existsSync").callsFake(() => false);

                reporter.isReporterAvailable();
                reporter.isReporterAvailable();
                reporter.isReporterAvailable();

                expect(fake.callCount).to.equal(1);
            });
        });
    });
});
