import { Config } from "../config";

export interface Reporter {
  name: string;

  canReportOn(fileName: string): boolean;

  report(
    approvedFileName: string,
    receivedFileName: string,
    options?: Partial<Config>,
  ): void;
}
