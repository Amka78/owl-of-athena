import { supabase } from "../clients/supabase";
import type { Questionnaire, QuestionnaireRespondent, QuestionResponse } from "../types";

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

    async startQuestionnaire(questionnaireId: string): Promise<QuestionnaireRespondent> {
        const { data, error } = await supabase
            .from("questionnaire_respondents")
            .insert({ questionnaire_id: questionnaireId })
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
    ): Promise<QuestionnaireRespondent> {
        const { data, error } = await supabase
            .from("questionnaire_respondents")
            .update({ response })
            .eq("id", respondentId)
            .select()
            .single();

        if (error) throw error;
        return data as QuestionnaireRespondent;
    }

    async revisitQuestion(
        respondentId: string,
        questionId: string,
    ): Promise<QuestionnaireRespondent> {
        const { data, error } = await supabase
            .from("questionnaire_respondents")
            .select("*")
            .eq("id", respondentId)
            .single();

        if (error) throw error;
        return data as QuestionnaireRespondent;
    }
}

export default new QuestionnaireService();
