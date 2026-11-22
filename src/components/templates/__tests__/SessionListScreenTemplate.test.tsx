import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import type { AuroraSession } from "../../../sdk/models";
import { FilterByDateValues } from "../../../store/sessionStore";
import { SessionListScreenTemplate } from "../SessionListScreenTemplate";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const filterMenuProps = {
    onPickerValueChange: vi.fn(),
    selectedPickerValue: FilterByDateValues.ANY_TIME,
    anyTimePickerValue: FilterByDateValues.ANY_TIME,
    pastWeekPickerValue: FilterByDateValues.PAST_WEEK,
    pastMonthPickerValue: FilterByDateValues.PAST_MONTH,
    showStarredCheckBoxStatus: "unchecked" as const,
    onShowStarredCheckBoxPress: vi.fn(),
    showNoteCheckBoxStatus: "unchecked" as const,
    onShowNoteCheckBoxPress: vi.fn(),
};

describe("SessionListScreenTemplate", () => {
    it("renders correctly with empty session list", () => {
        const { toJSON } = renderWithProvider(
            <SessionListScreenTemplate
                showFilter={false}
                filterMenuProps={filterMenuProps}
                sessionList={[]}
                onStarPress={vi.fn()}
                onDeletePress={vi.fn()}
                onMenuPress={vi.fn()}
                locale="en-US"
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("keeps title and description on a single line so rows stay aligned", () => {
        const session = {
            id: "session-1",
            sessionAt: Date.UTC(2026, 0, 1),
            sleepScore: 80,
            starred: false,
        } as unknown as AuroraSession;

        const { toJSON } = renderWithProvider(
            <SessionListScreenTemplate
                showFilter={false}
                filterMenuProps={filterMenuProps}
                sessionList={[session]}
                onStarPress={vi.fn()}
                onDeletePress={vi.fn()}
                onMenuPress={vi.fn()}
                locale="en-US"
            />,
        );

        const rendered = JSON.stringify(toJSON());
        // title（曜日）と description（日付）の Text がどちらも numberOfLines=1 で描画される
        const oneLineTexts = rendered.match(/"numberOfLines":1/g) ?? [];
        expect(oneLineTexts.length).toBeGreaterThanOrEqual(2);
    });

    it("vertically centers the score chart within the row", () => {
        const session = {
            id: "session-centered",
            sessionAt: Date.UTC(2026, 0, 1),
            sleepScore: 80,
            starred: false,
        } as unknown as AuroraSession;

        const { toJSON } = renderWithProvider(
            <SessionListScreenTemplate
                showFilter={false}
                filterMenuProps={filterMenuProps}
                sessionList={[session]}
                onStarPress={vi.fn()}
                onDeletePress={vi.fn()}
                onMenuPress={vi.fn()}
                locale="en-US"
            />,
        );

        const hasSvgDescendant = (node: any): boolean =>
            (typeof node?.type === "string" && node.type.includes("Svg")) ||
            (Array.isArray(node?.children) && node.children.some(hasSvgDescendant));

        const isCenteredChartWrapper = (node: any): boolean => {
            if (!node || typeof node !== "object") return false;
            const style = node.props?.style;
            const appliesPaperAlignment =
                Array.isArray(style) &&
                style.some((s: any) => s?.alignSelf === "center") &&
                style.some((s: any) => s?.justifyContent === "center");
            if (appliesPaperAlignment && hasSvgDescendant(node)) return true;
            return Array.isArray(node.children) && node.children.some(isCenteredChartWrapper);
        };

        // paper の left スタイル（alignSelf: "center"）と中央寄せが
        // スコア円（Svg）を包む view に適用されていること
        expect(isCenteredChartWrapper(toJSON())).toBe(true);
    });

    it("renders correctly with ja-JP locale", () => {
        const { toJSON } = renderWithProvider(
            <SessionListScreenTemplate
                showFilter={false}
                filterMenuProps={filterMenuProps}
                sessionList={[]}
                onStarPress={vi.fn()}
                onDeletePress={vi.fn()}
                onMenuPress={vi.fn()}
                locale="ja-JP"
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("shows the NEW badge for unread sessions", () => {
        const session = {
            id: "session-new",
            sessionAt: Date.UTC(2026, 0, 1),
            sleepScore: 80,
            starred: false,
            isNew: true,
        } as unknown as AuroraSession;

        const { getByText } = renderWithProvider(
            <SessionListScreenTemplate
                showFilter={false}
                filterMenuProps={filterMenuProps}
                sessionList={[session]}
                onStarPress={vi.fn()}
                onDeletePress={vi.fn()}
                onMenuPress={vi.fn()}
                locale="en-US"
            />,
        );

        expect(getByText("NEW")).toBeTruthy();
    });

    it("shows the raw sleep score without rewriting out-of-range values", () => {
        const session = {
            id: "session-1",
            sessionAt: Date.UTC(2026, 0, 1),
            sleepScore: 117,
            starred: false,
        } as unknown as AuroraSession;

        const { toJSON } = renderWithProvider(
            <SessionListScreenTemplate
                showFilter={false}
                filterMenuProps={filterMenuProps}
                sessionList={[session]}
                onStarPress={vi.fn()}
                onDeletePress={vi.fn()}
                onMenuPress={vi.fn()}
                locale="en-US"
            />,
        );

        const rendered = JSON.stringify(toJSON());
        // 旧実装の 117 → 72 補正が残っていれば "117" は描画されない
        expect(rendered).toContain("117");
    });

    it("returns null when sessionList is undefined", () => {
        const { queryByRole } = renderWithProvider(
            <SessionListScreenTemplate
                showFilter={false}
                filterMenuProps={filterMenuProps}
                sessionList={undefined}
                onStarPress={vi.fn()}
                onDeletePress={vi.fn()}
                onMenuPress={vi.fn()}
                locale="en-US"
            />,
        );
        // When sessionList is undefined, component returns null so no list items
        expect(queryByRole("list")).toBeNull();
    });

    it("shows filter menu when showFilter is true", () => {
        const { toJSON } = renderWithProvider(
            <SessionListScreenTemplate
                showFilter={true}
                filterMenuProps={filterMenuProps}
                sessionList={[]}
                onStarPress={vi.fn()}
                onDeletePress={vi.fn()}
                onMenuPress={vi.fn()}
                locale="en-US"
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
