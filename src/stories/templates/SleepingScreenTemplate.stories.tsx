//#region Import Modules
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    SleepingScreen,
    SleepingScreenProps,
} from "./containered/SleepingScreen";
//#endregion

//#region Story
export default {
    title: "Templates/SleepingScreen",
    component: SleepingScreen,
} as Meta;

const Template: Story<SleepingScreenProps> = (args) => (
    <SleepingScreen {...args} timeView={{ hours: 9, minutes: 0 }} />
);

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
};
//#endregion
