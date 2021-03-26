//#region Import Modules
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { HomeScreen, HomeScreenProps } from "./containered/HomeScreen";
//#endregion

//#region Story
export default {
    title: "Templates/HomeScreen",
    component: HomeScreen,
} as Meta;

const Template: Story<HomeScreenProps> = (args) => (
    <HomeScreen {...args} timeView={{ hours: 9, minutes: 0 }} />
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
