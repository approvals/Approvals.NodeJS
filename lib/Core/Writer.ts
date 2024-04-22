export interface Writer {
    getFileExtension(): string;

    write(filePath: string): void;
}
