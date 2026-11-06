-- 不具合報告にスクリーンショットやファイルを添付できるようにする。
CREATE TABLE IF NOT EXISTS public.issue_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    content_type TEXT,
    size_bytes BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS issue_attachments_issue_id_idx
    ON public.issue_attachments (issue_id);

ALTER TABLE public.issue_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can create issue attachments"
    ON public.issue_attachments;
CREATE POLICY "Authenticated users can create issue attachments"
    ON public.issue_attachments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.issues i
            WHERE i.id = issue_id AND i.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Owners and admins can read issue attachments"
    ON public.issue_attachments;
CREATE POLICY "Owners and admins can read issue attachments"
    ON public.issue_attachments
    FOR SELECT
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1
            FROM public.issues i
            WHERE i.id = issue_id AND i.user_id = auth.uid()
        )
    );

-- 添付ファイルは非公開バケットに置き、アップロードした本人と管理者だけが読める。
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-attachments', 'issue-attachments', FALSE)
ON CONFLICT (id) DO UPDATE SET public = FALSE;

DROP POLICY IF EXISTS "Issue attachment uploads" ON storage.objects;
CREATE POLICY "Issue attachment uploads"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'issue-attachments'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Issue attachment reads" ON storage.objects;
CREATE POLICY "Issue attachment reads"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'issue-attachments'
        AND (
            public.is_admin()
            OR (storage.foldername(name))[1] = auth.uid()::text
        )
    );