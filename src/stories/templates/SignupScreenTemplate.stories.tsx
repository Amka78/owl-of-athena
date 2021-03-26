//#region Import Modules
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { SignupScreen, SignupScreenProps } from "./containered/SignupScreen";
//#endregion

//#region Story
export default {
    title: "Templates/SignupScreen",
    component: SignupScreen,
} as Meta;

const Template: Story<SignupScreenProps> = (args) => <SignupScreen {...args} />;

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
};
//#endregion
