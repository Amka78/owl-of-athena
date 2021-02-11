import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    LabeledCheckBox,
    LabeledCheckBoxProps,
} from "../../components/molecules/LabeledCheckBox";
export default {
    title: "Molecules/LabeledCheckBox",
    component: LabeledCheckBox,
    argTypes: {
        checkBoxColor: { control: "color" },
        checkBoxUncheckedColor: { control: "color" },
    },
} as Meta;

const Template: Story<LabeledCheckBoxProps> = (args) => (
    <LabeledCheckBox {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    label: "test",
    labelPlace: "left",
    status: "checked",
};
