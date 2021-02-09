import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import { InlineTimePicker } from "../../components/atoms/InlineTimePicker";

export default {
    title: "Atoms/InlineTimePicker",
    component: InlineTimePicker,
} as Meta;

const Template: Story = (args) => <InlineTimePicker {...args} />;

export const Primary = Template.bind({});
