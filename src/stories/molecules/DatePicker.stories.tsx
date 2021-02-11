import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import { DatePicker } from "../../components/molecules/DatePicker";
import { DatePickerProps } from "../../components/molecules/DatePickerProps";

export default {
    title: "Molecules/DatePicker",
    component: DatePicker,
} as Meta;

const Template: Story<DatePickerProps> = (args) => <DatePicker {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    label: "test",
    format: "YYYY年MM月DD日",
};
