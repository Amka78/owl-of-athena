// Shared helpers for the storybook browser test stubs.
// react-native-web flattens RN の style 配列を DOM に渡す前に平坦化するが、
// makeHost のホスト要素はそれを素通りするため、ここで平坦化してから
// createElement する（配列のまま渡すと react-dom が CSSStyleDeclaration の
// インデックスプロパティ設定で throw する）。
import React from "react";

const flattenStyle = (style: unknown): unknown =>
    Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style;

export const makeHost = (name: string) => {
    const C = (props: any) =>
        React.createElement(name, {
            ...props,
            style: flattenStyle(props.style),
        });
    C.displayName = name;
    return C;
};

export default makeHost;