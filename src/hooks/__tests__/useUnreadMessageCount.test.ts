import { renderHook, waitFor } from "@testing-library/react-native";

import MessageService from "../../services/MessageService";
import { useMessageStore } from "../../store/messageStore";
import type { UserMessage } from "../../types";
import { useUnreadMessageCount } from "../useUnreadMessageCount";

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

describe("useUnreadMessageCount", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (MessageService.getUserMessages as jest.Mock).mockResolvedValue([]);
        useMessageStore.setState({
            messages: [],
            loaded: true,
            loading: false,
            error: undefined,
        });
    });

    afterEach(() => {
        useMessageStore.setState({
            messages: [],
            loaded: false,
            loading: false,
            error: undefined,
        });
    });

    it("counts messages without read_at", () => {
        useMessageStore.setState({
            messages: [message("m1"), message("m2"), message("m3", "2026-11-04T00:00:00.000Z")],
        });

        const { result } = renderHook(() => useUnreadMessageCount());

        expect(result.current).toBe(2);
    });

    it("returns zero when every message is read", () => {
        useMessageStore.setState({
            messages: [message("m1", "2026-11-04T00:00:00.000Z")],
        });

        const { result } = renderHook(() => useUnreadMessageCount());

        expect(result.current).toBe(0);
    });

    it("loads messages once when they have not been loaded", async () => {
        useMessageStore.setState({ loaded: false, messages: [] });

        const { result } = renderHook(() => useUnreadMessageCount());

        await waitFor(() => expect(MessageService.getUserMessages).toHaveBeenCalledTimes(1));
        expect(result.current).toBe(0);
        expect(useMessageStore.getState().loaded).toBe(true);
    });

    it("returns the unread count after loading", async () => {
        (MessageService.getUserMessages as jest.Mock).mockResolvedValue([
            message("m1"),
            message("m2"),
        ]);
        useMessageStore.setState({ loaded: false, messages: [] });

        const { result } = renderHook(() => useUnreadMessageCount());

        await waitFor(() => expect(result.current).toBe(2));
    });

    it("does not load messages again once loaded", () => {
        const { result } = renderHook(() => useUnreadMessageCount());

        expect(MessageService.getUserMessages).not.toHaveBeenCalled();
        expect(result.current).toBe(0);
    });
});