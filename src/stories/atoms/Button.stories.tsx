import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import { Button, ButtonProps } from "../../components/atoms/Button";

export default {
    title: "Atoms/Button",
    component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    children: "Test",
};
