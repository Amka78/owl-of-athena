import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const isWidthSmallDevice = width <= 414;

export default {
    isWidthSmallDevice,
    isSmallDevice: isWidthSmallDevice || height < 667,
    window: {
        height,
        width,
    },
};
