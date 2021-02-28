//#region Import Modules
import React, { FunctionComponent } from "react";

import { Dimens } from "../../constants";
import { LabeledTimeView, LabeledTimeViewProps } from "../molecules";
//#endregion

//#region Types
export type SessionTimeViewProps = LabeledTimeViewProps & {
    isDesktop: boolean;
};
//#endregion

export const SessionTimeView: FunctionComponent<SessionTimeViewProps> = (
    props: SessionTimeViewProps
) => {
    const timeTextSize = props.isDesktop
        ? Dimens.session_time_text_size_desktop
        : Dimens.session_time_text_size_mobile;
    const alarmMeridianTextSize = props.isDesktop
        ? Dimens.session_alarm_meridian_text_size_desktop
        : Dimens.session_alarm_meridian_text_size_mobile;
    return (
        <LabeledTimeView
            {...props}
            labelStyle={{
                fontSize: timeTextSize,
            }}
            timeMeridianStyle={{
                fontSize: alarmMeridianTextSize,
            }}
            timeStyle={{
                fontSize: timeTextSize,
            }}
        ></LabeledTimeView>
    );
};
