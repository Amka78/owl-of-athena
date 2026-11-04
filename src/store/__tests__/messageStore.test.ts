import MessageService from "../../services/MessageService";
import type { UserMessage } from "../../types";
import { useMessageStore } from "../messageStore";

jest.mock("../../services/MessageService", () => ({
    __esModule: true,
    default: {
        getUserMessages: jest.fn(),
        markMessageAsRead: jest.fn(),
        markAllMessagesAsRead: jest.fn(),
        updateMessage: jest.fn(),
    },
}));

const message = (id: string, readAt?: string): UserMessage => ({
    id,
    title: id,
    message: "",
    type: "info",
    read_at: readAt,
});

describe("messageStore UnitTest", () => {
    beforeEach(() => {
        useMessageStore.setState({
            messages: [],
            loading: false,
            loaded: false,
            error: undefined,
        });
        jest.clearAllMocks();
    });

    it("stores messages and marks them as loaded", async () => {
        (MessageService.getUserMessages as jest.Mock).mockResolvedValue([message("m1")]);

        await useMessageStore.getState().loadMessages();

        expect(useMessageStore.getState().messages).toHaveLength(1);
        expect(useMessageStore.getState().loaded).toBe(true);
        expect(useMessageStore.getState().loading).toBe(false);
    });

    it("marks loaded even when loading fails", async () => {
        (MessageService.getUserMessages as jest.Mock).mockRejectedValue(new Error("offline"));

        await useMessageStore.getState().loadMessages();

        expect(useMessageStore.getState().loaded).toBe(true);
        expect(useMessageStore.getState().error).toBe("offline");
    });

    it("does not fetch again once loaded", async () => {
        useMessageStore.setState({ loaded: true });

        await useMessageStore.getState().loadMessages();

        expect(MessageService.getUserMessages).not.toHaveBeenCalled();
    });

    it("resets messages on logout", () => {
        useMessageStore.setState({
            messages: [message("m1")],
            loaded: true,
            error: "old error",
        });

        useMessageStore.getState().resetMessages();

        expect(useMessageStore.getState().messages).toEqual([]);
        expect(useMessageStore.getState().loaded).toBe(false);
        expect(useMessageStore.getState().error).toBeUndefined();
    });
});
