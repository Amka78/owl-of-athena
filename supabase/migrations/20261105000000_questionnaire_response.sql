-- 質問票の回答を蓄積する。クライアントが現在の質問と回答を更新する。
ALTER TABLE public.questionnaire_respondents
    ADD COLUMN IF NOT EXISTS response JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.questionnaire_respondents.response IS 'Accumulated answers for the questionnaire';