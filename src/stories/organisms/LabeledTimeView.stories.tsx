import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    SessionTimeView,
    SessionTimeViewProps,
} from "../../components/organisms/SessionTimeView";

export default {
    title: "Organisms/SessionTimeView",
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
