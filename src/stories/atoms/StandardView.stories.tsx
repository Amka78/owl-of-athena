import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { StandardView } from "../../components/atoms/StandardView";
export default {
    title: "Atoms/StandardView",
    component: StandardView,
} as Meta;

const Template: Story = (args) => <StandardView {...args} />;

export const Primary = Template.bind({});
