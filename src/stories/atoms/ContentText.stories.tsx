import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    ContentText,
    ContentTextProps,
} from "../../components/atoms/ContentText";

export default {
    title: "Atoms/ContentText",
    component: ContentText,
} as Meta;

const Template: Story<ContentTextProps> = (args) => <ContentText {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    children: "Test",
};
