export class StringUtils{

    static replaceAll(text: string, find: string, replace: string) {
        while (text.includes(find)){
            text = text.replace(find,replace);
        }
        return text;
    }
}
