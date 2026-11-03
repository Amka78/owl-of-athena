import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuroraProfile } from "../sdk/AuroraTypes";
import {
    createProfileOptionValues,
    type ProfileOptionValues,
    parseProfileOptions,
} from "../services/ProfileService";

export type ProfileFilterCondition = {
    showOfficial: boolean;
    showCommunity: boolean;
    showPrivate: boolean;
};

type ProfileStore = {
    list: AuroraProfile[];
    filteredList: AuroraProfile[];
    selected?: AuroraProfile;
    optionValues: ProfileOptionValues;
    optionValuesProfileId?: string;
    showAdvancedOptions: boolean;
    filterCondition: ProfileFilterCondition;
    cacheProfiles: (list: AuroraProfile[]) => void;
    addProfile: (profile: AuroraProfile) => void;
    selectProfile: (profile: AuroraProfile) => void;
    updateProfile: (profile: AuroraProfile) => void;
    deleteProfile: (profileId: string) => void;
    setOptionValue: (optionName: string, value: unknown) => void;
    syncSelectedProfileOptions: () => void;
    toggleAdvancedOptions: () => void;
    updateFilter: (filter: Partial<ProfileFilterCondition>) => void;
    initializeProfiles: () => void;
};

const initialFilterCondition: ProfileFilterCondition = {
    showOfficial: true,
    showCommunity: true,
    showPrivate: true,
};

function createFilteredProfileList(
    list: AuroraProfile[],
    filterCondition: Partial<ProfileFilterCondition>,
): AuroraProfile[] {
    const filtered: AuroraProfile[] = [];
    for (const profile of list) {
        if (filterCondition.showOfficial && profile.type === "official") {
            filtered.push(profile);
            continue;
        }
        if (filterCondition.showCommunity && profile.type === "community") {
            filtered.push(profile);
            continue;
        }
        if (filterCondition.showPrivate && profile.type === "private") {
            filtered.push(profile);
        }
    }
    return filtered;
}

const optionValuesFromProfile = (
    profile: AuroraProfile | undefined,
): { optionValues: ProfileOptionValues; optionValuesProfileId: string | undefined } => {
    if (!profile) return { optionValues: {}, optionValuesProfileId: undefined };

    return {
        optionValues: createProfileOptionValues(parseProfileOptions(profile.options)),
        optionValuesProfileId: profile.id,
    };
};

export const useProfileStore = create<ProfileStore>()(
    persist(
        (set) => ({
            list: [],
            filteredList: [],
            selected: undefined,
            optionValues: {},
            optionValuesProfileId: undefined,
            showAdvancedOptions: false,
            filterCondition: initialFilterCondition,

            cacheProfiles: (list) =>
                set((state) => {
                    const selected = state.selected
                        ? (list.find((profile) => profile.id === state.selected!.id) ??
                          state.selected)
                        : undefined;
                    return {
                        list,
                        filteredList: createFilteredProfileList(list, state.filterCondition),
                        selected,
                    };
                }),

            addProfile: (profile) =>
                set((state) => {
                    const list = [profile, ...state.list.filter((p) => p.id !== profile.id)];
                    return {
                        list,
                        filteredList: createFilteredProfileList(list, state.filterCondition),
                        selected: profile,
                        ...optionValuesFromProfile(profile),
                    };
                }),

            selectProfile: (profile) =>
                set({
                    selected: profile,
                    ...optionValuesFromProfile(profile),
                }),

            updateProfile: (profile) =>
                set((state) => {
                    const list = [...state.list];
                    const idx = list.findIndex((p) => p.id === profile.id);
                    if (idx >= 0) list[idx] = profile;
                    else list.unshift(profile);

                    return {
                        list,
                        filteredList: createFilteredProfileList(list, state.filterCondition),
                        selected: state.selected?.id === profile.id ? profile : state.selected,
                    };
                }),

            deleteProfile: (profileId) =>
                set((state) => {
                    const list = state.list.filter((p) => p.id !== profileId);
                    const deletedSelected = state.selected?.id === profileId;
                    return {
                        list,
                        filteredList: createFilteredProfileList(list, state.filterCondition),
                        selected: deletedSelected ? undefined : state.selected,
                        ...(deletedSelected
                            ? { optionValues: {}, optionValuesProfileId: undefined }
                            : {}),
                    };
                }),

            setOptionValue: (optionName, value) =>
                set((state) => ({
                    optionValues: {
                        ...state.optionValues,
                        [optionName]: value,
                    },
                })),

            syncSelectedProfileOptions: () =>
                set((state) => ({
                    ...optionValuesFromProfile(state.selected),
                })),

            toggleAdvancedOptions: () =>
                set((state) => ({
                    showAdvancedOptions: !state.showAdvancedOptions,
                })),

            updateFilter: (filter) =>
                set((state) => {
                    const filterCondition = {
                        ...state.filterCondition,
                        ...filter,
                    };
                    return {
                        filterCondition,
                        filteredList: createFilteredProfileList(state.list, filterCondition),
                    };
                }),

            initializeProfiles: () =>
                set({
                    list: [],
                    filteredList: [],
                    selected: undefined,
                    optionValues: {},
                    optionValuesProfileId: undefined,
                    filterCondition: initialFilterCondition,
                }),
        }),
        {
            name: "profile-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
