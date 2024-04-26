import * as _ from 'lodash';
import * as fs from 'fs';
import * as cfg from '../config';
import {StringWriter} from "../StringWriter";
import {FileApprover} from "../FileApprover";
import {ReporterFactory} from "../Reporting/ReporterFactory";
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

function beforeEachLoaderFunction(Namer: any, dirName: string, that: any): void {
    // Tack on an approvals property so we can add on some
    // helper approvals goo this is mostly used for the test.
    that.approvals = {getCurrentReporters};
    that.verify = verify;
    that.verifyAsJSON = verifyAsJSON;

    function getCurrentReporters(options?: any) {
        options = options || cfg.currentConfig();
        const reporterCandidates = ReporterFactory.loadAllReporters(options.reporters);
        return reporterCandidates;
    }
    function verify(data: any, overrideOptions?: any) {
        const namer = new Namer(this, dirName);

        const newOptions = _.defaults(overrideOptions || {}, cfg.currentConfig());

        const reporterFactory = function () {
            return {getCurrentReporters}.getCurrentReporters(newOptions);
        };

        const writer = new StringWriter(newOptions, data);
        FileApprover.verify(namer, writer, reporterFactory);
    }


    function verifyAsJSON(data: any, overrideOptions?: any) {
        this.verify(aUtils.stringifyKeysInOrder(data), overrideOptions);
    }

}
export function beforeEachVerifierBase(Namer: any, usageSample: string, dirName: string) :void {
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
    }

    // Make sure it's a valid directory
    const stats = fs.lstatSync(dirName);
    if (!stats.isDirectory()) {
        throw new Error(`Invalid directory [${dirName}]. Try using the following syntax. > ${usageSample}`);
    }
    beforeEach(function () {
        return beforeEachLoaderFunction(Namer, dirName, this);
    });


};
