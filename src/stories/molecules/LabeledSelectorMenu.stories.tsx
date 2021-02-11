import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    LabeledSelectorMenu,
    LabeledSelectorMenuProps,
} from "../../components/molecules/LabeledSelectorMenu";
export default {
    title: "Molecules/LabeledSelectorMenu",
    component: LabeledSelectorMenu,
} as Meta;

const Template: Story<LabeledSelectorMenuProps> = (args) => (
    <LabeledSelectorMenu {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    label: "test",
};
