# Security Audit Script for INSY7314 Project (PowerShell)
# This script runs comprehensive security checks on the codebase

Write-Host "Starting security audit for INSY7314 project..." -ForegroundColor Green

# Create reports directory
New-Item -ItemType Directory -Path "security-reports" -Force | Out-Null

# 1. NPM Audit for Backend
Write-Host "Running npm audit for backend..." -ForegroundColor Yellow
Set-Location backend
try {
    npm audit --json | Out-File "../security-reports/backend-npm-audit.json" -Encoding UTF8
    npm audit --audit-level=moderate
} catch {
    Write-Host "NPM audit completed with warnings" -ForegroundColor Yellow
}
Set-Location ..

# 2. NPM Audit for Frontend  
Write-Host "Running npm audit for frontend..." -ForegroundColor Yellow
Set-Location frontend
try {
    npm audit --json | Out-File "../security-reports/frontend-npm-audit.json" -Encoding UTF8
    npm audit --audit-level=moderate
} catch {
    Write-Host "NPM audit completed with warnings" -ForegroundColor Yellow
}
Set-Location ..

# 3. Snyk Security Testing (if available)
Write-Host "Running Snyk security tests..." -ForegroundColor Yellow
if (Get-Command snyk -ErrorAction SilentlyContinue) {
    try {
        snyk test --json | Out-File "security-reports/snyk-backend.json" -Encoding UTF8
        Set-Location frontend
        snyk test --json | Out-File "../security-reports/snyk-frontend.json" -Encoding UTF8
        Set-Location ..
    } catch {
        Write-Host "Snyk completed with warnings" -ForegroundColor Yellow
    }
} else {
    Write-Host "Snyk CLI not found. Install with: npm install -g snyk" -ForegroundColor Red
}

# 4. ESLint Security Rules
Write-Host "Running ESLint security checks..." -ForegroundColor Yellow
Set-Location backend
try {
    npx eslint . --ext .js --format json | Out-File "../security-reports/backend-eslint-security.json" -Encoding UTF8
} catch {
    Write-Host "ESLint completed with warnings" -ForegroundColor Yellow
}
Set-Location ../frontend
try {
    npx eslint src/ --ext .js,.jsx --format json | Out-File "../security-reports/frontend-eslint-security.json" -Encoding UTF8
} catch {
    Write-Host "ESLint completed with warnings" -ForegroundColor Yellow
}
Set-Location ..

# 5. Check for sensitive files/patterns
Write-Host "Checking for sensitive information..." -ForegroundColor Yellow
$sensitiveCheck = @"
=== Checking for potential secrets ===
$(Select-String -Path "*.js","*.jsx","*.json" -Pattern "password|secret|key|token" -Recurse | Where-Object { $_.Path -notmatch "node_modules|coverage|\.git" })

=== Checking for hardcoded credentials ===
$(Select-String -Path "*.js","*.jsx" -Pattern "api_key|apikey|password|secret" -Recurse | Where-Object { $_.Path -notmatch "node_modules|coverage|\.git" })

=== Checking for TODO security items ===
$(Select-String -Path "*.js","*.jsx" -Pattern "TODO.*security|FIXME.*security|XXX.*security" -Recurse | Where-Object { $_.Path -notmatch "node_modules" })
"@
$sensitiveCheck | Out-File "security-reports/sensitive-data-check.txt" -Encoding UTF8

# 6. Check SSL/TLS configuration
Write-Host "Checking SSL/TLS configuration..." -ForegroundColor Yellow
$sslCheck = @"
=== SSL Certificate files ===
$(Get-ChildItem -Recurse -Include "*.pem","*.crt","*.key" | Where-Object { $_.FullName -notmatch "node_modules" })

=== HTTPS configuration check ===
$(Select-String -Path "backend/*.js" -Pattern "https|ssl|tls" -Recurse | Select-Object -First 10)
"@
$sslCheck | Out-File "security-reports/ssl-tls-check.txt" -Encoding UTF8

# 7. Dependency vulnerability check
Write-Host "Running dependency vulnerability check..." -ForegroundColor Yellow
$depCheck = @"
=== High-risk dependencies ===
Backend dependencies:
$(Set-Location backend; npm ls --depth=0 2>&1 | Select-String "WARN|ERROR")
$(Set-Location ..)

Frontend dependencies:
$(Set-Location frontend; npm ls --depth=0 2>&1 | Select-String "WARN|ERROR")
$(Set-Location ..)
"@
$depCheck | Out-File "security-reports/dependency-check.txt" -Encoding UTF8

# 8. Check for common security misconfigurations
Write-Host "Checking for security misconfigurations..." -ForegroundColor Yellow
$configCheck = @"
=== CORS configuration ===
$(Select-String -Path "backend/*.js" -Pattern "cors|origin" -Recurse | Where-Object { $_.Path -notmatch "node_modules" })

=== Authentication middleware ===
$(Select-String -Path "backend/*.js" -Pattern "auth|session|jwt" -Recurse | Where-Object { $_.Path -notmatch "node_modules" } | Select-Object -First 10)

=== Input validation ===
$(Select-String -Path "backend/*.js" -Pattern "validate|sanitize" -Recurse | Where-Object { $_.Path -notmatch "node_modules" } | Select-Object -First 10)
"@
$configCheck | Out-File "security-reports/security-config-check.txt" -Encoding UTF8

# 9. Generate summary report
Write-Host "Generating security summary report..." -ForegroundColor Yellow
$summaryReport = @"
========================================
SECURITY AUDIT SUMMARY REPORT
Project: INSY7314 Part 2 GradiQ
Date: $(Get-Date)
========================================

Files generated:
$(Get-ChildItem security-reports/ | Format-Table -AutoSize | Out-String)

Key findings:
- NPM audit results: See backend-npm-audit.json and frontend-npm-audit.json
- Snyk results: See snyk-backend.json and snyk-frontend.json
- ESLint security: See backend-eslint-security.json and frontend-eslint-security.json
- Sensitive data check: See sensitive-data-check.txt
- SSL/TLS check: See ssl-tls-check.txt
- Dependency check: See dependency-check.txt
- Security config check: See security-config-check.txt

Next steps:
1. Review all generated reports
2. Address high and critical vulnerabilities
3. Update dependencies with known vulnerabilities
4. Implement additional security measures as needed
5. Schedule regular security audits
"@
$summaryReport | Out-File "security-reports/SECURITY-AUDIT-SUMMARY.txt" -Encoding UTF8

Write-Host "Security audit complete! Check the security-reports/ directory for detailed results." -ForegroundColor Green
Write-Host "Summary: security-reports/SECURITY-AUDIT-SUMMARY.txt" -ForegroundColor Green