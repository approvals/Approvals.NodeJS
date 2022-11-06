const StringWriter = require("../../StringWriter");
const approvals = require("../../Approvals");
import { Options } from "../../Core/Options";
import { getJestNamer } from "./JestNamer";


export function verify(sut: any, options?: Options): void {
    const config = approvals.getConfig();
    options = options || new Options()
    const scrubbed = options.scrub(`${sut}`);
    const writer = new StringWriter(config,  scrubbed, options.forFile().getFileExtension());
    approvals.verifyWithControl(getJestNamer(), writer, null, config);
}

export function verifyAsJson(data: any, options?: Options): void {
    const text = JSON.stringify(data, null, "  ");
    options = options || new Options()
    options = options.forFile().withFileExtention(".json")
    verify(text, options);
}

export function printArray<T>(header: string, list: T[], formatter: (element: T) => string) {
    let text = "";
    if (header){
        text = header + "\n\n\n";
    }
    for (let t of list) {
        text += formatter(t) + "\n"
    }
    return text;

}

export function verifyAll<T>(header:string, list: T[], formatter?: ((element: T) => string), options?: Options): void{
    let count = 0;
    function defaultFormatter(t:T):string{
        return `[${count++}] => ${t}`;
    }
    formatter = formatter || defaultFormatter;
    const text = printArray(header, list, formatter);
    verify(text, options);
}
