//#region Import Modules
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    ForgotPasswordScreen,
    ForgotPasswordScreenProps,
} from "./containered/ForgotPasswordScreen";
//#endregion

//#region Story
export default {
    title: "Templates/ForgotPasswordScreen",
    component: ForgotPasswordScreen,
} as Meta;

const Template: Story<ForgotPasswordScreenProps> = (args) => (
    <ForgotPasswordScreen {...args} />
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
