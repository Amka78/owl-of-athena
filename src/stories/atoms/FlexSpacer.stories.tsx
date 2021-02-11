import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

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
