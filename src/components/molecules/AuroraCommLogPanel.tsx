//#region Import Modules
import type React from "react";
import { useRef } from "react";
import type { ScrollViewInstance } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, Message, MessageKeys } from "../../constants";
import type { AuroraCommLogEntry } from "../../services/AuroraCommLog";

//#endregion

//#region Types
type Props = {
    entries: readonly AuroraCommLogEntry[];
    /** パネルの高さ。 */
    height?: number;
};
//#endregion

//#region Constants
const ICON: Record<AuroraCommLogEntry["kind"], string> = {
    send: "➤",
    recv: "✓",
    conn: "◆",
};
const ICON_FAILED = "✗";
const DEFAULT_HEIGHT = 208;
//#endregion

//#region Functions
const pad = (value: number): string => value.toString().padStart(2, "0");

const formatTime = (at: number): string => {
    const d = new Date(at);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const iconColor = (kind: AuroraCommLogEntry["kind"], failed?: boolean): string => {
    if (failed) return Colors.light_orange;
    switch (kind) {
        case "send":
            return Colors.cyan;
        case "recv":
            return Colors.teal;
        case "conn":
            return Colors.yellow;
    }
};

const textColor = (kind: AuroraCommLogEntry["kind"], failed?: boolean): string => {
    if (failed) return Colors.light_orange;
    return kind === "conn" ? Colors.gray : "#eef4ff";
};
//#endregion

//#region Component
export const AuroraCommLogPanel = ({
    entries,
    height = DEFAULT_HEIGHT,
}: Props): React.JSX.Element => {
    const scrollRef = useRef<ScrollViewInstance>(null);

    return (
        <View style={[styles.container, { height }]}>
            <View style={styles.header}>
                <View style={styles.liveDot} />
                <Text style={styles.headerText}>AURORA</Text>
            </View>
            {entries.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>
                        {Message.get(MessageKeys.loading_aurora_comm_waiting)}
                    </Text>
                </View>
            ) : (
                <ScrollView
                    ref={scrollRef}
                    onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                    showsVerticalScrollIndicator={false}
                >
                    {entries.map((entry) => (
                        <CommLogRow key={entry.id} entry={entry} />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const CommLogRow = ({ entry }: { entry: AuroraCommLogEntry }): React.JSX.Element => (
    <View style={styles.row}>
        <Text style={styles.time}>{formatTime(entry.at)}</Text>
        <Text style={[styles.icon, { color: iconColor(entry.kind, entry.failed) }]}>
            {entry.failed ? ICON_FAILED : ICON[entry.kind]}
        </Text>
        <Text
            style={[styles.text, { color: textColor(entry.kind, entry.failed) }]}
            numberOfLines={1}
        >
            {entry.detail !== undefined ? `${entry.text}  ·  ${entry.detail}` : entry.text}
        </Text>
    </View>
);
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.menuBackgroundColor,
        borderColor: "rgba(0, 255, 230, 0.35)",
        borderRadius: 8,
        borderWidth: 1,
        overflow: "hidden",
        width: "100%",
    },
    header: {
        alignItems: "center",
        backgroundColor: "rgba(0, 255, 230, 0.08)",
        flexDirection: "row",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    liveDot: {
        backgroundColor: Colors.teal,
        borderRadius: 4,
        height: 8,
        width: 8,
    },
    headerText: {
        color: Colors.teal,
        fontFamily: Fonts.primarySemiBold,
        fontSize: 11,
        letterSpacing: 2,
    },
    emptyBox: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    emptyText: {
        color: Colors.gray,
        fontSize: 12,
    },
    row: {
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 3,
    },
    time: {
        color: Colors.gray,
        fontSize: 10,
        width: 52,
    },
    icon: {
        fontSize: 10,
        marginRight: 6,
        width: 12,
    },
    text: {
        flex: 1,
        fontSize: 12,
    },
});
//#endregion
