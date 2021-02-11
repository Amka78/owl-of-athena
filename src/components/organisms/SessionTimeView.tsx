//#region Import Modules
import React, { FunctionComponent } from "react";

import { Dimens } from "../../constants";
import { LabeledTimeView, LabeledTimeViewProps } from "../molecules";
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
