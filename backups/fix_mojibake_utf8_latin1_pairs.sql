CREATE OR REPLACE FUNCTION public.fix_mojibake_pairs(input_text text)
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

  s := REPLACE(s, CHR(195) || CHR(161), U&'\00E1');
  s := REPLACE(s, CHR(195) || CHR(169), U&'\00E9');
  s := REPLACE(s, CHR(195) || CHR(173), U&'\00ED');
  s := REPLACE(s, CHR(195) || CHR(179), U&'\00F3');
  s := REPLACE(s, CHR(195) || CHR(186), U&'\00FA');
  s := REPLACE(s, CHR(195) || CHR(177), U&'\00F1');

  s := REPLACE(s, CHR(195) || CHR(129), U&'\00C1');
  s := REPLACE(s, CHR(195) || CHR(137), U&'\00C9');
  s := REPLACE(s, CHR(195) || CHR(141), U&'\00CD');
  s := REPLACE(s, CHR(195) || CHR(147), U&'\00D3');
  s := REPLACE(s, CHR(195) || CHR(154), U&'\00DA');
  s := REPLACE(s, CHR(195) || CHR(145), U&'\00D1');

  s := REPLACE(s, CHR(194) || CHR(191), U&'\00BF');
  s := REPLACE(s, CHR(194) || CHR(161), U&'\00A1');

  s := REPLACE(s, CHR(226) || CHR(128) || CHR(153), U&'\2019');
  s := REPLACE(s, CHR(226) || CHR(128) || CHR(152), U&'\2018');
  s := REPLACE(s, CHR(226) || CHR(128) || CHR(156), U&'\201C');
  s := REPLACE(s, CHR(226) || CHR(128) || CHR(157), U&'\201D');
  s := REPLACE(s, CHR(226) || CHR(128) || CHR(147), U&'\2013');
  s := REPLACE(s, CHR(226) || CHR(128) || CHR(148), U&'\2014');

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
      'UPDATE public.%I SET %I = public.fix_mojibake_pairs(%I) WHERE %I IS NOT NULL AND %I <> public.fix_mojibake_pairs(%I);',
      r.table_name, r.column_name, r.column_name, r.column_name, r.column_name, r.column_name
    );
  END LOOP;
END;
$$;