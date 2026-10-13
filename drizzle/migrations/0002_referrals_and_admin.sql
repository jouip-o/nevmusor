ALTER TABLE public.profiles ADD COLUMN referral_code text UNIQUE DEFAULT substr(md5(gen_random_uuid()::text), 1, 8);
ALTER TABLE public.profiles ADD COLUMN referred_by uuid;

CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.grant_admin_for_owner_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND lower(NEW.email) = 'chertkovakate@mail.ru' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_grant_admin AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_admin_for_owner_email();
CREATE TRIGGER on_auth_user_confirmed_grant_admin AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.grant_admin_for_owner_email();
INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin' FROM auth.users WHERE lower(email) = 'chertkovakate@mail.ru' AND email_confirmed_at IS NOT NULL
  ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.claim_referral(_code text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE ref_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  SELECT id INTO ref_id FROM public.profiles WHERE referral_code = _code;
  IF ref_id IS NULL OR ref_id = auth.uid() THEN RETURN false; END IF;
  UPDATE public.profiles SET referred_by = ref_id
    WHERE id = auth.uid() AND referred_by IS NULL
      AND created_at > now() - interval '1 day';
  RETURN FOUND;
END $$;
REVOKE EXECUTE ON FUNCTION public.claim_referral(text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.claim_referral(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_referral_stats()
RETURNS TABLE (user_id uuid, email text, display_name text, referral_code text, referred_count bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  RETURN QUERY
    SELECT p.id, u.email::text, p.display_name, p.referral_code,
           (SELECT count(*) FROM public.profiles r WHERE r.referred_by = p.id)
    FROM public.profiles p JOIN auth.users u ON u.id = p.id
    ORDER BY 5 DESC, u.email;
END $$;
REVOKE EXECUTE ON FUNCTION public.admin_referral_stats() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.admin_referral_stats() TO authenticated;