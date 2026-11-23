import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { AccountMessagesScreen } from "../../components/pages/AccountMessagesScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock({
        useCheckLogging: vi.fn(),
    });
});

// zustand store の API（subscribe 等）を備えた安定参照モックにする。
// vi.mock のファクトリはホイストされるため、オブジェクトは関数宣言で生成する（const 参照は TDZ になる）。
function createMessageStore() {
    const store = {
        messages: [
            {
                id: "m1",
                title: "Welcome to Owl of Athena",
                message: "Thank you for using the app.",
                read_at: null,
                created_at: "2026-11-01T09:00:00Z",
            },
            {
                id: "m2",
                title: "Update available",
                message: "A new firmware is available for your Aurora.",
                read_at: "2026-11-20T09:00:00Z",
                created_at: "2026-11-18T09:00:00Z",
                questionnaire_id: "q1",
            },
        ],
        loading: false,
        loadMessages: vi.fn(),
        markAsRead: vi.fn(),
        markAllAsRead: vi.fn(),
        updateMessageRespondent: vi.fn(),
        subscribe: vi.fn(),
        setState: vi.fn(),
    };
    return Object.assign(store, {
        getState: () => store,
    });
}

function createQuestionnaireStore() {
    const store = {
        startQuestionnaire: vi.fn(),
        subscribe: vi.fn(),
        setState: vi.fn(),
    };
    return Object.assign(store, {
        getState: () => store,
    });
}

vi.mock("../../store/messageStore", () => {
    const store = createMessageStore();
    return { useMessageStore: Object.assign(() => store, store) };
});

vi.mock("../../store/questionnaireStore", () => {
    const store = createQuestionnaireStore();
    return { useQuestionnaireStore: Object.assign(() => store, store) };
});

const meta = {
    title: "Pages/AccountMessagesScreen",
    component: AccountMessagesScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof AccountMessagesScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", AccountMessagesScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", AccountMessagesScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", AccountMessagesScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
