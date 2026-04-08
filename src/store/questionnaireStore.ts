import { create } from "zustand";
import type { Questionnaire, QuestionnaireRespondent, QuestionResponse } from "../types";
import QuestionnaireService from "../services/QuestionnaireService";

type QuestionnaireStore = {
    questionnaire?: Questionnaire;
    respondent?: QuestionnaireRespondent;
    response: QuestionResponse[];
    loading: boolean;
    error?: string;
    onCompleteCallback?: () => void;

    loadQuestionnaire: (questionnaireId: string) => Promise<void>;
    startQuestionnaire: (questionnaireId: string, onComplete?: () => void) => Promise<QuestionnaireRespondent>;
    resumeQuestionnaire: (respondentId: string, onComplete?: () => void) => Promise<QuestionnaireRespondent>;
    stopQuestionnaire: () => void;
    setResponse: (response: QuestionResponse[]) => void;
    saveResponse: () => Promise<void>;
    revisitPrevious: () => Promise<void>;
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
            const questionnaire = get().questionnaire?.id === questionnaireId
                ? get().questionnaire!
                : await QuestionnaireService.getById(questionnaireId);
            const respondent = await QuestionnaireService.startQuestionnaire(questionnaireId);
            const response = respondent.current_question ? [] : [];
            set({ questionnaire, respondent, response, loading: false, onCompleteCallback: onComplete });
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
            set({ questionnaire, respondent, loading: false, onCompleteCallback: onComplete });
            return respondent;
        } catch (e: any) {
            set({ loading: false, error: e?.message ?? "Failed to resume questionnaire" });
            throw e;
        }
    },

    stopQuestionnaire: () => {
        set({ questionnaire: undefined, respondent: undefined, response: [], onCompleteCallback: undefined });
    },

    setResponse: (response: QuestionResponse[]) => {
        set({ response });
    },

    saveResponse: async () => {
        const { respondent, response, onCompleteCallback } = get();
        if (!respondent) return;
        const updated = await QuestionnaireService.saveUserResponse(respondent.id, response);
        set({ respondent: updated });
        if (updated.completed_at && onCompleteCallback) {
            onCompleteCallback();
        }
    },

    revisitPrevious: async () => {
        const { respondent } = get();
        if (!respondent?.previous_question_id) return;
        const updated = await QuestionnaireService.revisitQuestion(
            respondent.id,
            respondent.previous_question_id,
        );
        set({ respondent: updated });
    },
}));
