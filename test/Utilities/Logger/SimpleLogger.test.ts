import {describe, test} from "@jest/globals";
import {SimpleLogger} from "../../../lib/Utilities/Logger/SimpleLogger";
import {verify} from "../../../lib/Providers/Jest/JestApprovals";
import {verifySimpleLogger} from "../../../lib/Utilities/Logger/SimpleLoggerApprovals";

function logVariables() {
    SimpleLogger.useMarkers(() => {
        const names = ["Jacqueline", "Llewellyn"]
        SimpleLogger.variable("names", names, true)
        SimpleLogger.variable("names", names, false)
    });
}


function methodWithReturnValue(name:string, age: number): string {
    return SimpleLogger.useMarkers(() => {
        return `${name} is ${age} years old today.`
    }, `name: ${name}, age: ${age}`, true);

}

describe("SimpleLogger", () => {
    test("variable with list", () => {
        const output = SimpleLogger.logToString()
        logVariables();
        verify(output)
    });

    verifySimpleLogger("verify", () => {
        logVariables();
    });

    function log_from_inner_method() {
        SimpleLogger.useMarkers(() => {

            const name = "Example"
            SimpleLogger.variable("name", name)
            for (let i = 0; i < 142; i++) {
                SimpleLogger.hourglass()
            }
        });

    }

    verifySimpleLogger("test_standard_logger", () => {
        log_from_inner_method()
    });

    // begin-snippet: verify_simple_logger_example
    verifySimpleLogger("variable", () => {
        SimpleLogger.variable("dalmatians", 101, true)
        SimpleLogger.variable("dalmatians", 101, false)
    });
    // end-snippet

    // begin-snippet: verify_simple_logger_long_example
    test("test_variable_explict", () => {
        const output = SimpleLogger.logToString()
        SimpleLogger.variable("dalmatians", 101, true)
        SimpleLogger.variable("dalmatians", 101, false)
        verify(output)
    });

    // end-snippet


    function verify_toggle(toggle_name: string, toggle: (a: any) => any) {
        SimpleLogger.showAll(true)
        SimpleLogger.event(`Toggle Off ${toggle_name}`)
        toggle(false)
        log_everything()
    }

    function log_everything(): void {
        SimpleLogger.useMarkers(() => {

            SimpleLogger.query("Select * from people")
            SimpleLogger.variable("Nonsense", "foo")
            SimpleLogger.event("Testing")
            SimpleLogger.message("Something random")
            for (let i = 0; i < 13; i++) {
                SimpleLogger.hourglass()

            }
            try {
                throw new Error("Bad stuff happened here")
            } catch (e: any) {
                SimpleLogger.warning(e)
            }

        });
    }

    verifySimpleLogger("switching", () => {
        verify_toggle("None", a => SimpleLogger.showAll(true));
        verify_toggle("All", a => SimpleLogger.showAll(a));
        verify_toggle("Query", a => SimpleLogger.showQueries(a));
        verify_toggle("Message", a => SimpleLogger.showMessages(a));
        verify_toggle("Variable", a => SimpleLogger.showVariables(a));
        verify_toggle("Hour Glass", a => SimpleLogger.showHourglass(a));
        verify_toggle("Markers", a => SimpleLogger.showMarkers(a));
        verify_toggle("Events", a => SimpleLogger.showEvents(a));

    });

    // begin-snippet: method_with_inputs_and_outputs
    function method_with_inputs_and_outputs(number: number, announcement:string) {
        SimpleLogger.useMarkers(() => {

                // end-snippet
                for (number = number; 0 <= number; number--) {
                    process.stdout.write(`${number} \n`)
                }
                process.stdout.write(`${announcement}\n`)
            },
            () => `number = ${number}, announcement = ${announcement}`);
    }

    verifySimpleLogger("test_markers_with_signature_in_and_out", () => {
        method_with_inputs_and_outputs(10, "Blast off");
    })

    // begin-snippet: method_with_inputs
    function method_with_inputs(number: number, name:string) {
        SimpleLogger.useMarkers(() => {
            process.stdout.write(`${number}) ${name}`)
        }, `number = ${number}, name = ${name}`);
    }

    // end-snippet

    verifySimpleLogger("test_markers_with_signature", () => {
        method_with_inputs(1, "Susan");
    })

    verifySimpleLogger("test_timestamps", () => {
        let count = -1;

        function create_applesauce_timer(): Date {
            const dates = [
                new Date(0),
                new Date(500),
                new Date(2000),
                new Date(1050000),
                new Date(1052000),
            ]
            count++;
            return dates[count] ?? new Date();
        }

        SimpleLogger._wrapper.get().timer = () => create_applesauce_timer();
        SimpleLogger.showTimestamps(true)
        SimpleLogger.event("1")
        SimpleLogger.event("2")
        SimpleLogger.event("3")
        SimpleLogger.event("4")
        SimpleLogger.warning(new Error("Oh no you didn't!"))
    });

    verifySimpleLogger("test_warnings",
        () => {


            function scrubber(text: string): string {
                return text.replace("", "test_simple_logger.py")
            }

            SimpleLogger._wrapper.get().logStackTraces = true;
            const text = "EVERYTHING IS AWFUL!!!!!!"
            let exception: any;
            try {
                throw new Error("EVERYTHING IS exceptionally AWFUL!!!!!!");
            } catch (e) {
                exception = e;
            }
            //SimpleLogger.warning(text)
            SimpleLogger.warning(exception)
        });

    verifySimpleLogger("Markers with return values", () => {
        methodWithReturnValue("Llewellyn", 29);
    })
});
