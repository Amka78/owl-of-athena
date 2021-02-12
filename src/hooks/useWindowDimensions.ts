import { useWindowDimensions as useDimensions } from "react-native";
export const useWindowDimensions = (): {
    fontScale: number;
    scale: number;
    height: number;
    width: number;
} => {
    const dimension = useDimensions();

    return { ...dimension };
};
