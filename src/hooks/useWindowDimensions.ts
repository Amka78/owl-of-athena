//#region Import Modules
import { useWindowDimensions as useDimensions } from "react-native";
import { Dimens } from "../constants";
//#endregion

//#region Hooks
export const useWindowDimensions = (): {
    fontScale: number;
    scale: number;
    height: number;
    width: number;
    isDesktop: boolean;
    isLargeWidth: boolean;
    isSmallHeight: boolean;
} => {
    const dimension = useDimensions();

    const isDesktop =
        dimension.height >= Dimens.inner_screen_max_height &&
        dimension.width >= Dimens.inner_screen_max_width;
    const isSmallHeight = dimension.height < 360;
    const isLargeWidth = dimension.width > Dimens.button_max_width * 2;
    return { ...dimension, isDesktop, isLargeWidth, isSmallHeight };
};
//#endregion
