import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import { StandardView } from "../../components/atoms/StandardView";

export default {
    title: "Atoms/StandardView",
    component: StandardView,
} as Meta;

const Template: Story = (args) => <StandardView {...args} />;

export const Primary = Template.bind({});
