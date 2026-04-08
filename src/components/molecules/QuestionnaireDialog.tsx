//#region Import Modules
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Dialog, RadioButton } from "react-native-paper";
import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import type { Question, QuestionChoice, QuestionResponse, Questionnaire, QuestionnaireRespondent } from "../../types";
import { useQuestionnaireStore } from "../../store/questionnaireStore";
import { ContentText, ContentTitle, FlatButton } from "../atoms";

//#endregion

//#region Types
type QuestionnaireDialogSettings = {
    questionnaireId?: string;
    respondentId?: string;
    onComplete?: () => void;
    onClose?: () => void;
};

type QuestionnaireDialogState = {
    settings?: QuestionnaireDialogSettings;
};
//#endregion

//#region Component
export class QuestionnaireDialog extends React.Component<{}, QuestionnaireDialogState> {
    public static Instance?: QuestionnaireDialog;
    private _unsubscribe?: () => void;

    public static show(args: QuestionnaireDialogSettings): void {
        QuestionnaireDialog.Instance!.setState({ settings: args });
        const store = useQuestionnaireStore.getState();
        if (args.respondentId) {
            store.resumeQuestionnaire(args.respondentId, args.onComplete);
        } else if (args.questionnaireId) {
            store.loadQuestionnaire(args.questionnaireId);
        }
    }

    constructor(props: {}) {
        super(props);
        this.state = { settings: undefined };
    }

    public async componentDidMount(): Promise<void> {
        QuestionnaireDialog.Instance = this;
        this._unsubscribe = useQuestionnaireStore.subscribe(() => this.forceUpdate());
    }

    public componentWillUnmount(): void {
        this._unsubscribe?.();
    }

    private close(): void {
        this.state.settings?.onClose?.();
        useQuestionnaireStore.getState().stopQuestionnaire();
        this.setState({ settings: undefined });
    }

    public render(): React.ReactNode {
        if (!this.state.settings) return null;
        const { questionnaire, respondent, loading, error } = useQuestionnaireStore.getState();

        return (
            <Dialog visible={true} style={styles.dialog}>
                <Dialog.Title style={styles.title}>
                    {questionnaire?.intro_title ?? "Questionnaire"}
                </Dialog.Title>
                <Dialog.ScrollArea style={styles.scrollArea}>
                    <ScrollView>{this.renderContent(questionnaire, respondent, loading, error)}</ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>{this.renderActions(questionnaire, respondent, loading)}</Dialog.Actions>
            </Dialog>
        );
    }

    private renderContent(
        questionnaire?: Questionnaire,
        respondent?: QuestionnaireRespondent,
        loading?: boolean,
        error?: string,
    ): React.ReactNode {
        if (loading) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator color={Colors.cyan} />
                    <ContentText>{Message.get(MessageKeys.questionnaire_loading)}</ContentText>
                </View>
            );
        }
        if (error) {
            return <ContentText style={styles.errorText}>{error}</ContentText>;
        }
        if (respondent?.completed_at && questionnaire) {
            return (
                <View style={styles.section}>
                    <ContentTitle style={styles.sectionTitle}>{questionnaire.outro_title ?? Message.get(MessageKeys.questionnaire_complete_title)}</ContentTitle>
                    {questionnaire.outro_text ? <ContentText>{questionnaire.outro_text}</ContentText> : null}
                </View>
            );
        }
        if (respondent?.current_question) {
            return this.renderQuestion(respondent.current_question);
        }
        if (questionnaire && !respondent?.id) {
            return (
                <View style={styles.section}>
                    {questionnaire.intro_subtitle ? <ContentText style={styles.subtitle}>{questionnaire.intro_subtitle}</ContentText> : null}
                    {questionnaire.intro_text ? <ContentText>{questionnaire.intro_text}</ContentText> : null}
                </View>
            );
        }
        return null;
    }

    private renderQuestion(question: Question): React.ReactNode {
        const { response, setResponse } = useQuestionnaireStore.getState();
        return (
            <View style={styles.section}>
                <ContentText style={styles.questionText}>{question.text}</ContentText>
                {question.type === "radio" && question.choices?.map((choice: QuestionChoice) => {
                    const selected = response.some((r) => r.question_choice_id === choice.id);
                    return (
                        <TouchableOpacity
                            key={choice.id}
                            style={styles.choiceRow}
                            onPress={() => setResponse([{ question_id: question.id, question_choice_id: choice.id }])}
                        >
                            <RadioButton
                                value={choice.id}
                                status={selected ? "checked" : "unchecked"}
                                color={Colors.cyan}
                                onPress={() => setResponse([{ question_id: question.id, question_choice_id: choice.id }])}
                            />
                            <ContentText>{choice.label}</ContentText>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }

    private renderActions(
        questionnaire?: Questionnaire,
        respondent?: QuestionnaireRespondent,
        loading?: boolean,
    ): React.ReactNode {
        if (loading) return null;

        if (respondent?.completed_at) {
            return (
                <FlatButton labelStyle={styles.primaryButton} onPress={() => this.close()}>
                    {Message.get(MessageKeys.questionnaire_close_button)}
                </FlatButton>
            );
        }

        if (respondent?.current_question) {
            const { response } = useQuestionnaireStore.getState();
            return (
                <>
                    {respondent.previous_question_id ? (
                        <FlatButton
                            labelStyle={styles.secondaryButton}
                            onPress={() => useQuestionnaireStore.getState().revisitPrevious()}
                        >
                            {Message.get(MessageKeys.questionnaire_previous_button)}
                        </FlatButton>
                    ) : null}
                    <FlatButton
                        labelStyle={styles.primaryButton}
                        disabled={response.length === 0}
                        onPress={() => useQuestionnaireStore.getState().saveResponse().then(() => this.forceUpdate())}
                    >
                        {Message.get(MessageKeys.questionnaire_next_button)}
                    </FlatButton>
                </>
            );
        }

        if (questionnaire && !respondent?.id) {
            return (
                <>
                    <FlatButton labelStyle={styles.secondaryButton} onPress={() => this.close()}>
                        {Message.get(MessageKeys.cancel)}
                    </FlatButton>
                    <FlatButton
                        labelStyle={styles.primaryButton}
                        onPress={() => {
                            if (this.state.settings?.questionnaireId) {
                                useQuestionnaireStore.getState().startQuestionnaire(
                                    this.state.settings.questionnaireId,
                                    this.state.settings.onComplete,
                                );
                            }
                        }}
                    >
                        {Message.get(MessageKeys.questionnaire_begin_button)}
                    </FlatButton>
                </>
            );
        }

        return (
            <FlatButton labelStyle={styles.primaryButton} onPress={() => this.close()}>
                {Message.get(MessageKeys.questionnaire_close_button)}
            </FlatButton>
        );
    }
}
//#endregion

//#region Styles
const styles = StyleSheet.create({
    dialog: {
        alignSelf: "center",
        backgroundColor: Colors.navy_darker,
        maxWidth: Dimens.inner_screen_max_width,
        width: "90%",
    },
    title: { color: Colors.cyan, fontFamily: Fonts.primarySemiBold },
    scrollArea: { maxHeight: 400 },
    centered: { alignItems: "center", padding: 16, gap: 8 },
    section: { padding: 8 },
    subtitle: { color: Colors.first_accent_color, marginBottom: 8 },
    questionText: { fontSize: 16, marginBottom: 12 },
    choiceRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    sectionTitle: { color: Colors.cyan, marginBottom: 8 },
    primaryButton: { color: Colors.cyan },
    secondaryButton: { color: Colors.white },
    errorText: { color: "#ff4310" },
});
//#endregion
