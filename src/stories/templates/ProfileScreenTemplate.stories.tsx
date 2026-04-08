import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ProfileScreenTemplate } from "../../components/templates/ProfileScreenTemplate";
import { Theme } from "../../constants";
import { defaultOptions, groupingProfileOptionList } from "../../services/ProfileService";

const groupedOptionList = groupingProfileOptionList(defaultOptions);

const sampleProfile = {
    id: "profile-001",
    content: "",
    name: "default.prof",
    title: "Default Profile",
    type: "official" as const,
    description: "A sample profile.",
    min_firmware_version: 20206,
    created_at: 1504827468,
    updated_at: 1504827468,
    starred: false,
    options: [],
};

const mobileDimens = {
    fontScale: 1,
    scale: 1,
    height: 800,
    width: 400,
    isDesktop: false,
    isLargeWidth: false,
    isSmallHeight: false,
    isVertical: true,
    isHorizontal: false,
};

const desktopDimens = {
    fontScale: 1,
    scale: 1,
    height: 1200,
    width: 1400,
    isDesktop: true,
    isLargeWidth: true,
    isSmallHeight: false,
    isVertical: false,
    isHorizontal: true,
};

const meta = {
    title: "Templates/ProfileScreenTemplate",
    component: ProfileScreenTemplate,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ProfileScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnUSLocale: Story = {
    args: {
        auroraConnected: true,
        selectedProfileHasUnSavedChanges: false,
        selectedProfile: sampleProfile,
        isUserProfile: true,
        unsavePrfileMenu: {
            onSaveAsNewPress: fn(),
            onOverwriteSavePress: fn(),
            onCancelPress: fn(),
        },
        profileMenu: { onInfoPress: fn() },
        profileSecondMenu: { onSaveToAuroraPress: fn(), onShowAdvancedOptionsPress: fn() },
        grouedOptionList: groupedOptionList,
        dimens: mobileDimens,
        locale: "en-US",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const JaJPLocale: Story = {
    args: {
        auroraConnected: false,
        selectedProfileHasUnSavedChanges: true,
        selectedProfile: sampleProfile,
        isUserProfile: true,
        unsavePrfileMenu: {
            onSaveAsNewPress: fn(),
            onOverwriteSavePress: fn(),
            onCancelPress: fn(),
        },
        profileMenu: { onInfoPress: fn() },
        profileSecondMenu: { onSaveToAuroraPress: fn(), onShowAdvancedOptionsPress: fn() },
        grouedOptionList: groupedOptionList,
        dimens: mobileDimens,
        locale: "ja-JP",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    args: {
        auroraConnected: true,
        selectedProfileHasUnSavedChanges: false,
        selectedProfile: sampleProfile,
        isUserProfile: false,
        unsavePrfileMenu: {
            onSaveAsNewPress: fn(),
            onOverwriteSavePress: fn(),
            onCancelPress: fn(),
        },
        profileMenu: { onInfoPress: fn() },
        profileSecondMenu: { onSaveToAuroraPress: fn(), onShowAdvancedOptionsPress: fn() },
        grouedOptionList: groupedOptionList,
        dimens: desktopDimens,
        locale: "en-US",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
