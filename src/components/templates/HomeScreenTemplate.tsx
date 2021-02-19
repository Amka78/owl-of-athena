//#region Import Modules
import React, { FunctionComponent } from "react";
import { TouchableWithoutFeedback, View } from "react-native";

import {
    Button,
    ErrorText,
    ErrorTextProps,
    FlatButton,
    StandardView,
    TimeView,
    TimeViewProps,
} from "../atoms";
import { Dimens, Message, MessageKeys } from "../../constants";
import {
    useConvertibleHeader,
    useLocale,
    useWindowDimensions,
} from "../../hooks";
import { TemplateButtonProps, TemplateFlatButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type HomeScreenTemplateProps = {
    timeViewField: { onPress: () => void };
    timeView: Pick<TimeViewProps, "hours" | "minutes">;
    profileButton: TemplateFlatButtonProps;
    errorText: ErrorTextProps;
    goToSleepButton: TemplateButtonProps;
    locale?: string;
};
//#endregion

//#region Component
export const HomeScreenTemplate: FunctionComponent<HomeScreenTemplateProps> = (
    props: HomeScreenTemplateProps
) => {
    useLocale(props.locale);

    const dimens = useWindowDimensions();
    useConvertibleHeader(
        MessageKeys.home_title,
        dimens.isDesktop,
        dimens.isSmallHeight
    );
    return (
        <StandardView
            standardViewStyle={{
                width: Dimens.inner_screen_max_width,
                height: Dimens.inner_screen_max_height,
            }}
        >
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
                <Button {...props.goToSleepButton}>
                    {Message.get(MessageKeys.home_go_to_sleep_button)}
                </Button>
            </View>
        </StandardView>
    );
};
//#endregion
