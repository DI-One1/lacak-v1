$allowedExtensions = @('.ts', '.tsx', '.js', '.jsx', '.css', '.prisma', '.json')
$allowedRootFiles = @('next.config.ts', 'tailwind.config.ts', 'tsconfig.json', 'package.json', 'proxy.ts', 'README.md')

$excludeDirs = @('node_modules', '.next', '.git', '.gemini', '.agents', '.vercel', '.vscode', 'dist', 'build', 'brain', 'scratch', '.system_generated', 'generated')
$excludeFiles = @('pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'semua_kode.txt', 'semua_kode_lacak.txt', 'struktur.txt', 'export_code.ps1', 'audit_report.md', 'analysis_results.md', 'favicon.ico')

$outputFile = "semua_kode_lacak.txt"

# Clear file
"" | Out-File -FilePath $outputFile -Encoding utf8

$filesToExport = Get-ChildItem -Recurse -File | Where-Object {
    $full = $_.FullName.ToLower()
    $ext = $_.Extension.ToLower()
    $name = $_.Name.ToLower()

    foreach ($dir in $excludeDirs) {
        $d = $dir.ToLower()
        if ($full.Contains("\$d\") -or $full.Contains("/$d/")) {
            return $false
        }
    }

    if ($excludeFiles -contains $name) {
        return $false
    }

    if ($allowedExtensions -contains $ext -or $allowedRootFiles -contains $name) {
        return $true
    }

    return $false
}

Write-Host "Meng-export $($filesToExport.Count) file..."

$filesToExport | ForEach-Object {
    $relPath = $_.FullName.Replace((Get-Location).Path, '')
    "========================================="
    "FILE: $relPath"
    "========================================="
    ""
    Get-Content -LiteralPath $_.FullName -Raw -Encoding utf8
    ""
    ""
} | Out-File -FilePath $outputFile -Encoding utf8 -Append

$size = (Get-Item $outputFile).Length
Write-Host "Berhasil! Total: $($filesToExport.Count) file kode murni ($([math]::Round($size / 1KB, 2)) KB) tersimpan di $outputFile"
