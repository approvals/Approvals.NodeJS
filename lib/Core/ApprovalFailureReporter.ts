export interface ApprovalFailureReporter {
  name: string;

  canReportOn(): boolean;

  report(approvedFilePath: string, receivedFilePath: string): void;
}
