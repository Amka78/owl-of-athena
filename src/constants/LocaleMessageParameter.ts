import type { MessageLocalizationParam } from "./Message";

export default class LocaleMessageParameter implements Partial<MessageLocalizationParam> {
    constructor() {
        this.key = "";
    }
    public key: string;
    public restParam?: string[];
}
