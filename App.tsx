/* eslint-disable @typescript-eslint/no-var-requires */
//#region Import Modules
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import { Audio } from "expo-av";
import * as Font from "expo-font";
import * as Localization from "expo-localization";
import React from "react";
import { Platform, StatusBar } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { Container } from "./src/components";
import { AudioDialog, ProfilesDialog } from "./src/components/molecules";
import { UpdateSnackBar } from "./src/components/atoms";
import { Message } from "./src/constants";
import { AuroraManagerInstance } from "./src/managers";
import { InitialNavigator } from "./src/navigation";
import reduxStore from "./src/store";
import { AuroraSound } from "./src/types";
//#endregion

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
    private aNewDaySound = new Audio.Sound();
    private bungleCallSound = new Audio.Sound();
    private classicSound = new Audio.Sound();
    private creationSound = new Audio.Sound();
    private epicSound = new Audio.Sound();
    private greenGardenSound = new Audio.Sound();
    private singingBirdsSound = new Audio.Sound();

    private SoundList = new Array<AuroraSound>();

    public state = {
        isLoadingComplete: false,
    };

    constructor(props: AppProps) {
        super(props);
    }

    public componentDidMount(): void {
        Message.setLocale(Localization.locale);
    }

    public render(): JSX.Element {
        const persistedRedux = reduxStore();
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
                <ReduxProvider store={persistedRedux.store}>
                    <PersistGate
                        loading={undefined}
                        persistor={persistedRedux.persistor}
                    >
                        <Container>
                            {Platform.OS === "ios" && (
                                <StatusBar barStyle="default" />
                            )}
                            <InitialNavigator></InitialNavigator>
                            <AudioDialog
                                auroraSoundList={this.SoundList}
                            ></AudioDialog>
                            <ProfilesDialog></ProfilesDialog>
                            <UpdateSnackBar></UpdateSnackBar>
                        </Container>
                    </PersistGate>
                </ReduxProvider>
            );
        }
    }
    //#endregion

    //#region Function
    public loadResourcesAsync = async (): Promise<void> => {
        Promise.all([
            Font.loadAsync({
                calibre_app_regular: require("./assets/fonts/calibre_app_regular.ttf"),
                calibre_app_semibold: require("./assets/fonts/calibre_app_semibold.ttf"),
            }),
            Asset.loadAsync([
                require("./assets/profiles/default_profile_content.ttf"),
            ]),
            this.aNewDaySound.loadAsync(
                require("./assets/audio/a_new_day.m4a")
            ),
            this.bungleCallSound.loadAsync(
                require("./assets/audio/bugle_call.m4a")
            ),
            this.classicSound.loadAsync(require("./assets/audio/classic.m4a")),
            this.creationSound.loadAsync(
                require("./assets/audio/creation.m4a")
            ),
            this.epicSound.loadAsync(require("./assets/audio/epic.m4a")),
            this.greenGardenSound.loadAsync(
                require("./assets/audio/green_garden.m4a")
            ),
            this.singingBirdsSound.loadAsync(
                require("./assets/audio/singing_birds.m4a")
            ),
        ]);
        return;
    };

    public handleLoadingError = (error: Error): void => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        // tslint:disable-next-line:no-console
        console.warn(error);
    };

    public handleFinishLoading = (): void => {
        this.createSoundList();

        if (Platform.OS === "web") {
            AuroraManagerInstance.setAuroraSound(this.SoundList);
        }

        this.setState({ isLoadingComplete: true });
    };

    private createSoundList() {
        this.SoundList.push({
            fileName: "a_new_day.m4a",
            sound: this.aNewDaySound,
        });
        this.SoundList.push({
            fileName: "bugle_call.m4a",
            sound: this.bungleCallSound,
        });
        this.SoundList.push({
            fileName: "classic.m4a",
            sound: this.classicSound,
        });
        this.SoundList.push({
            fileName: "creation.m4a",
            sound: this.creationSound,
        });
        this.SoundList.push({
            fileName: "epic.m4a",
            sound: this.epicSound,
        });
        this.SoundList.push({
            fileName: "green_garden.m4a",
            sound: this.greenGardenSound,
        });
        this.SoundList.push({
            fileName: "singing_birds.m4a",
            sound: this.singingBirdsSound,
        });
    }
    //#endregion
}
