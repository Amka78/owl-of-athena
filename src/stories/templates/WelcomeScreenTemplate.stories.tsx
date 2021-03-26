//#region Import Modules
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { WelcomeScreen, WelcomeScreenProps } from "./containered/WelcomeScreen";
//#endregion

//#region Story
export default {
    title: "Templates/WelcomeScreen",
    component: WelcomeScreen,
} as Meta;

const Template: Story<WelcomeScreenProps> = (args) => (
    <WelcomeScreen {...args} />
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
