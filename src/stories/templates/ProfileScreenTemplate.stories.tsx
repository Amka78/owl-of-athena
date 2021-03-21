//#region Import Modules
import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    ProfileScreenTemplate,
    ProfileScreenTemplateProps,
} from "../../components/templates/ProfileScreenTemplate";
import * as ProfileMenuStories from "../organisms/profiles/ProfileMenu.stories";
//#endregion

//#region Story
export default {
    title: "Templates/ProfileScreen",
    component: ProfileScreenTemplate,
} as Meta;

const Template: Story<ProfileScreenTemplateProps> = (args) => (
    <ProfileScreenTemplate {...args} />
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
