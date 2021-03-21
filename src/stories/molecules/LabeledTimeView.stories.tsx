//#region Import Modules
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    LabeledTimeView,
    LabeledTimeViewProps,
} from "../../components/molecules/LabeledTimeView";
//#endregion

//#region Stories
export default {
    title: "Molecules/LabeledTimeView",
    component: LabeledTimeView,
} as Meta;

const Template: Story<LabeledTimeViewProps> = (args) => (
    <LabeledTimeView {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    hours: 24,
    minutes: 59,
};
//#endregion
