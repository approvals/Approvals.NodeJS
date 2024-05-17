import fs from "fs";

import chalk from "chalk";

import jsdiff from "diff";
import {assertFileExists, createEmptyFileIfNotExists, isBinaryFile} from "../../AUtils";
import {Reporter} from "../../Core/Reporter";


export default class NodeDiffReporter implements Reporter{
    public name: string;

    constructor() {

        this.name = "nodediff";

    }


    canReportOn(fileName) {

        assertFileExists(fileName);

        var isBinary = isBinaryFile(fileName);
        if (isBinary) {
            return false;
        }

        return true;
    }

    report(approved, received, _options): void {

        createEmptyFileIfNotExists(approved);

        var approvedText = fs.readFileSync(approved).toString();
        var receivedText = fs.readFileSync(received).toString();

        console.log(`*******************************************`);
        console.log(`* Showing diff for ${approved} vs ${received}\n`);

        var diff = jsdiff.diffChars(approvedText, receivedText);

        diff.forEach(function (part) {
            // green for additions, red for deletions
            // grey for common parts
            var color = part.added ? 'green' :
                part.removed ? 'red' : 'gray';

            process.stdout.write(chalk[color](part.value));

        });

        console.log(`\n* End of diff for ${approved} vs ${received}`);
        console.log(`*******************************************\n\n`);

    }

}

