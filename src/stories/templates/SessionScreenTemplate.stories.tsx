//#region Import Modules
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { SessionScreen, SessionScreenProps } from "./containered/SessionScreen";
//#endregion

//#region Story
export default {
    title: "Templates/SessionScreen",
    component: SessionScreen,
} as Meta;

const Template: Story<SessionScreenProps> = (args) => (
    <SessionScreen {...args} />
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
