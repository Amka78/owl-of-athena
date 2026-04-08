//#region Import Modules
import React, { type FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants";
import { useProfile } from "../../hooks/profiles/useProfile";
import { ProfileScreenTemplate } from "../templates/ProfileScreenTemplate";
//#endregion

//#region Component
export const ProfileScreen: FunctionComponent = () => {
    const hook = useProfile();

    if (!hook.selectedProfile) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>No profile selected</Text>
            </View>
        );
    }

    return (
        <ProfileScreenTemplate
            auroraConnected={hook.auroraConnected}
            selectedProfileHasUnSavedChanges={hook.hasUnsavedChanges}
            selectedProfile={hook.selectedProfile}
            isUserProfile={hook.isUserProfile}
            unsavePrfileMenu={{
                onSaveAsNewPress: hook.onSaveAsNewPress,
                onOverwriteSavePress: hook.onOverwriteSavePress,
                onCancelPress: hook.onCancelPress,
            }}
            profileMenu={{
                onInfoPress: hook.onInfoPress,
            }}
            profileSecondMenu={{
                onSaveToAuroraPress: hook.onSaveToAuroraPress,
                onShowAdvancedOptionsPress: hook.onShowAdvancedOptionsPress,
            }}
            grouedOptionList={hook.groupedOptionList}
            dimens={hook.dimens}
        />
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.navy,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: Colors.white,
    },
});
//#endregion
