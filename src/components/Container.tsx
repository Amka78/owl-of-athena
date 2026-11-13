//#region Import Modules
import {
    CommonActions,
    createNavigationContainerRef,
    type LinkingOptions,
    NavigationContainer,
} from "@react-navigation/native";
import type React from "react";
import { type FunctionComponent, useCallback, useEffect, useRef } from "react";
import { Linking, Platform, StyleSheet } from "react-native";
import { Provider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { APP_SCHEME, Theme } from "../constants";
import { useWindowDimensions } from "../hooks";
import { isPasswordRecoveryUrl } from "../services/AuthLinkService";
import { useRecoveryLinkStore } from "../store/recoveryLinkStore";
import { traceRender } from "../utils/renderTrace";
import { OfflineBanner } from "./atoms/OfflineBanner";
//#endregion

//#region Types
export type ContainerProps = {
    children: React.ReactNode;
};
//#endregion

//#region Component
export const Container: FunctionComponent<ContainerProps> = (props: ContainerProps) => {
    const dimens = useWindowDimensions();
    traceRender("Container", { width: dimens.width, height: dimens.height });
    const setPendingUrl = useRecoveryLinkStore((state) => state.setPendingUrl);
    const navigationRef = useRef(createNavigationContainerRef()).current;

    const navigateToReset = useCallback(
        (url: string): void => {
            if (!navigationRef.isReady()) return;

            navigationRef.dispatch(
                CommonActions.navigate("Unauthenticated", {
                    screen: "ResetPassword",
                    params: { url },
                }),
            );
            useRecoveryLinkStore.getState().consumePendingUrl();
        },
        [navigationRef],
    );

    useEffect(() => {
        const handleUrl = (url?: string | null): void => {
            if (!url || !isPasswordRecoveryUrl(url)) return;

            setPendingUrl(url);
            navigateToReset(url);
        };

        Linking.getInitialURL().then(handleUrl).catch(() => undefined);
        const subscription = Linking.addEventListener("url", ({ url }) => handleUrl(url));

        return (): void => subscription.remove();
    }, [navigateToReset, setPendingUrl]);

    const onNavigationReady = (): void => {
        const url = useRecoveryLinkStore.getState().pendingUrl;
        if (url) navigateToReset(url);
    };

    const config = {
        screens: {
            Unauthenticated: {
                screens: {
                    Welcome: "",
                    Login: "login",
                    Signup: "signup",
                    ForgotPassword: "forgot-password",
                },
            },
            Main: {
                screens: {
                    Home: {
                        screens: {
                            Home: "home",
                            Settings: "sleep-settings",
                            Sleeping: "sleeping",
                            Awake: "awake",
                            Waking: "waking",
                        },
                    },
                    Sessions: {
                        screens: {
                            List: "sessions/list",
                            Detail: {
                                screens: {
                                    SleepTracking: "sessions/detail/sleep-tracking",
                                    Journal: "sessions/detail/journal",
                                },
                            },
                        },
                    },
                    Settings: {
                        screens: {
                            Account: "settings/account",
                        },
                    },
                },
            },
        },
    };

    const linking: LinkingOptions<object> = {
        prefixes: [`https://${APP_SCHEME}`, `${APP_SCHEME}://`],
        config,
    };

    return (
        <Provider theme={Theme}>
            <NavigationContainer
                ref={navigationRef}
                linking={linking}
                onReady={onNavigationReady}
            >
                <SafeAreaProvider>
                    <SafeAreaView
                        mode={"margin"}
                        // classic Android（API 35 未満）ではウィンドウが既にステータスバーの下から始まるため、
                        // 上端インセットを足すとステータスバーとヘッダーの間に隙間ができる。上端だけ除外する。
                        edges={
                            Platform.OS === "android" && Number(Platform.Version) < 35
                                ? ["left", "right", "bottom"]
                                : undefined
                        }
                        style={[styles.container, { width: dimens.width, height: dimens.height }]}
                    >
                        <OfflineBanner />
                        {props.children}
                    </SafeAreaView>
                </SafeAreaProvider>
            </NavigationContainer>
        </Provider>
    );
};
//#region

//#region Sytles
const styles = StyleSheet.create({
    container: {
        alignSelf: Platform.OS === "web" ? "center" : undefined,
        flex: 1,
    },
});
//#endregion
