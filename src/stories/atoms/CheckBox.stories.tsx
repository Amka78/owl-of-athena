import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import { CheckBox, CheckBoxProps } from "../../components/atoms/CheckBox";

export default {
    title: "Atoms/CheckBox",
    component: CheckBox,
    argTypes: {
        color: { control: "color" },
        uncheckedColor: { control: "color" },
    },
} as Meta;

const Template: Story<CheckBoxProps> = (args) => <CheckBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    status: "checked",
};
