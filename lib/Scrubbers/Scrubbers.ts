import {DateScrubber} from "./DateScrubber";

export type Scrubber = (t: string) => string;

type ReplacementFunction = (index: number) => string;

function _replaceRegex(text: string, regex: RegExp, replacement: ReplacementFunction): string {
    const capturedGuids: string[] = []

    const result = text.replace(regex, match => {
        if (capturedGuids.indexOf(match) < 0) {
            capturedGuids.push(match);
        }

        const index = capturedGuids.indexOf(match) + 1;
        return replacement(index);
    });
    return result;
}

export class Scrubbers {

    static createReqexScrubber(regex: RegExp, replacement: (string | ReplacementFunction)): Scrubber {
        if (typeof replacement === 'function') {
            return t => _replaceRegex(t, regex, replacement as ReplacementFunction)
        } else {
            const replacementString = replacement as string;
            return t => _replaceRegex(t, regex, () => replacementString)
        }
    }

    static createGuidScrubber(): Scrubber {
        const guidReqex: RegExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig
        return this.createReqexScrubber(guidReqex, t => `<guid_${t}>`);
    }

    /**
     * This method exists as a convenient way to get an example scrubber for you to use.
     * To use this template, simply inline the method in your IDE.
     */
    static templates = class {
        static regexScrubberWithLambda(): Scrubber {
            return Scrubbers.createReqexScrubber(/your pattern here: [a-zA-Z]+d{4}/ig, t => `<your replacement_${t}>`);
        }

        static regexScrubber(): Scrubber {
            return Scrubbers.createReqexScrubber(/your pattern here: [a-zA-Z]+d{4}/ig, `<your replacement>`);
        }

        static dateScrubber(): Scrubber {
            return DateScrubber.getScrubberFor("2014/05/13 16:30:59.786");
        }
    }
    static  noScrubber(data) {
        return data;
    }


    static  guidScrubber(data: string) {

        const guidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig;

        const capturedGuids: string[] = []

        const result = data.replace(guidRegex, function (match: string) {
            // The arguments are:
            // 1: The whole match (string)
            // 2..n+1: The captures (string or undefined)
            // n+2: Starting position of match (0 = start)
            // n+3: The subject string.
            // (n = number of capture groups)

            if (capturedGuids.indexOf(match) < 0) {
                capturedGuids.push(match);
            }

            const index = capturedGuids.indexOf(match) + 1;

            return `guid_${index}`;

        });

        return result;

    }

    static  multiScrubber(scrubbers: Scrubber[]) {
        return function (data) {

            scrubbers.forEach(function (scrubber) {
                data = scrubber(data);
            });

            return data
        }
    }
}
