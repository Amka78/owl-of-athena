import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

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
