//#region Import Modules
import React, { FunctionComponent } from "react";

import { useAwake } from "../../hooks/useAwake";
import { AwakeScreenTemplate } from "./../templates/AwakeScreenTemplate";
//#endregion

//#region Component
export const AwakeScreen: FunctionComponent = () => {
    const awakeHook = useAwake();

    return (
        <AwakeScreenTemplate
            questionnaireButton={{
                onPress: awakeHook.questionnaireButtonPress,
            }}
            skipButton={{
                onPress: awakeHook.skipButtonPress,
            }}
        ></AwakeScreenTemplate>
    );
};
//#endregion
