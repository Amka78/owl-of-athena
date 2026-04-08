//#region Import Modules
import React, { type FunctionComponent, useState } from "react";
import { FlatList, StyleSheet, Switch, Text, View } from "react-native";
import { Colors } from "../../constants";
import { useCheckLogging } from "../../hooks";
import { useAuthStore } from "../../store/authStore";
import type { Role } from "../../types/Role";
//#endregion

//#region Component
export const AccountRolesScreen: FunctionComponent = () => {
    useCheckLogging();
    const { user } = useAuthStore();
    const roles: Role[] = user?.roles ?? [];
    const [inactiveRoles, setInactiveRoles] = useState<Set<string>>(new Set());

    const toggleRole = (id: string) => {
        setInactiveRoles((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={roles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const isActive = !inactiveRoles.has(item.id);
                    return (
                        <View style={styles.row}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text
                                style={[styles.status, isActive ? styles.active : styles.inactive]}
                            >
                                {isActive ? "Active" : "Disabled"}
                            </Text>
                            <Switch
                                value={isActive}
                                onValueChange={() => toggleRole(item.id)}
                                trackColor={{ false: Colors.blue, true: Colors.first_accent_color }}
                                thumbColor={isActive ? Colors.cyan : Colors.white}
                            />
                        </View>
                    );
                }}
                ListEmptyComponent={<Text style={styles.empty}>No roles assigned.</Text>}
            />
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.navy },
    row: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.blue,
    },
    title: { flex: 1, color: Colors.white, fontSize: 14 },
    status: { fontSize: 12, marginRight: 8 },
    active: { color: Colors.first_accent_color },
    inactive: { color: Colors.white, opacity: 0.5 },
    empty: { color: Colors.white, textAlign: "center", padding: 32 },
});
//#endregion
