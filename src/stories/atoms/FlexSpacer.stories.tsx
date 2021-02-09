import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { FlexSpacer } from "../../components/atoms/FlexSpacer";
export default {
    title: "Atoms/FlexSpacer",
    component: FlexSpacer,
    argTypes: {
        backgroundColor: { control: "color" },
    },
} as Meta;

const Template: Story = (args) => <FlexSpacer {...args} />;

export const Primary = Template.bind({});
