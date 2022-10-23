import {StringWrapper} from "./StringWrapper";


class Toggles {
    public queries: boolean;
    public messages: boolean;
    public variables: boolean;
    public hour_glass: boolean;
    public events: boolean;
    public markers: boolean;

    constructor(show: boolean) {
        this.queries = show;
        this.messages = show;
        this.variables = show;
        this.hour_glass = show;
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
    public log_stack_traces: boolean = true;
    private log_with_timestamps: boolean = true;
    public timer: () => Date;
    private previous_timestamp: Date | null = null;

    constructor() {
        this.logger = console.log;
        this.timer = () => new Date();
    }

    log_to_string(): StringWrapper {

        const stringWrapper = new StringWrapper();
        this.log_with_timestamps = false;
        this.log_stack_traces = false;
        this.logger = (t) => stringWrapper.append(t)
        return stringWrapper;
    }

    use_markers(additional_stack: number, code: () => void, parameters: string | (() => string) ="" ) {
        if (!this.toggles.markers) {
            code();
            return;
        }
        const name = getCallingMethod(additional_stack + 1);
        let parameterText = "";
        if (typeof parameters === 'function'){
            parameterText = parameters();
        }
        else {
            parameterText = parameters;
        }
        this.log_line(`=> ${name}(${parameterText})`)
        this.withTabbing(code)
        if (typeof parameters === 'function'){
            parameterText = parameters();
        }
        else {
            parameterText = ""
        }
        this.log_line(`<= ${name}(${parameterText})`)
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
            this.log_line(`variable: ${name}${toType(value, '')}.length = ${value.length}`)
            this.withTabbing(() => {
                value.forEach((v, i) => {
                    this.logger(`${this.getTabs()}${name}[${i}] = ${v}${toType(v)}\n`);
                });
            });
        } else {
            this.log_line(`variable: ${name} = ${value}${toType(value)}`)

        }
    }

    private log_line(text: string, use_timestamps: boolean = true) {
        if (this.counter != 0) {
            this.logger("\n")
        }
        this.counter = 0
        const timestamp = use_timestamps ? this.get_timestamp() : "";
        const output_message = `${timestamp}${this.getTabs()}${text}\n`
        this.logger(output_message)

    }

    private getTabs() {
        return "  ".repeat(this.tabs);
    }

    private withTabbing(code: () => void) {

        this.tabs += 1;
        code();
        this.tabs -= 1;
    }

    hour_glass() {
        if (!this.toggles.hour_glass) {
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


    show_all(show: boolean) {
        this.toggles = new Toggles(show);
    }

    event(event_name: string) {
        if (!this.toggles.events) {
            return;
        }
        this.log_line(`event: ${event_name}`)
    }

    show_queries(show: boolean) {
        this.toggles.queries = show
    }

    show_markers(show: boolean) {
        this.toggles.markers = show
    }

    show_events(show: boolean) {
        this.toggles.events = show
    }

    show_messages(show: boolean) {
        this.toggles.messages = show
    }

    show_variables(show: boolean) {
        this.toggles.variables = show
    }

    show_hour_glass(show: boolean) {
        this.toggles.hour_glass = show
    }

    warning(exception: Error | string) {
        const warning_stars = "*".repeat(91);
        const text = null;
        this.log_line(warning_stars, false);
        if (this.log_with_timestamps) {
            this.log_line("", true)
        }
        if (text) {
            this.log_line(`Message:${text}`, false)
        }
        if (exception) {
            let stack_trace = "";
            if (this.log_stack_traces) {
                // todo: grab stack trace
                stack_trace = exception.toString()

            } else {
                stack_trace = `${exception}`;
            }
            this.log_line(stack_trace,  false)
        }
        this.log_line(warning_stars,  false)
    }

    query(queryText: string) {
        if (!this.toggles.queries) {
            return;
        }
        this.log_line(`Sql: ${queryText}`)
    }

    message(messageText: string) {
        if (!this.toggles.messages) {
            return;
        }
        this.log_line(`message: ${messageText}`)
    }

    show_timestamps(show: boolean) {
        this.log_with_timestamps = show;

    }

    private get_timestamp() {
        if (! this.log_with_timestamps){
            return "";
        }

        const time1 = this.timer();
        const time = time1.toISOString();
        let diff_millseconds = 0;
        if (this.previous_timestamp != null){
            diff_millseconds= time1.getTime() - this.previous_timestamp.getTime();
        }
        const diff_display = `~${String(diff_millseconds).padStart(6,"0")}ms`
        let time_text = `${time}`.replace("T", " ").substring(0, 19);
        const timestamp = `[${time_text} ${diff_display}] `
        this.previous_timestamp = time1
        return timestamp
    }
}
