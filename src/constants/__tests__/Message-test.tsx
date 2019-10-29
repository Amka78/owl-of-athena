import "react-native";
import { Message } from "../";
import { MultiLingualDto } from "../../model";

describe("Message Test", () => {
    it("In the case of the Japanese locale, acquire Japanese.", async () => {
        Message.setLocale("ja-JP");
        expect(Message.get("login")).toBe("ログイン");
    });

    it("In the case of the English locale, acquire English.", async () => {
        Message.setLocale("en-US");
        expect(Message.get("login")).toBe("Login");
    });

    it("Can obtain the language of specified locale from MultiLingualDto", async () => {
        Message.setLocale("ja-JP");

        const testDto = new Array<MultiLingualDto>();
        testDto.push(new MultiLingualDto({ language: "ja-JP", value: "test" }));

        expect(Message.get(testDto)).toBe("test");
    });

    it("If RestParameter is specified Being able to embed words.", async () => {
        Message.setLocale("ja-JP");

        let embedMessage = Message.get({
            key: "month",
            restParam: [{ value: "6", isKey: false }]
        });
        expect(embedMessage).toBe("6ヶ月");

        Message.setLocale("en-US");
        embedMessage = Message.get({
            key: "month",
            restParam: [{ value: "6", isKey: false }]
        });
        expect(embedMessage).toBe("6 Month");
    });
});
