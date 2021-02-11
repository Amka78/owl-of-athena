//#region Import Modules
import { NavigationContainer } from "@react-navigation/native";
import React, { FunctionComponent } from "react";
import { Platform, StyleSheet } from "react-native";
import { Portal, Provider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Theme, Layout } from "../constants";
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
    const rootWidth =
        Layout.isLargeDevice && Platform.OS === "web"
            ? Layout.maxWidth
            : Layout.window.width;

    return (
        <Provider theme={Theme}>
            <Portal>
                <NavigationContainer>
                    <SafeAreaProvider>
                        <SafeAreaView
                            mode={"margin"}
                            style={[styles.container, { width: rootWidth }]}
                        >
                            {props.children}
                        </SafeAreaView>
                    </SafeAreaProvider>
                </NavigationContainer>
            </Portal>
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
