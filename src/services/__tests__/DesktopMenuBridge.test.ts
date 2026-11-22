import { act, waitFor } from "@testing-library/react-native";

import { AuroraInfoDialog, ConfirmDialog, LoadingDialog } from "../../components/molecules";
import { AuroraManagerInstance } from "../../managers";
import { AuroraOSInfo } from "../../sdk/models";
import {
    AURORA_MENU_ACTIONS,
    handleDesktopMenuAction,
    installDesktopMenuBridge,
} from "../DesktopMenuBridge";

vi.mock("../../managers", () => ({
    AuroraManagerInstance: {
        executeCommand: vi.fn(),
        isConnected: vi.fn(),
        getOSInfo: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
    },
}));

const executeCommand = AuroraManagerInstance.executeCommand as jest.Mock;
const isConnected = AuroraManagerInstance.isConnected as jest.Mock;
const getOSInfo = AuroraManagerInstance.getOSInfo as jest.Mock;

describe("DesktopMenuBridge", () => {
    let confirmDialogShow: jest.SpyInstance;
    let auroraInfoDialogShow: jest.SpyInstance;

    beforeAll(() => {
        // bun のテスト環境には window が無いため、ブリッジの登録先を用意する。
        (globalThis as Record<string, unknown>).window ??= {};
    });

    beforeEach(() => {
        vi.clearAllMocks();
        executeCommand.mockResolvedValue(undefined);
        isConnected.mockReturnValue(true);
        getOSInfo.mockReturnValue(undefined);

        confirmDialogShow = vi.spyOn(ConfirmDialog, "show").mockImplementation(() => {});
        // LoadingDialog は Instance 未マウントでも動くよう静的に差し替える。
        vi.spyOn(LoadingDialog, "show").mockImplementation(() => {});
        vi.spyOn(LoadingDialog, "close").mockImplementation(() => {});
        auroraInfoDialogShow = vi.spyOn(AuroraInfoDialog, "show").mockImplementation(() => {});
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it("registers the window handler", () => {
        const windowWithBridge = window as unknown as {
            __owlAuroraMenu?: (action: string) => void;
        };
        delete windowWithBridge.__owlAuroraMenu;

        installDesktopMenuBridge();

        expect(windowWithBridge.__owlAuroraMenu).toEqual(expect.any(Function));
    });

    it("shows the firmware info dialog from the menu", () => {
        const osInfo = new AuroraOSInfo({ version: 10001 });
        getOSInfo.mockReturnValue(osInfo);

        handleDesktopMenuAction(AURORA_MENU_ACTIONS.firmwareInfo);

        expect(auroraInfoDialogShow).toHaveBeenCalledWith({ osInfo });
    });

    it("shows a notice when the menu item is used while disconnected", () => {
        isConnected.mockReturnValue(false);

        handleDesktopMenuAction(AURORA_MENU_ACTIONS.resetDevice);

        expect(confirmDialogShow).toHaveBeenCalledTimes(1);
        expect(executeCommand).not.toHaveBeenCalled();
    });

    it("resets the device from the menu after confirmation", async () => {
        handleDesktopMenuAction(AURORA_MENU_ACTIONS.resetDevice);

        const settings = confirmDialogShow.mock.calls[0]?.[0];
        await act(async () => {
            settings?.onConfirm?.();
        });

        await waitFor(() => expect(executeCommand).toHaveBeenCalledWith("os-reset"));
    });

    it("formats the SD card from the menu after confirmation", async () => {
        handleDesktopMenuAction(AURORA_MENU_ACTIONS.formatSd);

        const settings = confirmDialogShow.mock.calls[0]?.[0];
        await act(async () => {
            settings?.onConfirm?.();
        });

        await waitFor(() => expect(executeCommand).toHaveBeenCalledWith("sd-format"));
    });
});
