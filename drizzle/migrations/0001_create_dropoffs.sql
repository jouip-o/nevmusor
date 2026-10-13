CREATE TABLE public.dropoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  count integer NOT NULL CHECK (count > 0 AND count <= 10000),
  dropped_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.dropoffs TO authenticated;
GRANT ALL ON public.dropoffs TO service_role;
ALTER TABLE public.dropoffs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own drop read" ON public.dropoffs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own drop insert" ON public.dropoffs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own drop delete" ON public.dropoffs FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX dropoffs_user_idx ON public.dropoffs (user_id, dropped_on);