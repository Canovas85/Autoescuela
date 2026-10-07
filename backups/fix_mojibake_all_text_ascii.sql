CREATE OR REPLACE FUNCTION public.fix_mojibake_text(input_text text)
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

  s := REPLACE(s, CHR(9500) || CHR(226) || CHR(9516) || CHR(237), U&'\00E1');
  s := REPLACE(s, CHR(9500) || CHR(226) || CHR(9516) || CHR(174), U&'\00E9');
  s := REPLACE(s, CHR(9500) || CHR(226) || CHR(9516) || CHR(161), U&'\00ED');
  s := REPLACE(s, CHR(9500) || CHR(226) || CHR(9516) || CHR(9474), U&'\00F3');
  s := REPLACE(s, CHR(9500) || CHR(226) || CHR(9516) || CHR(9553), U&'\00FA');
  s := REPLACE(s, CHR(9500) || CHR(226) || CHR(9516) || CHR(9618), U&'\00F1');

  s := REPLACE(s, CHR(9500) || CHR(237), U&'\00E1');
  s := REPLACE(s, CHR(9500) || CHR(174), U&'\00E9');
  s := REPLACE(s, CHR(9500) || CHR(161), U&'\00ED');
  s := REPLACE(s, CHR(9500) || CHR(9474), U&'\00F3');
  s := REPLACE(s, CHR(9500) || CHR(9553), U&'\00FA');
  s := REPLACE(s, CHR(9500) || CHR(9618), U&'\00F1');

  s := REPLACE(s, CHR(9500) || CHR(233) || CHR(9516) || CHR(9488), U&'\00BF');

  s := REPLACE(s, CHR(9516) || U&'\00E1', U&'\00E1');
  s := REPLACE(s, CHR(9516) || U&'\00E9', U&'\00E9');
  s := REPLACE(s, CHR(9516) || U&'\00ED', U&'\00ED');
  s := REPLACE(s, CHR(9516) || U&'\00F3', U&'\00F3');
  s := REPLACE(s, CHR(9516) || U&'\00FA', U&'\00FA');
  s := REPLACE(s, CHR(9516) || U&'\00F1', U&'\00F1');
  s := REPLACE(s, CHR(9516) || U&'\00C1', U&'\00C1');
  s := REPLACE(s, CHR(9516) || U&'\00C9', U&'\00C9');
  s := REPLACE(s, CHR(9516) || U&'\00CD', U&'\00CD');
  s := REPLACE(s, CHR(9516) || U&'\00D3', U&'\00D3');
  s := REPLACE(s, CHR(9516) || U&'\00DA', U&'\00DA');
  s := REPLACE(s, CHR(9516) || U&'\00D1', U&'\00D1');

  RETURN s;
END;
$$;

DO $$
DECLARE
  r RECORD;
  updated_count bigint;
BEGIN
  FOR r IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (
        data_type IN ('text', 'character varying', 'character')
        OR udt_name = 'citext'
      )
    ORDER BY table_name, ordinal_position
  LOOP
    EXECUTE format(
      'UPDATE public.%I SET %I = public.fix_mojibake_text(%I) WHERE %I IS NOT NULL AND %I <> public.fix_mojibake_text(%I);',
      r.table_name, r.column_name, r.column_name, r.column_name, r.column_name, r.column_name
    );

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    IF updated_count > 0 THEN
      RAISE NOTICE 'UPDATED %.% -> % rows', r.table_name, r.column_name, updated_count;
    END IF;
  END LOOP;
END;
$$;