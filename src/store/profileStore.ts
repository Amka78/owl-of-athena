import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuroraProfile } from "../sdk/AuroraTypes";

export type ProfileFilterCondition = {
    showOfficial: boolean;
    showCommunity: boolean;
    showPrivate: boolean;
};

type ProfileStore = {
    list: AuroraProfile[];
    filteredList: AuroraProfile[];
    selected?: AuroraProfile;
    filterCondition: ProfileFilterCondition;
    cacheProfiles: (list: AuroraProfile[]) => void;
    selectProfile: (profile: AuroraProfile) => void;
    updateProfile: (profile: AuroraProfile) => void;
    deleteProfile: (profileId: string) => void;
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
    filterCondition: Partial<ProfileFilterCondition>
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
            continue;
        }
    }
    return filtered;
}

export const useProfileStore = create<ProfileStore>()(
    persist(
        (set, _get) => ({
            list: [],
            filteredList: [],
            selected: undefined,
            filterCondition: initialFilterCondition,

            cacheProfiles: (list) =>
                set((state) => ({
                    list,
                    filteredList: createFilteredProfileList(
                        list,
                        state.filterCondition
                    ),
                })),

            selectProfile: (profile) => set({ selected: profile }),

            updateProfile: (profile) =>
                set((state) => {
                    const list = [...state.list];
                    const idx = list.findIndex((p) => p.id === profile.id);
                    if (idx >= 0) list[idx] = profile;
                    return {
                        list,
                        filteredList: createFilteredProfileList(
                            list,
                            state.filterCondition
                        ),
                    };
                }),

            deleteProfile: (profileId) =>
                set((state) => {
                    const list = _.remove(
                        [...state.list],
                        (p) => p.id !== profileId
                    );
                    return {
                        list,
                        filteredList: createFilteredProfileList(
                            list,
                            state.filterCondition
                        ),
                    };
                }),

            updateFilter: (filter) =>
                set((state) => {
                    const filterCondition = {
                        ...state.filterCondition,
                        ...filter,
                    };
                    return {
                        filterCondition,
                        filteredList: createFilteredProfileList(
                            state.list,
                            filterCondition
                        ),
                    };
                }),

            initializeProfiles: () =>
                set({
                    list: [],
                    filteredList: [],
                    selected: undefined,
                    filterCondition: initialFilterCondition,
                }),
        }),
        {
            name: "profile-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
