export function printArray<T>(header: string, list: T[], formatter?: ((element: T) => string)): string {
    function getDefaultFormatter() {
        let count = 0;
        return (t: T): string => `[${count++}] => ${t}`;
    }

    formatter = formatter || getDefaultFormatter();
    let text = "";
    if (header) {
        text = header + "\n\n\n";
    }
    for (let t of list) {
        text += formatter(t) + "\n"
    }
    return text;

}

export function printJson(data: any) {
    return JSON.stringify(data, null, "  ");
}
