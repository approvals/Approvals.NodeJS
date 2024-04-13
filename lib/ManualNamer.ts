import { Namer } from './Namer';

export class ManualNamer extends Namer {
    constructor(dirName: string, testFileName: string) {
        super(dirName, testFileName);
        // Redefining these properties is actually redundant here because the superclass constructor
        // already sets them based on the arguments provided. You might want to remove these lines
        // unless there is some side effect or behavior in the superclass constructor that requires them.
        this.basePath = dirName;
        this.name = testFileName;
    }
}
