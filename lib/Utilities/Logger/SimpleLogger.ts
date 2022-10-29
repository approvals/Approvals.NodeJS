import {SingleWrapper, ThreadedWrapper, Wrapper} from "./Wrapper";

import {LoggingInstance} from "./LoggingInstance";
import {StringWrapper} from "./StringWrapper";


export class SimpleLogger {


    static _wrapper: Wrapper<LoggingInstance> = new SingleWrapper(new LoggingInstance())

    static showQueries(show: boolean) {
        this._wrapper.get().showQueries(show);

    }

    static showMarkers(show: boolean) {
        this._wrapper.get().showMarkers(show);
    }

    static showEvents(show: boolean) {
        this._wrapper.get().showEvents(show);
    }

    static showMessages(show: boolean) {
        this._wrapper.get().showMessages(show);
    }

    static showVariables(show: boolean) {
        this._wrapper.get().showVariables(show);

    }

    static showHourglass(show: boolean) {
        this._wrapper.get().showHourglass(show);

    }

    static registerLogger(log_method: (text:string) => void): void {
        this._wrapper.get().logger = log_method
    }

    static logToString(): StringWrapper {
        this._wrapper = new SingleWrapper(new LoggingInstance());
        return SimpleLogger._wrapper.get().logToString()

    }

    static useMarkers<T>(code: () => T, parameters: (string | (() => string)) = "", logReturnValue: boolean = false): T {
        return this._wrapper.get().useMarkers(1, code, parameters, logReturnValue);
    }

    static variable(name: string, value: any, show_types: boolean = false) {
        SimpleLogger._wrapper.get().variable(name, value, show_types)
    }

    static hourglass() {
        this._wrapper.get().hourglass();

    }

    static showAll(show: boolean) {
        this._wrapper.get().showAll(show);
    }

    static event(text: string) {
        this._wrapper.get().event(text);

    }

    static query(queryText: string) {
        this._wrapper.get().query(queryText);
    }

    static message(messageText: string) {
        this._wrapper.get().message(messageText);

    }

    static warning(exception: string | Error) {
        this._wrapper.get().warning(exception)

    }

    static showTimestamps(show: boolean) {
        this._wrapper.get().showTimestamps(show);
    }
}
