//#region Import Modules
import { useWindowDimensions as useDimensions } from "react-native";

import { Dimens } from "../constants";
//#endregion

//#region Types
export type Dimensions = {
    fontScale: number;
    scale: number;
    height: number;
    width: number;
    isDesktop: boolean;
    isLargeWidth: boolean;
    isSmallHeight: boolean;
    isVertical: boolean;
    isHorizontal: boolean;
};
//#region Hooks
export const useWindowDimensions = (): Dimensions => {
    const dimension = useDimensions();

    const isDesktop =
        dimension.height >= Dimens.inner_screen_max_height &&
        dimension.width >= Dimens.inner_screen_max_width;
    const isSmallHeight = dimension.height <= Dimens.small_height;
    const isLargeWidth = dimension.width > Dimens.button_max_width * 2;
    const isVertical = dimension.width < dimension.height;
    const isHorizontal = !isVertical;

    return {
        ...dimension,
        isDesktop,
        isLargeWidth,
        isSmallHeight,
        isVertical,
        isHorizontal,
    };
};
//#endregion
