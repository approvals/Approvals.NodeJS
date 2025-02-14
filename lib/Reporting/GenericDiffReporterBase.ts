import * as childProcess from "child_process";
import * as fs from "fs";
import * as autils from "../AUtils";
import reportingLaunchingCircuitBreaker from "./ReportLaunchingCircuitBreaker";
import { ChildProcessWithoutNullStreams } from "child_process";
import { Reporter } from "../Core/Reporter";
import { Config } from "../config";

export class GenericDiffReporterBase implements Reporter {
  name: string;
  public exePath: string = "";
  private _reporterFileLookedUp: boolean;
  public setCommandArgs: (approved: string, received: string) => string[] = (
    a: string,
    r: string,
  ) => [r, a];
  public modifyCommandOptions: (commandOptions: any) => any = (c) => c;
  private _reporterFileLookedUpAndFound: boolean;

  constructor(name: string) {
    if (!name) {
      throw new Error("Argument name missing");
    }

    this.name = name;
    this._reporterFileLookedUp = false;
    this._reporterFileLookedUpAndFound = false;
  }

  isReporterAvailable(): boolean {
    if (this._reporterFileLookedUp) {
      return this._reporterFileLookedUpAndFound;
    }

    this._reporterFileLookedUp = true;

    if (!fs.existsSync(this.exePath)) {
      return false;
    }
    this._reporterFileLookedUpAndFound = true;
    return true;
  }

  canImageDiff(): boolean {
    return false;
  }

  canReportOn(fileName: string): boolean {
    if (!this.isReporterAvailable()) {
      return false;
    }

    autils.assertFileExists(fileName);

    if (this.canImageDiff()) {
      return true;
    }

    const isBinary = autils.isBinaryFile(fileName);
    return !isBinary;
  }

  spawn(
    exe: string,
    args: string[],
    cmdOptions?: any,
  ): ChildProcessWithoutNullStreams {
    const process = childProcess.spawn(exe, args, cmdOptions);

    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (data) => {
      stdout += data;
    });
    process.stderr.on("data", (data) => {
      stderr += data;
    });

    process.on("close", () => {
      if (stdout) {
        console.log(
          "\n============\nstdout:\n============\n" +
            stdout +
            "\n============\n",
        );
      }
      if (stderr) {
        console.log(
          "\n============\nstderr:\n============\n" +
            stderr +
            "\n============\n",
        );
      }
    });

    return process;
  }

  spawnSync(exe: string, args: string[], cmdOptions?: any): void {
    const result = childProcess.spawnSync(exe, args, cmdOptions);

    const stdout = result.stdout.toString();
    const stderr = result.stderr.toString();

    if (stdout) {
      console.log(
        "\n============\nstdout:\n============\n" + stdout + "\n============\n",
      );
    }
    if (stderr) {
      console.log(
        "\n============\nstderr:\n============\n" + stderr + "\n============\n",
      );
    }
  }

  report(
    approved: string,
    received: string,
    options: Partial<Config> = {},
  ): void {
    if (!options.blockUntilReporterExits) {
      if (reportingLaunchingCircuitBreaker.check(approved, received, options)) {
        return;
      }
    }

    const spawnMethod = options.blockUntilReporterExits
      ? this.spawnSync.bind(this)
      : this.spawn.bind(this);
    autils.createEmptyFileIfNotExists(approved);

    const { cmdOptions, args } = this.getCommandArguments(
      approved,
      received,
      options,
    );

    console.log("CMD: ", this.exePath, args.join(" "));

    spawnMethod(this.exePath, args, cmdOptions);
  }

  getCommandArguments(
    approved: string,
    received: string,
    options: Partial<Config> = {},
  ) {
    const cmdOptions = this.modifyCommandOptions(options.cmdOptionOverrides);
    const args = options.cmdArgs || this.setCommandArgs(approved, received);
    return { cmdOptions, args };
  }
}
