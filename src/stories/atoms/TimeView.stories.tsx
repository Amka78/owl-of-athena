import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import { TimeView, TimeViewProps } from "../../components/atoms/TimeView";

export default {
    title: "Atoms/TimeView",
    component: TimeView,
} as Meta;

const Template: Story<TimeViewProps> = (args) => <TimeView {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    hours: 24,
    minutes: 59,
};
