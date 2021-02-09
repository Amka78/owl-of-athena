import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import { FlatButton, FlatButtonProps } from "../../components/atoms/FlatButton";

export default {
    title: "Atoms/FlatButton",
    component: FlatButton,
} as Meta;

const Template: Story<FlatButtonProps> = (args) => <FlatButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    children: "Test",
};
