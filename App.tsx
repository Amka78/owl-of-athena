/* eslint-disable @typescript-eslint/no-var-requires */
//#region Import Modules
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import * as Localization from "expo-localization";
import React from "react";
import { Platform, StatusBar } from "react-native";
import { Container } from "./src/components";
import { UpdateSnackBar } from "./src/components/atoms";
import { Message } from "./src/constants";
import { AuroraManagerInstance, SoundManagerInstance } from "./src/managers";
import { InitialNavigator } from "./src/navigation";
//#endregion

SplashScreen.preventAutoHideAsync();

//#region Types
type AppProps = {
    skipLoadingScreen: boolean;
};

type AppState = {
    isLoadingComplete: boolean;
};
//#endregion

//#region Component
export default class App extends React.Component<AppProps, AppState> {
    public state = {
        isLoadingComplete: false,
    };

    constructor(props: AppProps) {
        super(props);
    }

    public componentDidMount(): void {
        Message.setLocale(Localization.getLocales()[0].languageTag);
        this.loadResourcesAsync();
    }

    public render(): React.ReactNode {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return <></>;
        }
        return (
            <Container>
                {Platform.OS === "ios" && (
                    <StatusBar barStyle="default" />
                )}
                <InitialNavigator></InitialNavigator>
                <UpdateSnackBar></UpdateSnackBar>
            </Container>
        );
    }
    //#endregion

    //#region Function
    public loadResourcesAsync = async (): Promise<void> => {
        try {
            await Promise.all([
                Font.loadAsync({
                    calibre_app_regular: require("./assets/fonts/calibre_app_regular.ttf"),
                    calibre_app_semibold: require("./assets/fonts/calibre_app_semibold.ttf"),
                }),
                Asset.loadAsync([
                    require("./assets/profiles/default_profile_content.ttf"),
                ]),
                SoundManagerInstance.loadResource(),
            ]);
        } catch (error) {
            console.warn(error);
        } finally {
            if (Platform.OS === "web") {
                AuroraManagerInstance.setAuroraSound(
                    SoundManagerInstance.getData()
                );
            }
            this.setState({ isLoadingComplete: true });
            await SplashScreen.hideAsync();
        }
    };
    //#endregion
}
