import {Scrubber, Scrubbers} from "./Scrubbers";

class DateFormat {
    public regex: RegExp;
    public examples: string[];

    constructor(regex: RegExp, examples: string[]) {
        this.regex = regex;
        this.examples = examples;
    }
}

function __(regExp: RegExp, strings: string[]): DateFormat {
    return new DateFormat(regExp, strings);
}

export class DataScrubber {
    static get_supported_formats(): DateFormat[] {
        return [
            __(/[a-zA-Z]{3} [a-zA-Z]{3} \d{2} \d{2}:\d{2}:\d{2}/g,
                ["Tue May 13 16:30:00"])

            , __(/[a-zA-Z]{3} [a-zA-Z]{3} \d{2} \d{2}:\d{2}:\d{2} [a-zA-Z]{3,4} \d{4}/g,
                ["Wed Nov 17 22:28:33 EET 2021"])

            , __(/[a-zA-Z]{3} [a-zA-Z]{3} \d{2} \d{4} \d{2}:\d{2}:\d{2}.\d{3}/g,
                ["Tue May 13 2014 23:30:00.789"])
            , __(/[a-zA-Z]{3} [a-zA-Z]{3} \d{2} \d{2}:\d{2}:\d{2} -\d{4} \d{4}/g,
                ["Tue May 13 16:30:00 -0800 2014"])
            , __(/\d{2} [a-zA-Z]{3} \d{4} \d{2}:\d{2}:\d{2},\d{3}/g, ["13 May 2014 23:50:49,999"])
            , __(/[a-zA-Z]{3} \d{2}, \d{4} \d{2}:\d{2}:\d{2} [a-zA-Z]{2} [a-zA-Z]{3}/g, ["May 13, 2014 11:30:00 PM PST"])
            , __(/\d{2}:\d{2}:\d{2}/g, ["23:30:00"])

            , __(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}.\d{2}\d/g, ["2014/05/13 16:30:59.786"])
            , __(/\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{2}Z/g, [
                "2020-9-10T08:07Z",
                "2020-09-9T08:07Z",
                "2020-09-10T8:07Z",
                "2020-09-10T08:07Z",
            ])
// ],
// [
//     "\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{2}:\d{2}Z",
//     ["2020-09-10T08:07:89Z"],
// ],
// [
//     "\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{2}\:\d{2}\.\d{3}Z",
//     ["2020-09-10T01:23:45.678Z"],
// ],
// ["\d{8}T\d{6}Z", ["20210505T091112Z"]],
// ];
        ]
            ;
    }

    static get_scrubber_for(example: string): Scrubber {
        let supported = ""
        for (let format of DataScrubber.get_supported_formats()) {
            const scrubber = this.create(format.regex);
            const scrubbed = scrubber(example);
            if (scrubbed === "<date_1>") {
                return scrubber;
            }
            supported += `    ${format.examples[0]} | ${format.regex} \n`;
        }
        throw new Error(`No match found for '${example}'.\n Feel free to add your date at https://github.com/approvals/ApprovalTests.Python/issues/124 \n Current supported formats are: \n${supported}`)
    }

    private static create(regex: RegExp): Scrubber {
        return Scrubbers.createReqexScrubber(regex, t => `<date_${t}>`);

    }
}
