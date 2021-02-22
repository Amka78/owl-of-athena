//#region Import Modules
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import React, { FunctionComponent } from "react";
import { Platform, StyleSheet } from "react-native";
import { Provider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Theme } from "../constants";
import { useWindowDimensions } from "../hooks";
//#endregion

//#region Types
export type ContainerProps = {
    children: React.ReactNode;
};
//#endregion

//#region Component
export const Container: FunctionComponent<ContainerProps> = (
    props: ContainerProps
) => {
    const dimens = useWindowDimensions();
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
                                    SleepTracking:
                                        "sessions/detail/sleep-tracking",
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

    const linking: LinkingOptions = {
        prefixes: ["https://owl-of-athena", "owl-of-athena://"],
        config,
    };

    return (
        <Provider theme={Theme}>
            <NavigationContainer linking={linking}>
                <SafeAreaProvider>
                    <SafeAreaView
                        mode={"margin"}
                        style={[
                            styles.container,
                            { width: dimens.width, height: dimens.height },
                        ]}
                    >
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
