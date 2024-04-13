import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as yaml from 'js-yaml';
import { ReportLaunchingCircuitBreaker } from './Reporting/ReportLaunchingCircuitBreaker';

interface Config {
    reporters: string[],
    normalizeLineEndingsTo: boolean | string,
    failOnLineEndingDifferences: boolean,
    appendEOL: boolean,
    EOL: string,
    errorOnStaleApprovedFiles: boolean,
    shouldIgnoreStaleApprovedFile: (fileName?: string) => boolean,
    stripBOM: boolean,
    forceApproveAll: boolean,
    blockUntilReporterExits: boolean,
    maxLaunches: number
}

const defaultConfig: Config = {
    reporters: [
        "BeyondCompare",
        "diffmerge",
        "p4merge",
        "tortoisemerge",
        "nodediff",
        "opendiff",
        "gitdiff",
    ],
    normalizeLineEndingsTo: false,
    failOnLineEndingDifferences: false,
    appendEOL: true,
    EOL: os.EOL,
    errorOnStaleApprovedFiles: true,
    shouldIgnoreStaleApprovedFile: () => false,
    stripBOM: false,
    forceApproveAll: false,
    blockUntilReporterExits: false,
    maxLaunches: 10
};

function getHomeApprovalConfig(): Config | null {
    const homeConfigPath = path.join(os.homedir(), '.approvalsConfig');
    if (fs.existsSync(homeConfigPath)) {
        const configFileData = fs.readFileSync(homeConfigPath).toString();
        try {
            return yaml.load(configFileData) as Config;
        } catch (ex) {
            throw new Error("Error parsing " + homeConfigPath + ". " + ex);
        }
    }
    return null;
}

let currentConfigObj: Config;

function getConfig(configOverrides?: Partial<Config>): Config {
    const homeConfig = getHomeApprovalConfig() || {};
    const resultConfig = _.defaults(configOverrides || {}, currentConfigObj || {}, homeConfig, defaultConfig);
    return resultConfig as Config;
}

function configure(overrideOptions?: Partial<Config>): Config {
    currentConfigObj = getConfig(overrideOptions);
    processConfig(currentConfigObj);
    return currentConfigObj;
}

function currentConfig(): Config {
    return currentConfigObj;
}

function reset(): void {
    currentConfigObj = _.defaults({}, getHomeApprovalConfig(), defaultConfig)
}

currentConfigObj = getConfig();

function processConfig(config: Config): void {
    if (config.maxLaunches) {
        ReportLaunchingCircuitBreaker.setMaxLaunch(config.maxLaunches);
    }
}

export {
    getConfig,
    getHomeApprovalConfig,
    defaultConfig,
    configure,
    currentConfig,
    reset
};
