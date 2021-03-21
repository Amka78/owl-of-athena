//#region Import Modules
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    ProfileSecondMenu,
    ProfileSecondMenuProps,
} from "../../../components/organisms/profiles/ProfileSecondMenu";
//#endregion

//#region Story
export default {
    title: "Organisms/ProfileSecondMenu",
    component: ProfileSecondMenu,
} as Meta;

const Template: Story<ProfileSecondMenuProps> = (args) => (
    <ProfileSecondMenu {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
//#endregion
