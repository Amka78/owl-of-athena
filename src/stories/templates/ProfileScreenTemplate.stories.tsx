//#region Import Modules
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { ProfileScreen, ProfileScreenProps } from "./containered/ProfileScreen";
import * as ProfileMenuStories from "../organisms/profiles/ProfileMenu.stories";
//#endregion

//#region Story
export default {
    title: "Templates/ProfileScreen",
    component: ProfileScreen,
} as Meta;

const Template: Story<ProfileScreenProps> = (args) => (
    <ProfileScreen {...args} />
);

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
    selectedProfile: ProfileMenuStories.Primary.args?.selectedProfile,
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
    selectedProfile: ProfileMenuStories.Primary.args?.selectedProfile,
};
//#endregion
