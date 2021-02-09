import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    LabeledSelectorMenu,
    LabeledSelectorMenuProps,
} from "../../components/molecules/LabeledSelectorMenu";
export default {
    title: "Molecules/LabeledSelectorMenu",
    component: LabeledSelectorMenu,
    argTypes: {
        backgroundColor: { control: "color" },
    },
} as Meta;

const Template: Story<LabeledSelectorMenuProps> = (args) => (
    <LabeledSelectorMenu {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    label: "test",
};
