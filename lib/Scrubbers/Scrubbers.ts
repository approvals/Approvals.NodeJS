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
            return t => _replaceRegex(t, regex, s => replacementString)
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
    static templatesForRegexScrubberWithLambda(): Scrubber {
        return this.createReqexScrubber(/your pattern here: [a-zA-Z]+d{4}/ig, t => `<your replacement_${t}>`);
    }

    /**
     * This method exists as a convenient way to get an example scrubber for you to use.
     * To use this template, simply inline the method in your IDE.
     */
    static templatesForRegexScrubber(): Scrubber {
        return this.createReqexScrubber(/your pattern here: [a-zA-Z]+d{4}/ig, `<your replacement>`);
    }
}
