import DiffReporterAggregate from './DiffReporterAggregate';
import {readdirSync} from 'fs';
import {Reporter} from "../Core/Reporter";

export type ReporterLoader = () => Reporter[];

export class ReporterFactory {

    static loadReporter(name: string | string[]): Reporter {
        if (Array.isArray(name)) {
            const reporters = ReporterFactory.loadAllReporters(name);
            return new DiffReporterAggregate(reporters);
        }

        name = name.toLowerCase();

        try {
            const ReporterCtor = require(`./Reporters/${name}Reporter`);
            if (!ReporterCtor.default) {
                return new ReporterCtor();
            }
            return new ReporterCtor.default();
        } catch (e) {
            const allFiles = readdirSync(__dirname);
            const availableReporters = allFiles
                .map((item) => item.replace("Reporter.js", ""))
                .join(", ");
            throw new Error(`Error loading reporter or reporter not found [${name}]. Try one of the following [${availableReporters}]. Original Error: ${e}`);
        }
    };


    static throwUnknownReporterError(reporter: unknown): never {
        throw new Error(`Unknown reporter: typeof= [${typeof reporter}]. Reporters are either a string like "gitdiff" or an object that conforms to the custom reporter interface.`);
    };

    static assertValidReporter(reporter: Partial<Reporter>): reporter is Reporter {
        if (typeof reporter.name !== 'string') {
            console.error('invalid reporter', reporter);
            throw new Error('A valid reporter should have a \'name\' property. EX: { name: "my-custom-reporter" }');
        }

        if (typeof reporter.canReportOn !== 'function') {
            console.error('invalid reporter', reporter);
            throw new Error('A valid reporter should have a \'{ canReportOn: function(fileName) { return true; // Example } \' function');
        }

        if (typeof reporter.report !== 'function') {
            console.error('invalid reporter', reporter);
            throw new Error('A valid reporter should have a \' { report: function (approvedFilePath, receivedFilePath) {...} }\' function');
        }

        return true;
    };

    static loadAllReporters(reporters: (string | Reporter)[]): Reporter[] {
        const reporterInstances: Reporter[] = [];

        reporters.forEach((reporter) => {
            if (typeof reporter === "object") {
                ReporterFactory.assertValidReporter(reporter);
                reporterInstances.push(reporter as Reporter);
            } else if (typeof reporter === "string") {
                const reporterInstance = ReporterFactory.loadReporter(reporter) as Reporter;
                reporterInstances.push(reporterInstance);
            } else {
                ReporterFactory.throwUnknownReporterError(reporter);
            }
        });

        return reporterInstances;
    };
}
