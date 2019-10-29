export interface IMessageRestParameter {
    isKey?: boolean;

    value: string;
}

export default class LocaleMessageParameter {
    public key?: string;
    public restParam?: IMessageRestParameter[];
}
