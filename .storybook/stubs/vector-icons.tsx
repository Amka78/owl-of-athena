import React from "react";

// Web stub for @expo/vector-icons: the real package bundles JSX/Flow inside
// .js build files that Vite 8's builtin transform cannot parse, and it pulls
// in expo-font for glyphs. Rendering the icon name keeps stories readable.
type IconProps = {
    name?: string;
    size?: number;
    color?: string;
    disabled?: boolean;
    onPress?: () => void;
    [key: string]: unknown;
};

const makeIcon = (font: string) => (props: IconProps) => {
    const { name, size = 24, color = "black", onPress, style, ...rest } = props;
    // 生の DOM 要素（"Text"）に style 配列を渡すと react-dom がエラーにする
    // ため、React Native 同様に平坦化してオブジェクトで渡す。
    const flattenedStyle = Object.assign(
        {},
        { fontSize: size, color, fontFamily: `${font}-Stub` },
        ...(Array.isArray(style) ? style : [style]).filter(Boolean),
    );
    return React.createElement(
        "Text",
        { style: flattenedStyle, onClick: onPress, ...rest },
        name,
    );
};

const MaterialCommunityIcons = makeIcon("MaterialCommunityIcons");
const MaterialIcons = makeIcon("MaterialIcons");
const Ionicons = makeIcon("Ionicons");
const FontAwesome = makeIcon("FontAwesome");
const FontAwesome5 = makeIcon("FontAwesome5");
const AntDesign = makeIcon("AntDesign");
const Entypo = makeIcon("Entypo");
const EvilIcons = makeIcon("EvilIcons");
const Feather = makeIcon("Feather");
const Foundation = makeIcon("Foundation");
const Octicons = makeIcon("Octicons");
const SimpleLineIcons = makeIcon("SimpleLineIcons");
const Zocial = makeIcon("Zocial");

export {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial,
};
export default {
    MaterialCommunityIcons,
    MaterialIcons,
    Ionicons,
    FontAwesome,
    FontAwesome5,
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    Foundation,
    Octicons,
    SimpleLineIcons,
    Zocial,
};
