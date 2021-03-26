//#region Import Modules
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import { WakingScreen, WakingScreenProps } from "./containered/WakingScreen";
//#endregion

//#region Story
export default {
    title: "Templates/WakingScreen",
    component: WakingScreen,
} as Meta;

const Template: Story<WakingScreenProps> = (args) => (
    <WakingScreen {...args} timeView={{ hours: 9, minutes: 0 }} />
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
