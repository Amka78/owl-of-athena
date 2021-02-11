import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    ValidatableTextBox,
    ValidatableTextBoxProps,
} from "../../components/molecules/ValidatableTextBox";

export default {
    title: "Molecules/ValidatableTextBox",
    component: ValidatableTextBox,
} as Meta;

const Template: Story<ValidatableTextBoxProps> = (args) => (
    <ValidatableTextBox {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    helperText: "error",
};
