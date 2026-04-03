import {
    GestureResponderEvent,
    NativeSyntheticEvent,
    TextInputEndEditingEventData,
} from "react-native";

import { Dimensions } from "../hooks/useWindowDimensions";

// @ts-ignore
export const FakeGestureResponderEvent: GestureResponderEvent = {};
// @ts-ignore
export const FakeTextBoxOnEndEditingEventData: NativeSyntheticEvent<TextInputEndEditingEventData> = {};

export const DesktopDimension: Dimensions = {
    fontScale: 1,
    height: 980,
    isDesktop: true,
    isHorizontal: true,
    isVertical: false,
    isLargeWidth: true,
    isSmallHeight: false,
    scale: 1,
    width: 1200,
};

export const MobileDimension: Dimensions = {
    fontScale: 1,
    height: 800,
    isDesktop: false,
    isHorizontal: false,
    isVertical: true,
    isLargeWidth: false,
    isSmallHeight: false,
    scale: 2,
    width: 375,
};

/** Create a mock function that tracks calls */
export function mockFn<T extends (...args: any[]) => any>(): jest.Mock<ReturnType<T>> {
    return jest.fn();
}
