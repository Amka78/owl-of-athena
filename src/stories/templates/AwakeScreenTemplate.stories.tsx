//#region Import Modules
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { AwakeScreen, AwakeScreenProps } from "./containered/AwakeScreen";
//#endregion

//#region Story
export default {
    title: "Templates/AwakeScreen",
    component: AwakeScreen,
} as Meta;

const Template: Story<AwakeScreenProps> = (args) => <AwakeScreen {...args} />;

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
};
//#endregion
