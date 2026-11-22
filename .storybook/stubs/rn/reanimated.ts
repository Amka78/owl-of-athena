// Vite alias target for react-native-reanimated.
// The real package (and its official CJS mock) pull in worklets and require()
// calls that the vitest browser pre-bundler cannot handle. Story render tests
// only need the hook/anim API surface; provide a self-contained ESM stub.
import React from "react";
import { makeHost } from "./host";

export const useSharedValue = <T>(initial: T) => {
    const ref = { value: initial };
    return ref;
};

export const useAnimatedStyle = (factory: any) => {
    const style = typeof factory === "function" ? factory() : factory;
    return style && typeof style === "object" ? style : {};
};

export const useDerivedValue = (factory: any) => ({
    value: typeof factory === "function" ? factory() : factory,
});

export const useAnimatedProps = (factory: any) => ({
    animatedProps: typeof factory === "function" ? factory() : factory,
});

export const useAnimatedReaction = () => {};
export const useAnimatedRef = () => ({ current: null });
export const useScrollTo = () => {};
export const useAnimatedSensor = () => ({ sensor: null, unregister: () => {} });
export const useFrameCallback = () => {};
export const useReducedMotion = () => false;

export const runOnJS = <F extends (...args: any[]) => any>(fn: F): F => fn;
export const runOnUI = <F extends (...args: any[]) => any>(fn: F): F => fn;
export const cancelAnimation = () => {};

export const withTiming = <T>(toValue: T) => toValue;
export const withSpring = <T>(toValue: T) => toValue;
export const withRepeat = <T>(value: T) => value;
export const withSequence = (...values: any[]) => values[values.length - 1];
export const withDelay = (_delayMs: number, value: any) => value;
export const withDecay = (value: any) => value;

export const interpolate = (_value: number, _input: number[], output: number[]) => output[0] ?? 0;
export const interpolateColor = (_value: number, _input: number[], output: string[]) =>
    output[0] ?? "#000";
export const Extrapolate = { EXTEND: "extend", CLAMP: "clamp", IDENTITY: "identity" };
export const Easing = {
    linear: (v: number) => v,
    in: (v: number) => v,
    out: (v: number) => v,
    inOut: (v: number) => v,
    bezier: () => (v: number) => v,
    circle: (v: number) => v,
    exp: (v: number) => v,
    sin: (v: number) => v,
    back: (v: number) => v,
    bounce: (v: number) => v,
    elastic: (v: number) => v,
    quad: (v: number) => v,
    cubic: (v: number) => v,
    poly: () => (v: number) => v,
    steps: () => (v: number) => v,
};

export const Animated: any = Object.assign(
    ({ children }: any) => React.createElement(React.Fragment, null, children),
    {
        View: makeHost("AnimatedView"),
        Text: makeHost("AnimatedText"),
        ScrollView: makeHost("AnimatedScrollView"),
        FlatList: makeHost("AnimatedFlatList"),
        Image: makeHost("AnimatedImage"),
        createAnimatedComponent: (Component: any) => Component,
    },
);

export default Animated;
