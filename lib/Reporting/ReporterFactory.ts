import DiffReporterAggregate from './DiffReporterAggregate';
import { readdirSync } from 'fs';

interface Reporter {
    name: string;
    canReportOn: (fileName: string) => boolean;
    report: (approvedFilePath: string, receivedFilePath: string) => void;
}

export class ReporterFactory {

    static loadReporter(name: string | string[]): Reporter | DiffReporterAggregate  {
        if (Array.isArray(name)) {
            const reporters = ReporterFactory.loadAllReporters(name);
            return new DiffReporterAggregate(reporters);
        }

        name = name.toLowerCase();

        let ReporterCtor;
        try {
            ReporterCtor = require(`./Reporters/${name}Reporter.js`);
        } catch (e) {
            const allFiles = readdirSync(__dirname);
            let availableReporters = "";

            allFiles.forEach((item) => {
                if (item.indexOf("Reporter.js") > 0) {
                    availableReporters += availableReporters ? `, ${item.replace("Reporter.js", "")}` : item.replace("Reporter.js", "");
                }
            });

            throw new Error(`Error loading reporter or reporter not found [${name}]. Try one of the following [${availableReporters}]. Original Error: ${e}`);
        }
        return new ReporterCtor();
    };


    static throwUnknownReporterError(reporter: unknown): never {
        throw new Error(`Unknown reporter: typeof= [${typeof reporter}]. Reporters are either a string like "gitdiff" or an object that conforms to the custom reporter interface.`);
    };

    static assertValidReporter (reporter: Partial<Reporter>): reporter is Reporter {
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
