//#region Import Modules
import React, { FunctionComponent } from "react";
import { useWindowDimensions } from "../../hooks";

import { useAwake } from "../../hooks/useAwake";
import { AwakeScreenTemplate } from "./../templates/AwakeScreenTemplate";
//#endregion

//#region Component
export const AwakeScreen: FunctionComponent = () => {
    const awakeHook = useAwake();
    const dimens = useWindowDimensions();

    return (
        <AwakeScreenTemplate
            questionnaireButton={{
                onPress: awakeHook.questionnaireButtonPress,
            }}
            skipButton={{
                onPress: awakeHook.skipButtonPress,
            }}
            dimens={dimens}
        ></AwakeScreenTemplate>
    );
};
//#endregion
