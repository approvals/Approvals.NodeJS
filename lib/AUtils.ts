import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import * as osTools from './osTools';

interface CachedProgramLookups {
    [programName: string]: string | null;
}

const _cachedProgramLookups: CachedProgramLookups = {};

const createEmptyFileIfNotExists = (file: string): void => {
    if (!fs.existsSync(file)) {
        const ext = (path.extname(file) || '').toLowerCase();
        if (ext === '.png') {
            fs.writeFileSync(file, fs.readFileSync(path.join(__dirname, 'DummyApprovedFiles', 'UnapprovedImage.png')));
        } else {
            fs.writeFileSync(file, "");
        }
    }
};

const assertFileExists = (file: string): void => {
    if (!fs.existsSync(file)) {
        throw new Error("File not found: " + file);
    }
};

const hasCommandLineArgument = (arg: string): boolean => {
    return process.argv.some((val) => (val || '').toLowerCase() === arg);
};

const isBinaryFile = (buffer: Buffer): boolean => {
    const contentStartUTF8 = buffer.toString('utf8', 0, 24);
    for (let i = 0, _ref = contentStartUTF8.length; i < _ref; i++) {
        const charCode = contentStartUTF8.charCodeAt(i);
        if (charCode === 65533 || charCode <= 8) {
            return true;
        }
    }
    return false;
};

const trimExtension = (filePath: string): string => {
    if (!filePath) return filePath;
    const i = filePath.lastIndexOf('.');
    const ext = i < 0 ? '' : filePath.substr(i);
    return ext ? filePath.substring(0, filePath.length - ext.length) : filePath;
};

const findProgramOnPath = (programName: string): string | null => {
    if (_cachedProgramLookups.hasOwnProperty(programName)) {
        return _cachedProgramLookups[programName];
    }
    const output = shell.exec(`${osTools.findProgramPathCommand} ${programName}`, { silent: true });
    let result: string | null = null;
    if (output.stdout) {
        const file = output.stdout.split("\n")[0].trim();
        const fixedFile = fixFilePathSlashes(file);
        if (fs.existsSync(fixedFile)) {
            result = fixedFile;
        }
    }
    if (!result) {
        const pathMinusExtension = trimExtension(programName);
        if (pathMinusExtension !== programName) {
            result = findProgramOnPath(pathMinusExtension);
        }
    }
    _cachedProgramLookups[programName] = result;
    return result;
};

const searchForExecutable = (folderInProgramInFiles?: string, fileName?: string): string | null => {
    if (!fileName) {
        fileName = folderInProgramInFiles;
        folderInProgramInFiles = undefined;
    }
    const programOnPath = findProgramOnPath(fileName!);
    if (programOnPath) {
        return programOnPath;
    }
    const lookInProgramFiles = (fileName_: string): string | null => {
        if (osTools.platform.isWindows) {
            let tryVar = findInPath("C:/Program Files", folderInProgramInFiles || '', fileName_);
            if (tryVar) {
                return tryVar;
            }
            tryVar = findInPath("C:/Program Files (x86)", folderInProgramInFiles || '', fileName_);
            if (tryVar) {
                return tryVar;
            }
        }
        return null;
    };
    const findInPath = (root: string, dir: string, file: string): string | null => {
        const fullPath = path.join(root, dir, file);
        const fixedFullPath = fixFilePathSlashes(fullPath);
        if (fs.existsSync(fixedFullPath)) {
            return fixedFullPath;
        }
        return null;
    };
    let fileFound = lookInProgramFiles(fileName!);
    if (fileFound) {
        return fileFound;
    }
    const suffix = ".exe";
    if (!fileName!.endsWith(suffix)) {
        fileFound = lookInProgramFiles(fileName! + suffix);
        if (fileFound) {
            return fileFound;
        }
    }
    return null;
};

const fixFilePathSlashes = (path_: string): string => {
    return path_.replace(/\\/g, '/');
};

const recursivelyOrderKeys = (unordered: any): any => {
    if (unordered === null) {
        return null;
    }
    if (Array.isArray(unordered)) {
        return unordered.map(recursivelyOrderKeys);
    }
    if (typeof unordered === 'object' && unordered !== null) {
        const ordered: { [key: string]: any } = {};
        Object.keys(unordered).sort().forEach((key) => {
            ordered[key] = recursivelyOrderKeys(unordered[key]);
        });
        return ordered;
    }
    return unordered;
};

const stringifyKeysInOrder = (data: any): string => {
    const sortedData = recursivelyOrderKeys(data);
    return JSON.stringify(sortedData, null, '  ');
};

export {
    createEmptyFileIfNotExists,
    assertFileExists,
    hasCommandLineArgument,
    isBinaryFile,
    findProgramOnPath,
    searchForExecutable,
    fixFilePathSlashes,
    stringifyKeysInOrder
};
