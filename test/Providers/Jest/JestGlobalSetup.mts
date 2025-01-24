import {initializeGlobalsForJest} from "../../../lib/Providers/Jest/JestSetup.js";

export default async function globalSetup(): Promise<void> {
    initializeGlobalsForJest();
}
