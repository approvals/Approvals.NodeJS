import {describe, test} from "@jest/globals";
import {verify, verifyAsJson} from "../../../lib/Providers/Jest/JestApprovals";
import {Options} from "../../../lib/Core/Options";
import {StringUtils} from "../../../lib/Utilities/StringUtils";
import {Scrubbers} from "../../../lib/Scrubbers/Scrubbers";


describe("Scubbers", () => {
    test("scrub", () => {
        const text = "[1, 2, 12, 21, 121, 131, 222]";

        verify(text, new Options().withScrubber(t => StringUtils.replaceAll(t, "2", "two")));
    });
    test('guids', () => {
        const text = {
            people: [{id: "58f471f1-8b1f-413c-8971-21cb23bfc8f2", name: "Eve"},
                {
                    id: "24775957-3125-42db-ac6d-0abf142685b9",
                    name: "Kane",
                    mother: "58f471f1-8b1f-413c-8971-21cb23bfc8f2"
                }, {
                    id: "45365d5b-6cfc-430c-b842-36fbcd21470e",
                    name: "Kane",
                    mother: "58f471f1-8b1f-413c-8971-21cb23bfc8f2"
                }]
        };
        verifyAsJson(text, new Options().withScrubber(Scrubbers.createGuidScrubber()));
    });
    test('regex', () => {
        const text = "Here is some (｡◕ ∀ ◕｡) text";
        verifyAsJson(text, new Options().withScrubber(Scrubbers.createReqexScrubber(/\([\s\S]+\)/ig, "crazy")));
    });
});
