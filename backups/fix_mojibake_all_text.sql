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

  -- Patrones vistos en datos del proyecto (simple y doble mojibake)
  s := REPLACE(s, '├â┬í', 'á');
  s := REPLACE(s, '├â┬®', 'é');
  s := REPLACE(s, '├â┬¡', 'í');
  s := REPLACE(s, '├â┬│', 'ó');
  s := REPLACE(s, '├â┬║', 'ú');
  s := REPLACE(s, '├â┬▒', 'ñ');

  s := REPLACE(s, '├í', 'á');
  s := REPLACE(s, '├®', 'é');
  s := REPLACE(s, '├¡', 'í');
  s := REPLACE(s, '├│', 'ó');
  s := REPLACE(s, '├║', 'ú');
  s := REPLACE(s, '├▒', 'ñ');

  s := REPLACE(s, '├é┬┐', '¿');
  s := REPLACE(s, '┬á', 'á');
  s := REPLACE(s, '┬é', 'é');
  s := REPLACE(s, '┬í', 'í');
  s := REPLACE(s, '┬ó', 'ó');
  s := REPLACE(s, '┬ú', 'ú');
  s := REPLACE(s, '┬ñ', 'ñ');
  s := REPLACE(s, '┬Á', 'Á');
  s := REPLACE(s, '┬É', 'É');
  s := REPLACE(s, '┬Í', 'Í');
  s := REPLACE(s, '┬Ó', 'Ó');
  s := REPLACE(s, '┬Ú', 'Ú');
  s := REPLACE(s, '┬Ñ', 'Ñ');

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
