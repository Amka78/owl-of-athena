//#region Import Modules
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    UnsavedProfileMenu,
    UnsavedProfileMenuProps,
} from "../../../components/organisms/profiles/UnsavedProfileMenu";
import { getDimensions } from "../../WindowDimensionsForStoryBook";
//#endregion

//#region Story
export default {
    title: "Organisms/UnsavedProfileMenu",
    component: UnsavedProfileMenu,
} as Meta;

const Template: Story<UnsavedProfileMenuProps> = (args) => (
    <UnsavedProfileMenu {...args} dimens={getDimensions()} />
);

export const Primary = Template.bind({});
Primary.args = {};
//#endregion
