import {Reporter} from "../Core/Reporter";


class DiffReporterAggregate implements Reporter {
    private reporters: Reporter[];
    public name: string;

    constructor(reporters: Reporter[]) {
        this.reporters = reporters;
        this.name = `DiffReporterAggregate [${reporters.map(item => item.name).join(', ')}]`;
    }

    getReporter(file: string): Reporter | null {
        for (const reporter of this.reporters) {
            if (reporter.canReportOn(file)) {
                return reporter;
            }
        }
        return null;
    }

    canReportOn(file: string): boolean {
        return !!this.getReporter(file);
    }

    report(approved: string, received: string, options?: any): void {
        const reporter = this.getReporter(received);

        if (reporter) {
            reporter.report(approved, received, options);
        } else {
            throw new Error("No reporter found!");
        }
    }
}

export = DiffReporterAggregate;
