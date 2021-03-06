import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    LabeledRadioButton,
    LabeledRadioButtonProps,
} from "../../components/molecules/LabeledRadioButton";
export default {
    title: "Molecules/LabeledRadioButton",
    component: LabeledRadioButton,
    argTypes: {
        radioButtonColor: { control: "color" },
        radioButtonUncheckedColor: { control: "color" },
    },
} as Meta;

const Template: Story<LabeledRadioButtonProps> = (args) => (
    <LabeledRadioButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    label: "test",
};
