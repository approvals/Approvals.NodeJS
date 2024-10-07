import path from "path";

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function normalizeFilePath(filePath) {
  return (filePath || "").replace(/\\/g, "/");
}

const glob = require("glob");

export function postRunCleanup(config, approvedFilesMap, glob_sync = glob.sync) {
  const options = config;
  if (options.errorOnStaleApprovedFiles) {
    // Don't require glob at the top of the file.
    // this avoids a load of glob if it's not necessary

    // normalize file paths for searching (windows vs *nix)...
    const normalizedApprovedFilePaths = approvedFilesMap.map(normalizeFilePath);

    const getAllDirectoriesOfApprovedFiles = unique(
      normalizedApprovedFilePaths.map(function (file) {
        return path.dirname(file);
      }),
    ); // get just the directory of each

    let discoveredApprovalFiles: any = [];
    getAllDirectoriesOfApprovedFiles.forEach(function (folder) {
      return glob_sync(folder + "**/*.approved.*").forEach(function (file) {
        if (discoveredApprovalFiles.indexOf(file) === -1) {
          discoveredApprovalFiles.push(file);
        }
      });
    }); // use 'glob' to find all .approved.* files for each folder.

    discoveredApprovalFiles = discoveredApprovalFiles.map(normalizeFilePath);

    const staleApprovals = discoveredApprovalFiles
      .filter(function (file) {
        if (typeof options.shouldIgnoreStaleApprovedFile === "function") {
          return !options.shouldIgnoreStaleApprovedFile(file);
        }
        return true;
      })
      .filter(function (discoveredFilePath) {
        return normalizedApprovedFilePaths.indexOf(discoveredFilePath) < 0;
      }); // only pull the ones that aren't already in the 'normalizedApprovedFilePaths'

    if (staleApprovals.length) {
      throw new Error(
        "ERROR: Found stale approvals files: \n  - " +
        staleApprovals.join("\n  - ") +
        "\n",
      );
    }
  }
}
