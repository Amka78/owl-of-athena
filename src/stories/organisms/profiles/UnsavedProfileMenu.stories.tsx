//#region Import Modules
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    UnsavedProfileMenu,
    UnsavedProfileMenuProps,
} from "../../../components/organisms/profiles/UnsavedProfileMenu";
//#endregion

//#region Story
export default {
    title: "Organisms/UnsavedProfileMenu",
    component: UnsavedProfileMenu,
} as Meta;

const Template: Story<UnsavedProfileMenuProps> = (args) => (
    <UnsavedProfileMenu {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
//#endregion
