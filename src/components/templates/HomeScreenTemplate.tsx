//#region Import Modules
import React, { FunctionComponent } from "react";
import { TouchableWithoutFeedback, View } from "react-native";

import { Button, ErrorText, FlatButton, TimeView } from "../atoms";
import { InternalView } from "../molecules";
import { ErrorTextProps } from "../atoms/ErrorText";
import { TimeViewProps } from "../atoms/TimeView";
import { Dimens, Message, MessageKeys } from "../../constants";
import { useConvertibleHeader, useLocale } from "../../hooks";
import { TemplateButtonProps, TemplateFlatButtonProps } from "./TempatedProps";
import { Dimensions } from "../../hooks/useWindowDimensions";
//#endregion

//#region Types
export type HomeScreenTemplateProps = {
    timeViewField: { onPress: () => void };
    timeView: Pick<TimeViewProps, "hours" | "minutes">;
    profileButton: TemplateFlatButtonProps;
    errorText: ErrorTextProps;
    goToSleepButton: TemplateButtonProps;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const HomeScreenTemplate: FunctionComponent<HomeScreenTemplateProps> = (
    props: HomeScreenTemplateProps
) => {
    useLocale(props.locale);

    useConvertibleHeader(
        MessageKeys.home_title,
        props.dimens.isDesktop,
        props.dimens.isSmallHeight
    );
    return (
        <InternalView>
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
                    <FlatButton>
                        {Message.get(MessageKeys.home_edit_alarm_button)}
                    </FlatButton>
                </View>
            </TouchableWithoutFeedback>
            <FlatButton {...props.profileButton}>
                {Message.get(MessageKeys.home_default_profile)}
            </FlatButton>
            <View style={{ alignItems: "center" }}>
                <ErrorText {...props.errorText}></ErrorText>
                <Button
                    {...props.goToSleepButton}
                    screenWidth={props.dimens.width}
                >
                    {Message.get(MessageKeys.home_go_to_sleep_button)}
                </Button>
            </View>
        </InternalView>
    );
};
//#endregion
