import {StringWrapper} from "./StringWrapper";


class Toggles {
    public queries: boolean;
    public messages: boolean;
    public variables: boolean;
    public hourglass: boolean;
    public events: boolean;
    public markers: boolean;

    constructor(show: boolean) {
        this.queries = show;
        this.messages = show;
        this.variables = show;
        this.hourglass = show;
        this.markers = show;
        this.events = show;
    }
}

function printType(value:any) {
    return `<${value.constructor.name}>`;
}

function getCallingMethod(additional_stack: number) {
    const re = /at ([^(]+) \(/g;
    const stack = `${new Error().stack}`;
    const lines = stack.split("\n");
    const stackDepth = 2 + additional_stack;
    const line = lines[stackDepth]
    const aRegexResult = re.exec(line) ?? [];
    const name = aRegexResult[1] || aRegexResult[2];
    return name;
}

export class LoggingInstance {
    logger: (text: string) => void;
    private counter: number = 0;
    private tabs: number = 0;
    private toggles = new Toggles(true);
    public logStackTraces: boolean = true;
    private logWithTimestamps: boolean = true;
    public timer: () => Date;
    private previousTimestamp: Date | null = null;

    constructor() {
        this.logger =  (s) => process.stdout.write(s);
        this.timer = () => new Date();
    }

    logToString(): StringWrapper {

        const stringWrapper = new StringWrapper();
        this.logWithTimestamps = false;
        this.logStackTraces = false;
        this.logger = (t) => stringWrapper.append(t)
        return stringWrapper;
    }

    useMarkers<T>(additional_stack: number, code: () => T, parameters: string | (() => string) ="" , logReturnValue: boolean = false): T {
        if (!this.toggles.markers) {
            return code();
        }
        const name = getCallingMethod(additional_stack + 1);
        let parameterText = "";
        if (typeof parameters === 'function'){
            parameterText = parameters();
        }
        else {
            parameterText = parameters;
        }
        this.logLine(`=> ${name}(${parameterText})`)
        const returnValue = this.withTabbing(code)
        if (typeof parameters === 'function'){
            parameterText = parameters();
        }
        else {
            parameterText = "";
        }
        let returnText = "";
        if (logReturnValue){
            returnText = `: ${returnValue}`
        }
        this.logLine(`<= ${name}(${parameterText})${returnText}`)
        return returnValue;
    }

    variable(name: string, value: any, showTypes: boolean) {
        if (!this.toggles.variables) {
            return;
        }

        let toType = (v: any, s = "") => ''
        if (showTypes) {
            toType = (value, spacing = " ") => `${spacing}${printType(value)}`
        }

        if (Array.isArray(value)) {
            this.logLine(`variable: ${name}${toType(value, '')}.length = ${value.length}`)
            this.withTabbing(() => {
                value.forEach((v, i) => {
                    this.logger(`${this.getTabs()}${name}[${i}] = ${v}${toType(v)}\n`);
                });
            });
        } else {
            this.logLine(`variable: ${name} = ${value}${toType(value)}`)

        }
    }

    private logLine(text: string, use_timestamps: boolean = true) {
        if (this.counter != 0) {
            this.logger("\n")
        }
        this.counter = 0
        const timestamp = use_timestamps ? this.getTimestamp() : "";
        const output_message = `${timestamp}${this.getTabs()}${text}\n`
        this.logger(output_message)

    }

    private getTabs() {
        return "  ".repeat(this.tabs);
    }

    private withTabbing<T>(code: () => T) :T{

        this.tabs += 1;
        const returnValue = code();
        this.tabs -= 1;
        return returnValue;
    }

    hourglass() {
        if (!this.toggles.hourglass) {
            return;
        }

        this.counter += 1;
        if (this.counter == 1) {
            this.logger(`${this.getTabs()}.`);
        } else if (this.counter == 100) {
            this.logger("10\n")
            this.counter = 0
        } else if (this.counter % 10 == 0) {
            const digit = (this.counter / 10)
            this.logger(`${digit}`
            )
        } else {

            this.logger(".")
        }
    }


    showAll(show: boolean) {
        this.toggles = new Toggles(show);
    }

    event(event_name: string) {
        if (!this.toggles.events) {
            return;
        }
        this.logLine(`event: ${event_name}`)
    }

    showQueries(show: boolean) {
        this.toggles.queries = show
    }

    showMarkers(show: boolean) {
        this.toggles.markers = show
    }

    showEvents(show: boolean) {
        this.toggles.events = show
    }

    showMessages(show: boolean) {
        this.toggles.messages = show
    }

    showVariables(show: boolean) {
        this.toggles.variables = show
    }

    showHourglass(show: boolean) {
        this.toggles.hourglass = show
    }

    warning(exception: Error | string) {
        const warning_stars = "*".repeat(91);
        const text = null;
        this.logLine(warning_stars, false);
        if (this.logWithTimestamps) {
            this.logLine("", true)
        }
        if (text) {
            this.logLine(`Message:${text}`, false)
        }
        if (exception) {
            let stack_trace = "";
            if (this.logStackTraces) {
                // todo: grab stack trace
                stack_trace = exception.toString()

            } else {
                stack_trace = `${exception}`;
            }
            this.logLine(stack_trace,  false)
        }
        this.logLine(warning_stars,  false)
    }

    query(queryText: string) {
        if (!this.toggles.queries) {
            return;
        }
        this.logLine(`Sql: ${queryText}`)
    }

    message(messageText: string) {
        if (!this.toggles.messages) {
            return;
        }
        this.logLine(`message: ${messageText}`)
    }

    showTimestamps(show: boolean) {
        this.logWithTimestamps = show;

    }

    private getTimestamp() {
        if (! this.logWithTimestamps){
            return "";
        }

        const time1 = this.timer();
        const time = time1.toISOString();
        let diff_millseconds = 0;
        if (this.previousTimestamp != null){
            diff_millseconds= time1.getTime() - this.previousTimestamp.getTime();
        }
        const diff_display = `~${String(diff_millseconds).padStart(6,"0")}ms`
        let time_text = `${time}`.replace("T", " ").substring(0, 19);
        const timestamp = `[${time_text} ${diff_display}] `
        this.previousTimestamp = time1
        return timestamp
    }
}
