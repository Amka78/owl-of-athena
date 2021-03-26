//#region Import Modules
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    SessionListScreen,
    SessionListScreenProps,
} from "./containered/SessionListScreen";
//#endregion

//#region Story
export default {
    title: "Templates/SessionListScreen",
    component: SessionListScreen,
} as Meta;

const Template: Story<SessionListScreenProps> = (args) => (
    <SessionListScreen {...args} />
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
