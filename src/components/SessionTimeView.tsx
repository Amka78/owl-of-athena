//#region Import Modules
import React, { FunctionComponent } from "react";
import { LabeledTimeView, LabeledTimeViewProps } from "./LabeledTimeView";
import { Dimens } from "../constants";
//#endregion

//#region Types
export type SessionTimeViewProps = LabeledTimeViewProps;
//#endregion
export const SessionTimeView: FunctionComponent<SessionTimeViewProps> = (
    props: SessionTimeViewProps
) => {
    return (
        <LabeledTimeView
            {...props}
            labelStyle={{
                fontSize: Dimens.session_time_text_size,
            }}
            timeMeridianStyle={{
                fontSize: Dimens.session_alarm_meridian_text_size,
            }}
            timeStyle={{
                fontSize: Dimens.session_time_text_size,
            }}
        ></LabeledTimeView>
    );
};
