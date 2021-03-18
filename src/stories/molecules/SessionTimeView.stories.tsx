import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    SessionTimeView,
    SessionTimeViewProps,
} from "../../components/molecules/SessionTimeView";

export default {
    title: "Molecules/SessionTimeView",
    component: SessionTimeView,
} as Meta;

const Template: Story<SessionTimeViewProps> = (args) => (
    <SessionTimeView {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    hours: 24,
    minutes: 59,
};
