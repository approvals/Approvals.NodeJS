import path from "path";

import { sync } from "glob";

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function normalizeFilePath(filePath) {
  return (filePath || "").replace(/\\/g, "/");
}

function findApprovedFilesInFolders(
  folders: string[],
  glob_sync: (pattern: string) => string[],
): string[] {
  const discoveredApprovalFiles: string[] = [];
  folders.forEach(function (folder) {
    return glob_sync(folder + "**/*.approved.*").forEach(function (file) {
      if (discoveredApprovalFiles.indexOf(file) === -1) {
        discoveredApprovalFiles.push(file);
      }
    });
  });
  return discoveredApprovalFiles;
}

export function postRunCleanup(
  config,
  approvedFilesMap,
  glob_sync: (pattern: string) => string[] = sync,
) {
  const options = config;
  if (options.errorOnStaleApprovedFiles) {
    const normalizedApprovedFilePaths = approvedFilesMap.map(normalizeFilePath);

    const approvedFileFolders = unique<string>(
      normalizedApprovedFilePaths.map(function (file) {
        return path.dirname(file);
      }),
    );

    const discoveredApprovalFiles = findApprovedFilesInFolders(
      approvedFileFolders,
      glob_sync,
    ).map(normalizeFilePath);

    const staleApprovals = discoveredApprovalFiles
      .filter(function (file) {
        if (typeof options.shouldIgnoreStaleApprovedFile === "function") {
          return !options.shouldIgnoreStaleApprovedFile(file);
        }
        return true;
      })
      .filter(function (discoveredFilePath) {
        return normalizedApprovedFilePaths.indexOf(discoveredFilePath) < 0;
      });

    if (staleApprovals.length) {
      process.exitCode = 1;
      throw new Error(
        "ERROR: Found stale approvals files: \n  - " +
          staleApprovals.join("\n  - ") +
          "\n",
      );
    }
  }
}
