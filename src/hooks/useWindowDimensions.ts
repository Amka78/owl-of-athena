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
    isSmallHeight: boolean;
} => {
    const dimension = useDimensions();

    const isDesktop =
        dimension.height >= Dimens.inner_screen_max_height &&
        dimension.width >= Dimens.inner_screen_max_width;
    const isSmallHeight = dimension.height < 360;
    return { ...dimension, isDesktop, isSmallHeight };
};
//#endregion
