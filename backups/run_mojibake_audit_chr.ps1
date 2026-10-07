$ErrorActionPreference = "Continue"
$env:PGPASSWORD = "postgres"
$reportPath = Join-Path (Get-Location) "backups\mojibake_audit_full_20261007.txt"
$colsRaw = & psql -h localhost -p 5433 -U postgres -d autodrive_db -X -A -t -F '|' -c "SELECT table_name, column_name FROM information_schema.columns WHERE table_schema='public' AND (data_type IN ('text','character varying','character') OR udt_name='citext') ORDER BY table_name, ordinal_position;"
$totalCols = 0
$affectedCols = 0
$affectedTables = New-Object 'System.Collections.Generic.HashSet[string]'
$totalRows = 0
$errors = 0
$cond = "POSITION(CHR(195) IN __TXT__) > 0 OR POSITION(CHR(194) IN __TXT__) > 0 OR POSITION(CHR(226) IN __TXT__) > 0 OR POSITION(CHR(65533) IN __TXT__) > 0 OR POSITION(CHR(9500) IN __TXT__) > 0 OR POSITION(CHR(9571) IN __TXT__) > 0 OR POSITION(CHR(9474) IN __TXT__) > 0 OR POSITION(CHR(174) IN __TXT__) > 0 OR POSITION(CHR(9553) IN __TXT__) > 0"
$lines = New-Object System.Collections.Generic.List[string]
foreach ($line in $colsRaw) {
  if ([string]::IsNullOrWhiteSpace($line)) { continue }
  $parts = $line.Split('|')
  if ($parts.Length -lt 2) { continue }
  $table = $parts[0].Trim()
  $column = $parts[1].Trim()
  $totalCols++
  $txtExpr = "CAST(""$column"" AS text)"
  $whereExpr = $cond.Replace('__TXT__', $txtExpr)
  $q1 = "SELECT COUNT(*) FROM public.""$table"" WHERE $whereExpr;"
  $o1 = & psql -h localhost -p 5433 -U postgres -d autodrive_db -X -A -t -c $q1 2>&1
  if ($LASTEXITCODE -ne 0) {
    $errors++
    $lines.Add(("ERROR|{0}|{1}|{2}" -f $table, $column, (($o1 -join ' ') -replace '\s+',' ').Trim()))
    continue
  }
  $count = [int](($o1 | Select-Object -First 1).Trim())
  $lines.Add(("SCAN|{0}|{1}|{2}" -f $table, $column, $count))
  if ($count -gt 0) {
    $affectedCols++
    [void]$affectedTables.Add($table)
    $totalRows += $count
    $pkQ = "SELECT kcu.column_name FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema AND tc.table_name = kcu.table_name WHERE tc.table_schema='public' AND tc.table_name='$table' AND tc.constraint_type='PRIMARY KEY' ORDER BY kcu.ordinal_position LIMIT 1;"
    $pkOut = & psql -h localhost -p 5433 -U postgres -d autodrive_db -X -A -t -c $pkQ
    $pk = ($pkOut | Select-Object -First 1).Trim()
    if ([string]::IsNullOrWhiteSpace($pk)) { $pk = 'ctid' }
    if ($pk -eq 'ctid') {
      $sampleQ = "SELECT ctid::text, LEFT($txtExpr, 180) FROM public.""$table"" WHERE $whereExpr LIMIT 5;"
    } else {
      $sampleQ = "SELECT CAST(""$pk"" AS text), LEFT($txtExpr, 180) FROM public.""$table"" WHERE $whereExpr LIMIT 5;"
    }
    $samples = & psql -h localhost -p 5433 -U postgres -d autodrive_db -X -A -t -F '|' -c $sampleQ
    foreach ($s in $samples) {
      if ([string]::IsNullOrWhiteSpace($s)) { continue }
      $sp = $s.Split('|',2)
      $idVal = if ($sp.Length -ge 1) { $sp[0] } else { '' }
      $txt = if ($sp.Length -ge 2) { $sp[1] } else { '' }
      $lines.Add(("SAMPLE|{0}|{1}|{2}|{3}" -f $table, $column, $idVal, $txt))
    }
  }
}
$summary = "SUMMARY|total_text_columns=$totalCols|affected_columns=$affectedCols|affected_tables=$($affectedTables.Count)|total_suspicious_rows=$totalRows|errors=$errors"
$lines.Add($summary)
$lines | Set-Content -Path $reportPath -Encoding UTF8
Write-Output ("REPORT=" + $reportPath)
Write-Output $summary
