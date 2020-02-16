import { AppLoading } from "expo";
import * as Font from "expo-font";
import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import { RootContainer } from "./src/navigation";
import { store } from "./src/store";
import { Colors, Layout } from "./src/constants";

type AppProps = {
    skipLoadingScreen: boolean;
};

type AppState = {
    isLoadingComplete: boolean;
};
export default class App extends React.Component<AppProps, AppState> {
    public state = {
        isLoadingComplete: false
    };

    constructor(props: AppProps) {
        super(props);
    }

    public render(): JSX.Element {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return (
                <AppLoading
                    startAsync={this.loadResourcesAsync}
                    onError={this.handleLoadingError}
                    onFinish={this.handleFinishLoading}
                />
            );
        } else {
            return (
                <Provider store={store}>
                    <View style={styles.container}>
                        {Platform.OS === "ios" && (
                            <StatusBar barStyle="default" />
                        )}
                        <RootContainer />
                    </View>
                </Provider>
            );
        }
    }

    public loadResourcesAsync = async (): Promise<void[]> => {
        return Promise.all([
            Font.loadAsync({
                calibre_app_regular: require("./assets/fonts/calibre_app_regular.ttf"),
                calibre_app_semibold: require("./assets/fonts/calibre_app_semibold.ttf")
            })
        ]);
    };

    public handleLoadingError = (error: Error): void => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        // tslint:disable-next-line:no-console
        console.warn(error);
    };

    public handleFinishLoading = (): void => {
        this.setState({ isLoadingComplete: true });
    };
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        backgroundColor: Colors.navy,
        flex: 1,
        width:
            Layout.isLargeDevice && Platform.OS === "web"
                ? Layout.maxWidth
                : Layout.window.width
    }
});
