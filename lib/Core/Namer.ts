export interface Namer {
  getApprovedFile(ext: string): string;
  getReceivedFile(ext: string): string;
}
