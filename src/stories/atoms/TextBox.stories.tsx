import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { TextBox, TextBoxProps } from "../../components/atoms/TextBox";
export default {
    title: "Atoms/TextBox",
    component: TextBox,
    argTypes: {
        selectionColor: { control: "color" },
        underlineColor: { control: "color" },
    },
} as Meta;

const Template: Story<TextBoxProps> = (args) => <TextBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    label: "test",
};
