//#region Import Modules
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { AccountScreen, AccountScreenProps } from "./containered/AccountScreen";
//#endregion

//#region Story
export default {
    title: "Templates/AccountScreen",
    component: AccountScreen,
} as Meta;

const Template: Story<AccountScreenProps> = (args) => (
    <AccountScreen {...args} />
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
