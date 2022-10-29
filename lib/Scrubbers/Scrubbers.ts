export type Scrubber = (t: string) => string;

function _replaceRegex(text: string, regex: string, replacement: (index: number) => string): string {
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

    static createReqexScrubber(regex: string, replacement: (index: number) => string | string): Scrubber {
        return t => _replaceRegex(t, regex, replacement)
    }

    static scrubAllGuids(text: string):string  {
        let scrubber = this.createReqexScrubber("[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
            t => `<guid_${t}>`);
        return scrubber(text);
    }
}
