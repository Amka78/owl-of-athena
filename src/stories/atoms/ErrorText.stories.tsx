import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import { ErrorText, ErrorTextProps } from "../../components/atoms/ErrorText";

export default {
    title: "Atoms/ErrorText",
    component: ErrorText,
} as Meta;

const Template: Story<ErrorTextProps> = (args) => <ErrorText {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    children: "Test",
};
