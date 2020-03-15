import { MessageKeys } from "./Message";

export default class LocaleMessageParameter {
    constructor() {
        this.key = "";
    }
    public key: MessageKeys;
    public restParam?: MessageKeys[];
}
