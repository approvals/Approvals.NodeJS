import { Config } from "../config";

export interface Reporter {
  canReportOn(fileName: string): boolean;

  report(
    approvedFileName: string,
    receivedFileName: string,
    options: Partial<Config>,
  ): void;

  name: string;
}
