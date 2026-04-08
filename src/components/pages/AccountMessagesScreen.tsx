//#region Import Modules
import React, { type FunctionComponent, useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Message, MessageKeys } from "../../constants";
import { useCheckLogging } from "../../hooks";
import { useMessageStore } from "../../store/messageStore";
import { useQuestionnaireStore } from "../../store/questionnaireStore";
import { MessageDialog } from "../molecules/MessageDialog";
import { QuestionnaireDialog } from "../molecules/QuestionnaireDialog";
import type { UserMessage } from "../../types";
//#endregion

//#region Component
export const AccountMessagesScreen: FunctionComponent = () => {
    useCheckLogging();
    const { messages, loading, loadMessages, markAsRead, updateMessageRespondent } = useMessageStore();

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const onMessagePress = (item: UserMessage) => {
        MessageDialog.show({
            message: item,
            onMarkAsRead: (id) => markAsRead(id),
            onStartQuestionnaire: async (msg) => {
                const onComplete = () => markAsRead(msg.id);
                if (msg.questionnaire_respondent_id) {
                    QuestionnaireDialog.show({
                        respondentId: msg.questionnaire_respondent_id,
                        onComplete,
                    });
                } else if (msg.questionnaire_id) {
                    const store = useQuestionnaireStore.getState();
                    const respondent = await store.startQuestionnaire(msg.questionnaire_id, onComplete);
                    await updateMessageRespondent(msg.id, respondent.id);
                    QuestionnaireDialog.show({
                        questionnaireId: msg.questionnaire_id,
                        onComplete,
                    });
                }
            },
        });
    };

    return (
        <View style={styles.container}>
            <MessageDialog />
            <QuestionnaireDialog />
            {loading && <Text style={styles.loading}>Loading...</Text>}
            <FlatList
                data={messages}
                keyExtractor={(item, index) => item.id ?? String(index)}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onMessagePress(item)}>
                        <View style={styles.row}>
                            <View style={styles.rowHeader}>
                                <Text style={styles.title}>{item.title ?? "—"}</Text>
                                <View style={[styles.badge, item.read_at ? styles.badgeRead : styles.badgeUnread]}>
                                    <Text style={styles.badgeText}>
                                        {item.read_at
                                            ? Message.get(MessageKeys.messages_read_label)
                                            : Message.get(MessageKeys.messages_unread_label)}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.messagePreview} numberOfLines={2}>{item.message ?? "—"}</Text>
                            <View style={styles.rowFooter}>
                                <Text style={styles.date}>{item.created_at ?? "—"}</Text>
                                {item.questionnaire_id && (
                                    <Text style={styles.questTag}>📋</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    !loading ? (
                        <Text style={styles.empty}>{Message.get(MessageKeys.messages_no_messages)}</Text>
                    ) : null
                }
            />
        </View>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.navy },
    row: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.blue,
    },
    rowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    rowFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
    title: { color: Colors.white, fontSize: 14, fontWeight: "bold", flex: 1 },
    messagePreview: { color: Colors.white, fontSize: 12, opacity: 0.8, marginTop: 4 },
    badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
    badgeRead: { backgroundColor: Colors.blue },
    badgeUnread: { backgroundColor: Colors.first_accent_color },
    badgeText: { color: Colors.white, fontSize: 10, fontWeight: "bold" },
    date: { color: Colors.white, fontSize: 11, opacity: 0.7 },
    questTag: { fontSize: 14 },
    loading: { color: Colors.cyan, textAlign: "center", padding: 16 },
    empty: { color: Colors.white, textAlign: "center", padding: 32 },
});
//#endregion
