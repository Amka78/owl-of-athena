//#region Import Modules
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { LoginScreen, LoginScreenProps } from "./containered/LoginScreen";
//#endregion

//#region Story
export default {
    title: "Templates/LoginScreen",
    component: LoginScreen,
} as Meta;

const Template: Story<LoginScreenProps> = (args) => <LoginScreen {...args} />;

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
};
//#endregion
