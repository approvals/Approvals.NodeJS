import path from "path";

import { Namer } from "../../Namer";

export interface MochaTest {
    file: string;
    parent?: MochaTest;
    title: string;
}

export class MochaNamer extends Namer {
    private ctx: MochaTest;

    constructor(mochaTest: any, overrideBasePath?: string) {
        if (!mochaTest) {
            throw new Error("Mocha test context was not supplied");
        }

        super('', '');

        this.ctx = mochaTest.test;
        this.basePath = overrideBasePath || path.dirname(this.ctx.file);
    }

    getFullTestName(testContext: MochaTest): string {
        let test = testContext;

        let parentStack: MochaTest[] = [];
        let currParent: MochaTest | undefined = test;
        while (currParent && currParent.parent) {
            parentStack.push(currParent);
            currParent = currParent.parent;
        }

        let newTitle = '';
        let parentStackReversed = parentStack.reverse();
        parentStackReversed.forEach((item, index) => {
            if (index !== 0) {
                newTitle += ".";
            }

            newTitle += item.title.split(' ').join('_').replace(/[^\w\s]/gi, '_');
        });

        return newTitle;
    }

    pathCreator(type: string, ext: string): string {
        if (!this.name) {
            if (!this.ctx) {
                throw new Error("ctx was not defined.");
            }
            this.name = this.getFullTestName(this.ctx);
        }

        return super.pathCreator(type, ext);
    }
}

