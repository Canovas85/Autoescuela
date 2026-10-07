DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema='public'
      AND (data_type IN ('text','character varying','character') OR udt_name='citext')
  LOOP
    EXECUTE format(
      'UPDATE public.%I SET %I = REPLACE(REPLACE(%I, CHR(195)||CHR(353), U&''\00DA''), CHR(226)||CHR(8364)||CHR(166), U&''\2026'') WHERE %I IS NOT NULL;',
      r.table_name, r.column_name, r.column_name, r.column_name
    );
  END LOOP;
END;
$$;