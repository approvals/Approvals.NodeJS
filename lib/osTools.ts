const isWindows = process.platform.startsWith("win");

export const platform = {
  isWindows: isWindows,
  isMac: process.platform === "darwin",
};

export const findProgramPathCommand = isWindows ? "where" : "which";
