CREATE TEMP TABLE tmp_mojibake_audit (
  table_name text,
  column_name text,
  suspicious_count bigint
);

DO $$
DECLARE
  r RECORD;
  cnt bigint;
  cond text := 'POSITION(CHR(195) IN __TXT__) > 0 OR POSITION(CHR(194) IN __TXT__) > 0 OR POSITION(CHR(226) IN __TXT__) > 0 OR POSITION(CHR(65533) IN __TXT__) > 0 OR POSITION(CHR(9500) IN __TXT__) > 0 OR POSITION(CHR(9571) IN __TXT__) > 0 OR POSITION(CHR(9474) IN __TXT__) > 0 OR POSITION(CHR(174) IN __TXT__) > 0 OR POSITION(CHR(9553) IN __TXT__) > 0 OR POSITION(CHR(9516) IN __TXT__) > 0 OR POSITION(CHR(9618) IN __TXT__) > 0';
  q text;
BEGIN
  FOR r IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (data_type IN ('text','character varying','character') OR udt_name='citext')
  LOOP
    q := format('SELECT COUNT(*) FROM public.%I WHERE %s', r.table_name, replace(cond, '__TXT__', format('CAST(%I AS text)', r.column_name)));
    EXECUTE q INTO cnt;
    INSERT INTO tmp_mojibake_audit(table_name, column_name, suspicious_count)
    VALUES (r.table_name, r.column_name, cnt);
  END LOOP;
END;
$$;

SELECT
  (SELECT COUNT(*) FROM tmp_mojibake_audit) AS total_text_columns,
  (SELECT COUNT(*) FROM tmp_mojibake_audit WHERE suspicious_count > 0) AS affected_columns,
  (SELECT COUNT(DISTINCT table_name) FROM tmp_mojibake_audit WHERE suspicious_count > 0) AS affected_tables,
  (SELECT COALESCE(SUM(suspicious_count),0) FROM tmp_mojibake_audit WHERE suspicious_count > 0) AS total_suspicious_rows;

SELECT table_name, column_name, suspicious_count
FROM tmp_mojibake_audit
WHERE suspicious_count > 0
ORDER BY suspicious_count DESC, table_name, column_name
LIMIT 50;