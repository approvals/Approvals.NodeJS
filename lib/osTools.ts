// Remove the reference path as TypeScript should be configured to recognize node types globally via `tsconfig.json`

// Detect OS-specific features using TypeScript.
const isWindows = process.platform.startsWith('win');

export const platform = {
    isWindows: isWindows,
    isMac: process.platform === 'darwin'
};

export let findProgramPathCommand = isWindows ? "where" : "which";
