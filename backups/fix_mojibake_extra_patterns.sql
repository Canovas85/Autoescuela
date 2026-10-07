CREATE OR REPLACE FUNCTION public.fix_mojibake_extra(input_text text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  s text;
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;

  s := input_text;

  s := REPLACE(s, CHR(9500) || CHR(220), U&'\00DA');
  s := REPLACE(s, CHR(177), U&'\00F1');
  s := REPLACE(s, CHR(209), U&'\00D1');
  s := REPLACE(s, CHR(221), U&'\00ED');
  s := REPLACE(s, CHR(223), U&'\00E1');
  s := REPLACE(s, CHR(190), U&'\00F3');
  s := REPLACE(s, CHR(212) || CHR(199) || CHR(170), U&'\2026');

  RETURN s;
END;
$$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (data_type IN ('text','character varying','character') OR udt_name='citext')
  LOOP
    EXECUTE format(
      'UPDATE public.%I SET %I = public.fix_mojibake_extra(%I) WHERE %I IS NOT NULL AND %I <> public.fix_mojibake_extra(%I);',
      r.table_name, r.column_name, r.column_name, r.column_name, r.column_name, r.column_name
    );
  END LOOP;
END;
$$;