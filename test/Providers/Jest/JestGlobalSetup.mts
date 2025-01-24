import {ApprovedFileLog} from "../../../lib/Logs/ApprovedFileLog.js";

export default async function globalSetup(): Promise<void> {
    console.log(`*********** STARTING JEST ***************`);
   ApprovedFileLog.forceClearLogFile();
}
