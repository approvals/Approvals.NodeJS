import * as _ from 'lodash';
import * as fs from 'fs';
import * as cfg from '../config';
import StringWriter from "../StringWriter.js";
import {verify} from "../FileApprover.js";
import {ReporterFactory} from "../Reporting/ReporterFactory.js";
import * as aUtils from '../AUtils';

interface ApprovalsExtras {
    getCurrentReporters(options?: any): any[];
}

interface VerifyFunction {
    (data: any, overrideOptions?: any): void;
}

interface TestCaseContext {
    approvals: ApprovalsExtras;
    verify: VerifyFunction;
    verifyAsJSON: VerifyFunction;
}

export = function (Namer: any, usageSample: string, dirName: string) {
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
    }

    // Make sure it's a valid directory
    const stats = fs.lstatSync(dirName);
    if (!stats.isDirectory()) {
        throw new Error(`Invalid directory [${dirName}]. Try using the following syntax. > ${usageSample}`);
    }

    beforeEach(function (this: TestCaseContext) {
        const approvalsExtras: ApprovalsExtras = {
            getCurrentReporters: function (options?: any) {
                options = options || cfg.currentConfig();
                const reporterCandidates = ReporterFactory.loadAllReporters(options.reporters);
                return reporterCandidates;
            }
        };

        // Tack on an approvals property so we can add on some
        // helper approvals goo this is mostly used for the test.
        this.approvals = approvalsExtras;

        this.verify = function (data: any, overrideOptions?: any) {
            const namer = new Namer(this, dirName);

            const newOptions = _.defaults(overrideOptions || {}, cfg.currentConfig());

            const reporterFactory = function () {
                return approvalsExtras.getCurrentReporters(newOptions);
            };

            const writer = new StringWriter(newOptions, data);
            verify(namer, writer, reporterFactory);
        };

        this.verifyAsJSON = function (data: any, overrideOptions?: any) {
            this.verify(aUtils.stringifyKeysInOrder(data), overrideOptions);
        };

    });
};
