//#region Import Modules
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import {
    BatteryIcon,
    BatteryIconProps,
} from "../../components/atoms/BatteryIcon";
//#endregion

//#region Export
export default {
    title: "Atoms/BatteryIcon",
    component: BatteryIcon,
} as Meta;

const Template: Story<BatteryIconProps> = (args) => <BatteryIcon {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    isUSBConnected: false,
    batteryLevel: 100,
};
//#endregion
