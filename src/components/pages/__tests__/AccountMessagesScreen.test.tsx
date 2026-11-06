import { fireEvent, render, waitFor } from "@testing-library/react-native";

import MessageService from "../../../services/MessageService";
import { useMessageStore } from "../../../store/messageStore";
import type { UserMessage } from "../../../types";
import { AccountMessagesScreen } from "../AccountMessagesScreen";

jest.mock("../../../services/MessageService", () => ({
    __esModule: true,
    default: {
        getUserMessages: jest.fn(),
        markMessageAsRead: jest.fn(),
        markAllMessagesAsRead: jest.fn(),
        updateMessage: jest.fn(),
    },
}));

jest.mock("../../molecules/MessageDialog", () => ({
    MessageDialog: () => null,
}));

jest.mock("../../molecules/QuestionnaireDialog", () => ({
    QuestionnaireDialog: () => null,
}));

const message = (id: string, readAt?: string): UserMessage => ({
    id,
    title: id,
    message: "",
    type: "info",
    read_at: readAt,
});

describe("AccountMessagesScreen UnitTest", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useMessageStore.setState({
            messages: [],
            loading: false,
            loaded: true,
            error: undefined,
        });
    });

    it("marks all unread messages as read", async () => {
        useMessageStore.setState({
            messages: [message("m1"), message("m2", "2026-01-01T00:00:00.000Z")],
        });
        (MessageService.markAllMessagesAsRead as jest.Mock).mockResolvedValue(undefined);

        const { getByTestId, queryByTestId } = render(<AccountMessagesScreen />);

        fireEvent.press(getByTestId("mark-all-read-button"));

        await waitFor(() => {
            expect(MessageService.markAllMessagesAsRead).toHaveBeenCalledTimes(1);
        });
        expect(useMessageStore.getState().messages.every((item) => item.read_at)).toBe(true);
        expect(queryByTestId("mark-all-read-button")).toBeNull();
    });

    it("hides the action when every message is already read", () => {
        useMessageStore.setState({
            messages: [message("m1", "2026-01-01T00:00:00.000Z")],
        });

        const { queryByTestId } = render(<AccountMessagesScreen />);

        expect(queryByTestId("mark-all-read-button")).toBeNull();
    });
});
