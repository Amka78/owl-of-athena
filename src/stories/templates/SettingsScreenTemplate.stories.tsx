//#region Import Modules
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    SettingsScreen,
    SettingsScreenProps,
} from "./containered/SettingsScreen";
//#endregion

//#region Story
export default {
    title: "Templates/SettingsScreen",
    component: SettingsScreen,
} as Meta;

const Template: Story<SettingsScreenProps> = (args) => (
    <SettingsScreen {...args} />
);

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
    profileMenu: { hasProfiles: false, value: "" },
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
    profileMenu: { hasProfiles: false, value: "" },
};
//#endregion
