import { supabase } from "../clients/supabase";
import type { Question, Questionnaire, QuestionnaireRespondent, QuestionResponse } from "../types";

type RespondentPatch = {
    response?: QuestionResponse[];
    current_question_index?: number;
    current_question?: Question | null;
    completed_at?: string | null;
};

class QuestionnaireService {
    async getById(id: string): Promise<Questionnaire> {
        const { data, error } = await supabase
            .from("questionnaires")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data as Questionnaire;
    }

    async getBySlug(slug: string): Promise<Questionnaire> {
        const { data, error } = await supabase
            .from("questionnaires")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error) throw error;
        return data as Questionnaire;
    }

    async startQuestionnaire(
        questionnaireId: string,
        questions: Question[] = [],
    ): Promise<QuestionnaireRespondent> {
        const { data, error } = await supabase
            .from("questionnaire_respondents")
            .insert({
                questionnaire_id: questionnaireId,
                current_question_index: 0,
                current_question: questions[0] ?? null,
                response: [],
            })
            .select()
            .single();

        if (error) throw error;
        return data as QuestionnaireRespondent;
    }

    async resumeQuestionnaire(respondentId: string): Promise<QuestionnaireRespondent> {
        const { data, error } = await supabase
            .from("questionnaire_respondents")
            .select("*")
            .eq("id", respondentId)
            .single();

        if (error) throw error;
        const respondent = data as QuestionnaireRespondent;
        if (respondent.completed_at) {
            throw new Error("This questionnaire has already been completed.");
        }
        return respondent;
    }

    async saveUserResponse(
        respondentId: string,
        response: QuestionResponse[],
        nextIndex: number,
        nextQuestion?: Question,
        completed = false,
    ): Promise<QuestionnaireRespondent> {
        return this.updateRespondent(respondentId, {
            response,
            current_question_index: nextIndex,
            current_question: nextQuestion ?? null,
            completed_at: completed ? new Date().toISOString() : null,
        });
    }

    async revisitQuestion(
        respondentId: string,
        index: number,
        question?: Question,
    ): Promise<QuestionnaireRespondent> {
        return this.updateRespondent(respondentId, {
            current_question_index: index,
            current_question: question ?? null,
            completed_at: null,
        });
    }

    private async updateRespondent(
        respondentId: string,
        patch: RespondentPatch,
    ): Promise<QuestionnaireRespondent> {
        const { data, error } = await supabase
            .from("questionnaire_respondents")
            .update(patch)
            .eq("id", respondentId)
            .select()
            .single();

        if (error) throw error;
        return data as QuestionnaireRespondent;
    }
}

export default new QuestionnaireService();
