import { create } from "zustand";
import QuestionnaireService from "../services/QuestionnaireService";
import type { Questionnaire, QuestionnaireRespondent, QuestionResponse } from "../types";

type QuestionnaireStore = {
    questionnaire?: Questionnaire;
    respondent?: QuestionnaireRespondent;
    response: QuestionResponse[];
    loading: boolean;
    error?: string;
    onCompleteCallback?: () => void;

    loadQuestionnaire: (questionnaireId: string) => Promise<void>;
    startQuestionnaire: (
        questionnaireId: string,
        onComplete?: () => void,
    ) => Promise<QuestionnaireRespondent>;
    resumeQuestionnaire: (
        respondentId: string,
        onComplete?: () => void,
    ) => Promise<QuestionnaireRespondent>;
    stopQuestionnaire: () => void;
    setResponse: (response: QuestionResponse[]) => void;
    saveResponse: () => Promise<void>;
    revisitPrevious: () => Promise<void>;
};

const mergeResponses = (
    existing: QuestionResponse[],
    current: QuestionResponse[],
    questionId?: string,
): QuestionResponse[] => {
    if (!questionId) return current;
    return [...existing.filter((response) => response.question_id !== questionId), ...current];
};

export const useQuestionnaireStore = create<QuestionnaireStore>()((set, get) => ({
    questionnaire: undefined,
    respondent: undefined,
    response: [],
    loading: false,
    error: undefined,
    onCompleteCallback: undefined,

    loadQuestionnaire: async (questionnaireId: string) => {
        set({ loading: true, error: undefined });
        try {
            const questionnaire = await QuestionnaireService.getById(questionnaireId);
            set({ questionnaire, loading: false });
        } catch (e: any) {
            set({ loading: false, error: e?.message ?? "Failed to load questionnaire" });
        }
    },

    startQuestionnaire: async (questionnaireId: string, onComplete?: () => void) => {
        set({ loading: true, error: undefined });
        try {
            const questionnaire =
                get().questionnaire?.id === questionnaireId
                    ? get().questionnaire!
                    : await QuestionnaireService.getById(questionnaireId);
            const respondent = await QuestionnaireService.startQuestionnaire(
                questionnaireId,
                questionnaire.questions ?? [],
            );
            set({
                questionnaire,
                respondent,
                response: [],
                loading: false,
                onCompleteCallback: onComplete,
            });
            return respondent;
        } catch (e: any) {
            set({ loading: false, error: e?.message ?? "Failed to start questionnaire" });
            throw e;
        }
    },

    resumeQuestionnaire: async (respondentId: string, onComplete?: () => void) => {
        set({ loading: true, error: undefined });
        try {
            const respondent = await QuestionnaireService.resumeQuestionnaire(respondentId);
            const questionnaire = await QuestionnaireService.getById(respondent.questionnaire_id);
            const questions = questionnaire.questions ?? [];
            const index = respondent.current_question_index ?? 0;
            const resumed: QuestionnaireRespondent =
                !respondent.current_question && !respondent.completed_at
                    ? { ...respondent, current_question: questions[index] }
                    : respondent;
            set({
                questionnaire,
                respondent: resumed,
                response: [],
                loading: false,
                onCompleteCallback: onComplete,
            });
            return resumed;
        } catch (e: any) {
            set({ loading: false, error: e?.message ?? "Failed to resume questionnaire" });
            throw e;
        }
    },

    stopQuestionnaire: () => {
        set({
            questionnaire: undefined,
            respondent: undefined,
            response: [],
            onCompleteCallback: undefined,
        });
    },

    setResponse: (response: QuestionResponse[]) => {
        set({ response });
    },

    saveResponse: async () => {
        const { respondent, response, questionnaire, onCompleteCallback } = get();
        if (!respondent || !questionnaire) return;

        const questions = questionnaire.questions ?? [];
        const index = respondent.current_question_index ?? 0;
        const merged = mergeResponses(
            respondent.response ?? [],
            response,
            respondent.current_question?.id,
        );
        const nextIndex = index + 1;
        const nextQuestion = questions[nextIndex];
        const completed = !nextQuestion;

        const updated = await QuestionnaireService.saveUserResponse(
            respondent.id,
            merged,
            nextIndex,
            nextQuestion,
            completed,
        );
        set({ respondent: updated, response: [] });
        if (completed && onCompleteCallback) onCompleteCallback();
    },

    revisitPrevious: async () => {
        const { respondent, questionnaire } = get();
        if (!respondent || !questionnaire) return;

        const index = (respondent.current_question_index ?? 0) - 1;
        if (index < 0) return;

        const question = questionnaire.questions?.[index];
        const updated = await QuestionnaireService.revisitQuestion(respondent.id, index, question);
        set({ respondent: updated, response: [] });
    },
}));
