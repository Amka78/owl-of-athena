//#region Import Modules
import React, { type FunctionComponent } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants";
import { useAdmin } from "../../hooks/useAdmin";

//#endregion

//#region Constants
const API_URLS = [
    "https://api.iwinks.org",
    "https://staging.api.iwinks.org",
    "http://localhost:3000",
];
//#endregion

//#region Component
export const AdminAppSettingsScreen: FunctionComponent = () => {
    const { apiBaseUrl, setApiBaseUrl } = useAdmin();

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>API Base URL</Text>
            {API_URLS.map((url) => (
                <TouchableOpacity
                    key={url}
                    style={[styles.option, apiBaseUrl === url && styles.optionSelected]}
                    onPress={() => setApiBaseUrl(url)}
                >
                    <Text
                        style={[styles.optionText, apiBaseUrl === url && styles.optionTextSelected]}
                    >
                        {url}
                    </Text>
                </TouchableOpacity>
            ))}
            <Text style={styles.currentLabel}>
                Current: <Text style={styles.currentValue}>{apiBaseUrl}</Text>
            </Text>
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.navy, padding: 16 },
    sectionTitle: {
        color: Colors.first_accent_color,
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
    },
    option: {
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.blue,
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: Colors.blue,
    },
    optionSelected: { borderColor: Colors.first_accent_color, backgroundColor: Colors.navy_darker },
    optionText: { color: Colors.white, fontSize: 14 },
    optionTextSelected: { color: Colors.first_accent_color },
    currentLabel: { color: Colors.white, marginTop: 16, fontSize: 12 },
    currentValue: { color: Colors.cyan },
});
//#endregion
