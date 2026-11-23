//#region Import Modules

import type React from "react";
import type { ComponentType } from "react";

import { Dimens } from "../../constants";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { Container } from "../Container";
//#endregion

//#region Types
export type DeviceKey = "mobile" | "tablet" | "desktop";
//#endregion

//#region Dimensions
// ページ story が 3 端末サイズで描画するための共有ディメンション。
// フラグはアプリ本体の useWindowDimensions と同じ式（Dimens 定数基準）で計算する。
const makeDimens = (width: number, height: number): Dimensions => ({
    fontScale: 1,
    scale: 1,
    width,
    height,
    isDesktop: height >= Dimens.inner_screen_max_height && width >= Dimens.inner_screen_max_width,
    isSmallHeight: height <= Dimens.small_height,
    isLargeWidth: width > Dimens.button_max_width * 2,
    isVertical: width < height,
    isHorizontal: width >= height,
});

export const DEVICE_SIZES: Record<DeviceKey, Dimensions> = {
    mobile: makeDimens(375, 800),
    tablet: makeDimens(768, 1024),
    desktop: makeDimens(1280, 800),
};
//#endregion

//#region Store
// vi.mock のファクトリはホイストされるため、この store は story の render 内で更新し、
// モックされたフックがレンダー時に読み出す。
let current: Dimensions = DEVICE_SIZES.mobile;

export const getDimens = (): Dimensions => current;

export const setDeviceSize = (key: DeviceKey): void => {
    current = DEVICE_SIZES[key];
};
//#endregion

//#region Helpers
// "../../hooks" バレル全体のモックに使う。ページ固有フックは pageHooks で上書きする。
export const hooksMock = (pageHooks: Record<string, unknown> = {}): Record<string, unknown> => ({
    useLocale: () => undefined,
    useConvertibleHeader: () => undefined,
    useScreenDimensions: getDimens,
    useWindowDimensions: getDimens,
    ...pageHooks,
});

// 端末サイズを設定し、実寸のフレーム（stories/Container）に載せて描画する。
// Desktop バリアントでは引数にアプリが実際に表示する画面（DesktopScreen 系）を渡す。
export const renderAt =
    (key: DeviceKey, Screen: ComponentType): (() => React.JSX.Element) =>
    () => {
        setDeviceSize(key);
        return (
            <Container dimens={getDimens()}>
                <Screen />
            </Container>
        );
    };
//#endregion
