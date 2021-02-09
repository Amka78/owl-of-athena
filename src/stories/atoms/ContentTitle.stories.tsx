import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    ContentTitle,
    ContentTitleProps,
} from "../../components/atoms/ContentTitle";

export default {
    title: "Atoms/ContentTitle",
    component: ContentTitle,
} as Meta;

const Template: Story<ContentTitleProps> = (args) => <ContentTitle {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    children: "Test",
};
