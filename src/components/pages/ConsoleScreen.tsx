//#region Import Modules
import React, { type FunctionComponent, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors, Message, MessageKeys } from "../../constants";
import { useCheckLogging } from "../../hooks";
import { AuroraManagerInstance } from "../../managers";

//#endregion

//#region Types
type ConsoleLine = {
    id: number;
    text: string;
    type: "input" | "output" | "error";
};
//#endregion

//#region Component
export const ConsoleScreen: FunctionComponent = () => {
    useCheckLogging();
    const [lines, setLines] = useState<ConsoleLine[]>([
        { id: 0, text: "Aurora Console Ready", type: "output" },
    ]);
    const [command, setCommand] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);
    const nextId = useRef(1);

    const addLine = (text: string, type: ConsoleLine["type"]) => {
        setLines((prev) => [...prev, { id: nextId.current++, text, type }]);
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 50);
    };

    const onSendPress = async () => {
        const cmd = command.trim();
        if (!cmd) return;
        addLine(`> ${cmd}`, "input");
        setCommand("");

        if (!AuroraManagerInstance.isConnected()) {
            addLine(Message.get(MessageKeys.console_not_connected), "error");
            return;
        }

        try {
            const result = await AuroraManagerInstance.executeCommand(cmd);
            const output = result != null
                ? JSON.stringify(result, null, 2)
                : "OK";
            addLine(output, "output");
        } catch (e: any) {
            addLine(e?.message ?? "Command failed", "error");
        }
    };

    const onClearPress = () => {
        setLines([{ id: nextId.current++, text: "Aurora Console Ready", type: "output" }]);
    };

    const lineColor = (type: ConsoleLine["type"]) => {
        if (type === "error") return "#ff4310";
        if (type === "input") return Colors.cyan;
        return Colors.white;
    };

    return (
        <View style={styles.container}>
            <View style={styles.toolbar}>
                <TouchableOpacity style={styles.clearButton} onPress={onClearPress}>
                    <Text style={styles.clearButtonText}>
                        {Message.get(MessageKeys.console_clear_button)}
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                ref={scrollViewRef}
                style={styles.output}
                contentContainerStyle={styles.outputContent}
            >
                {lines.map((line) => (
                    <Text key={line.id} style={[styles.line, { color: lineColor(line.type) }]}>
                        {line.text}
                    </Text>
                ))}
            </ScrollView>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    value={command}
                    onChangeText={setCommand}
                    placeholder={Message.get(MessageKeys.console_input_placeholder)}
                    placeholderTextColor={Colors.white}
                    onSubmitEditing={onSendPress}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity style={styles.sendButton} onPress={onSendPress}>
                    <Text style={styles.sendButtonText}>
                        {Message.get(MessageKeys.console_send_button)}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.navy },
    toolbar: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 4,
        backgroundColor: Colors.navy_darker,
    },
    clearButton: { paddingHorizontal: 10, paddingVertical: 4 },
    clearButtonText: { color: Colors.first_accent_color, fontSize: 12 },
    output: { flex: 1 },
    outputContent: { padding: 12 },
    line: { fontFamily: "monospace", fontSize: 13, marginBottom: 2 },
    inputRow: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: Colors.blue,
        backgroundColor: Colors.navy_darker,
        padding: 8,
    },
    input: {
        flex: 1,
        color: Colors.white,
        fontFamily: "monospace",
        fontSize: 13,
        padding: 4,
    },
    sendButton: {
        backgroundColor: Colors.first_accent_color,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        marginLeft: 8,
        justifyContent: "center",
    },
    sendButtonText: { color: Colors.navy, fontWeight: "bold", fontSize: 13 },
});
//#endregion
