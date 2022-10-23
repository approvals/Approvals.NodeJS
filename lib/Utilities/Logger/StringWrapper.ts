export class StringWrapper {
    public contents: string;
    constructor() {
        this.contents = ""
    }
    toString(){
        return this.contents;
    }
    append(text: string): void{
        this.contents += text
    }
}