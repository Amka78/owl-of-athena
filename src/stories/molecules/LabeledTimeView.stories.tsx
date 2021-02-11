import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    LabeledTimeView,
    LabeledTimeViewProps,
} from "../../components/molecules/LabeledTimeView";

export default {
    title: "Molecules/LabeledTimeView",
    component: LabeledTimeView,
} as Meta;

const Template: Story<LabeledTimeViewProps> = (args) => (
    <LabeledTimeView {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    label: "test",
    hours: 24,
    minutes: 59,
};
