import { act, fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { IssueReportDialog } from "../IssueReportDialog";

jest.mock("expo-image-picker", () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
}));

jest.mock("expo-document-picker", () => ({
    getDocumentAsync: jest.fn(),
}));

jest.mock("../../../services/IssueService", () => ({
    __esModule: true,
    default: {
        createIssue: jest.fn(),
        getIssues: jest.fn(),
        getAttachments: jest.fn(),
    },
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const showDialog = async (): Promise<void> => {
    await act(async () => {
        IssueReportDialog.show({});
    });
};

describe("IssueReportDialog attachments", () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        const ImagePicker = await import("expo-image-picker");
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
            granted: true,
        });
    });

    it("adds a selected image and removes it", async () => {
        const ImagePicker = await import("expo-image-picker");
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
            canceled: false,
            assets: [
                {
                    uri: "file:///tmp/shot.png",
                    fileName: "shot.png",
                    mimeType: "image/png",
                    fileSize: 1024,
                },
            ],
        });
        const { getByText, queryByText, getByTestId } = renderWithProvider(<IssueReportDialog />);
        await showDialog();

        fireEvent.press(getByText("Attach screenshot / image"));
        await act(async () => {});

        expect(getByText("shot.png")).toBeTruthy();

        fireEvent.press(getByTestId("issue-attachment-remove-0"));
        expect(queryByText("shot.png")).toBeNull();
    });

    it("rejects files larger than 10 MB", async () => {
        const DocumentPicker = await import("expo-document-picker");
        (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
            canceled: false,
            assets: [
                {
                    uri: "file:///tmp/big.zip",
                    name: "big.zip",
                    mimeType: "application/zip",
                    size: 10 * 1024 * 1024 + 1,
                },
            ],
        });
        const { getByText, queryByText } = renderWithProvider(<IssueReportDialog />);
        await showDialog();

        fireEvent.press(getByText("Attach file"));
        await act(async () => {});

        expect(queryByText("big.zip")).toBeNull();
        expect(getByText("Each attachment must be 10 MB or smaller.")).toBeTruthy();
    });
});
