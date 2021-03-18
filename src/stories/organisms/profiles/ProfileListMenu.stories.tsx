//#region Import Modules
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    ProfileListMenu,
    ProfileListMenuProps,
} from "../../../components/organisms/profiles/ProfileListMenu";
//#endregion

//#region Story
export default {
    title: "Organisms/ProfileListMenu",
    component: ProfileListMenu,
} as Meta;

const Template: Story<ProfileListMenuProps> = (args) => (
    <ProfileListMenu {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
//#endregion
