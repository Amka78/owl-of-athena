import { AppLoading } from "expo";
import * as Font from "expo-font";
import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";

import { RootContainer, store } from "./src/store";
import { Colors } from "./src/constants";

interface IAppProps {
    skipLoadingScreen: boolean;
}

interface IAppState {
    isLoadingComplete: boolean;
}
export default class App extends React.Component<IAppProps, IAppState> {
    public state = {
        isLoadingComplete: false
    };

    constructor(props: IAppProps) {
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
            //Asset.loadAsync([require("./assets/images/camera.png")]),
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
        backgroundColor: Colors.navy,
        flex: 1
    }
});
