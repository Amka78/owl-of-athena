import "react-native";
import { Message } from "../";

describe("Message Test", () => {
    it("In the case of the Japanese locale, acquire Japanese.", async () => {
        Message.setLocale("ja-JP");
        expect(Message.get("login")).toBe("ログイン");
    });

    it("In the case of the English locale, acquire English.", async () => {
        Message.setLocale("en-US");
        expect(Message.get("login")).toBe("Log In");
    });

    it("If RestParameter is specified Being able to embed words.", async () => {
        Message.setLocale("ja-JP");

        let embedMessage = Message.get({
            key: "required",
            restParam: [{ value: "test", isKey: false }]
        });
        expect(embedMessage).toBe("testは必須入力です。");

        Message.setLocale("en-US");
        embedMessage = Message.get({
            key: "required",
            restParam: [{ value: "test", isKey: false }]
        });
        expect(embedMessage).toBe("test field is required.");
    });
});
