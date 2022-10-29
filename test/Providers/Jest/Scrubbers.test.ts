import {describe, expect, test} from "@jest/globals";
import {verify, verifyAsJson} from "../../../lib/Providers/Jest/JestApprovals";
import {convertToFilename} from "../../../lib/Providers/Jest/JestNamer";
import {Options} from "../../../lib/Core/Options";
import {StringUtils} from "../../../lib/Utilities/StringUtils";



describe("Scubbers", () => {
    test("scrub", () => {
        const text = "[1, 2, 12, 21, 121, 131, 222]";

        verify(text,new Options().withScrubber(t => StringUtils.replaceAll(t, "2", "two")));
    });

});
