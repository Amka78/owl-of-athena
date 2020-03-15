import "react-native";
import { Message, MessageKeys } from "../";

describe("Message Test", () => {
    it("In the case of the Japanese locale, acquire Japanese.", async () => {
        Message.setLocale("ja-JP");
        expect(Message.get(MessageKeys.login)).toBe("ログイン");
    });

    it("In the case of the English locale, acquire English.", async () => {
        Message.setLocale("en-US");
        expect(Message.get(MessageKeys.login)).toBe("Log In");
    });

    it("If translation value is not exit, output args value.", async () => {
        Message.setLocale("ja-JP");
        expect(Message.get("test")).toBe("test");
    });

    it("If RestParameter is specified Being able to embed words.", async () => {
        Message.setLocale("ja-JP");

        let embedMessage = Message.get(MessageKeys.required, ["test"]);
        expect(embedMessage).toBe("testは必須入力です。");

        embedMessage = Message.get(Message.get(MessageKeys.required), [
            MessageKeys.account_signout
        ]);
        expect(embedMessage).toBe("サインアウトは必須入力です。");
        Message.setLocale("en-US");
        embedMessage = Message.get(MessageKeys.required, ["test"]);
        expect(embedMessage).toBe("test field is required.");
    });
});
