//#region Import modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { NavigationState } from "react-navigation";

import { FlatButton } from "../../components";
import { FlatButtonProps } from "../../components/FlatButton";
import { MainContainer } from "../../navigation";
//#endregion

//#region Types
export type MainScreenTemplateProps = {
    mainContainer: {
        onNavagationStateChange: (
            _prevNavigationState: NavigationState,
            _nextNavigationState: NavigationState,
            action: any
        ) => void;
    };
    AuroraConnectionStatesBar: FlatButtonProps;
};
//#endregion

//#region Component
export const MainScreenTemplate: FunctionComponent<MainScreenTemplateProps> = (
    props: MainScreenTemplateProps
) => {
    return (
        <View style={{ flex: 1 }}>
            <MainContainer
                onNavigationStateChange={
                    props.mainContainer.onNavagationStateChange
                }
            ></MainContainer>
            <FlatButton {...props.AuroraConnectionStatesBar}></FlatButton>
        </View>
    );
};
//#endregion
