import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerActions, type ParamListBase } from "@react-navigation/native";
import { act, renderHook } from "@testing-library/react-native";
import type { RefObject } from "react";

import { useMainDrawerNavigator } from "../useMainDrawerNavigator";

const mobileDims = {
    width: 375,
    height: 800,
    fontScale: 1,
    scale: 2,
    isDesktop: false,
    isLargeWidth: false,
    isSmallHeight: false,
    isVertical: true,
    isHorizontal: false,
};

const desktopDims = {
    width: 1440,
    height: 900,
    fontScale: 1,
    scale: 1,
    isDesktop: true,
    isLargeWidth: true,
    isSmallHeight: false,
    isVertical: false,
    isHorizontal: true,
};

let mockDims = mobileDims;

vi.mock("../index", () => ({
    useCheckLogging: vi.fn(),
    useLogout: () => ({ onPress: vi.fn() }),
    useWindowDimensions: () => mockDims,
}));

const createDrawerRef = (dispatch: jest.Mock) =>
    ({ current: { dispatch } }) as unknown as RefObject<DrawerNavigationProp<ParamListBase> | null>;

describe("useMainDrawerNavigator", () => {
    afterEach(() => {
        mockDims = mobileDims;
    });

    it("縦画面（モバイル）では closeDrawer が Drawer 自身へ dispatch される", () => {
        const dispatch = vi.fn();

        renderHook(() => useMainDrawerNavigator(createDrawerRef(dispatch)));

        expect(dispatch).toHaveBeenCalledWith(DrawerActions.closeDrawer());
    });

    it("デスクトップでは closeDrawer は dispatch されず drawerType が permanent になる", () => {
        mockDims = desktopDims;
        const dispatch = vi.fn();

        const { result } = renderHook(() => useMainDrawerNavigator(createDrawerRef(dispatch)));

        expect(dispatch).not.toHaveBeenCalled();
        expect(result.current.drawerType).toBe("permanent");
    });

    it("メニュー押下で toggleDrawer が Drawer 自身へ dispatch される（モバイル・閉状態）", () => {
        const dispatch = vi.fn();

        const { result } = renderHook(() => useMainDrawerNavigator(createDrawerRef(dispatch)));

        act(() => {
            result.current.onDrawerMenuPress();
        });

        expect(dispatch).toHaveBeenCalledWith(DrawerActions.toggleDrawer());
    });
});
