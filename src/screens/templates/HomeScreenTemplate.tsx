//#region Import Modules
import React, { FunctionComponent } from "react";
import { TouchableWithoutFeedback, View } from "react-native";

import {
    Button,
    ButtonProps,
    ErrorText,
    ErrorTextProps,
    FlatButton,
    StandardView,
    TimeView,
    TimeViewProps,
} from "../../components";
import { FlatButtonProps } from "../../components/FlatButton";
import { Dimens } from "../../constants";
//#endregion

//#region Types
export type HomeScreenTemplateProps = {
    timeViewField: { onPress: () => void };
    timeView: Pick<TimeViewProps, "hours" | "minutes">;
    timeViewButton: FlatButtonProps;
    profileButton: FlatButtonProps;
    errorText: ErrorTextProps;
    goToSleepButton: ButtonProps;
};
//#endregion

//#region Component
export const HomeScreenTemplate: FunctionComponent<HomeScreenTemplateProps> = (
    props: HomeScreenTemplateProps
) => {
    return (
        <StandardView>
            <TouchableWithoutFeedback {...props.timeViewField}>
                <View>
                    <TimeView
                        {...props.timeView}
                        mode={"meridian"}
                        timeStyle={{
                            fontSize: Dimens.home_alarm_time_text_size,
                        }}
                        timeMeridianStyle={{
                            fontSize: Dimens.home_alarm_meridian_text_size,
                        }}
                    ></TimeView>
                    <FlatButton {...props.timeViewButton}></FlatButton>
                </View>
            </TouchableWithoutFeedback>
            <FlatButton {...props.profileButton}></FlatButton>
            <View style={{ alignItems: "center" }}>
                <ErrorText {...props.errorText}></ErrorText>
                <Button {...props.goToSleepButton}></Button>
            </View>
        </StandardView>
    );
};
//#endregion
