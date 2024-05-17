import { FinalMessages } from "../FinalMessages";
import NodeDiffReporter from "./Reporters/nodediffReporter";

let maxLaunch = 10;
let currentCount = 0;
let reroutedCount = 0;

export class ReportLaunchingCircuitBreaker {
    static setMaxLaunch(value: number): void {
        maxLaunch = value;
    }

    static get currentCount(): number {
        return currentCount;
    }

    static notifyLaunched(): void {
        currentCount++;
    }

    static isLimitExceeded(): boolean {
        return maxLaunch <= currentCount;
    }

    static check(approved: string, received: string, options: any): boolean {
        if (this.isLimitExceeded()) {
            reroutedCount++;
            FinalMessages.addKeyMessage("maxLaunches", `config.maxLaunches (${maxLaunch}) exceeded: ${reroutedCount} diff(s) shown in console above...`);
            (new NodeDiffReporter()).report(approved, received, options);
            return true;
        }
        this.notifyLaunched();
        return false;
    }
}

export default ReportLaunchingCircuitBreaker;
