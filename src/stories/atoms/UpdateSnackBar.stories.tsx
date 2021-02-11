import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    UpdateSnackBarCore as UpdateSnackBar,
    UpdateSnackBarProps,
} from "../../components/atoms/UpdateSnackBar";

export default {
    title: "Atoms/UpdateSnackBar",
    component: UpdateSnackBar,
} as Meta;

const Template: Story<UpdateSnackBarProps> = (args) => (
    <UpdateSnackBar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    showReload: true,
};
