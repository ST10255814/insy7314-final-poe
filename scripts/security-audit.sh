#!/bin/bash

# Security Audit Script for INSY7314 Project
# This script runs comprehensive security checks on the codebase

echo "Starting security audit for INSY7314 project..."

# Create reports directory
mkdir -p security-reports

# 1. NPM Audit for Backend
echo "Running npm audit for backend..."
cd backend
npm audit --json > ../security-reports/backend-npm-audit.json 2>/dev/null || true
npm audit --audit-level=moderate || true
cd ..

# 2. NPM Audit for Frontend  
echo "Running npm audit for frontend..."
cd frontend
npm audit --json > ../security-reports/frontend-npm-audit.json 2>/dev/null || true
npm audit --audit-level=moderate || true
cd ..

# 3. Snyk Security Testing (if available)
echo "Running Snyk security tests..."
if command -v snyk &> /dev/null; then
    snyk test --json > security-reports/snyk-backend.json 2>/dev/null || true
    cd frontend
    snyk test --json > ../security-reports/snyk-frontend.json 2>/dev/null || true
    cd ..
else
    echo "Snyk CLI not found. Install with: npm install -g snyk"
fi

# 4. ESLint Security Rules
echo "Running ESLint security checks..."
cd backend
npx eslint . --ext .js --format json > ../security-reports/backend-eslint-security.json 2>/dev/null || true
cd ../frontend
npx eslint src/ --ext .js,.jsx --format json > ../security-reports/frontend-eslint-security.json 2>/dev/null || true
cd ..

# 5. Check for sensitive files/patterns
echo "Checking for sensitive information..."
{
    echo "=== Checking for potential secrets ==="
    grep -r -i "password\|secret\|key\|token" --include="*.js" --include="*.jsx" --include="*.json" . | grep -v node_modules | grep -v coverage | grep -v ".git" || true
    echo ""
    echo "=== Checking for hardcoded credentials ==="
    grep -r -E "(api_key|apikey|password|secret)" --include="*.js" --include="*.jsx" . | grep -v node_modules | grep -v coverage | grep -v ".git" || true
    echo ""
    echo "=== Checking for TODO security items ==="
    grep -r -i "TODO.*security\|FIXME.*security\|XXX.*security" --include="*.js" --include="*.jsx" . | grep -v node_modules || true
} > security-reports/sensitive-data-check.txt

# 6. Check SSL/TLS configuration
echo "Checking SSL/TLS configuration..."
{
    echo "=== SSL Certificate files ==="
    find . -name "*.pem" -o -name "*.crt" -o -name "*.key" | grep -v node_modules
    echo ""
    echo "=== HTTPS configuration check ==="
    grep -r "https\|ssl\|tls" --include="*.js" backend/ | head -10 || true
} > security-reports/ssl-tls-check.txt

# 7. Dependency vulnerability check
echo "Running dependency vulnerability check..."
{
    echo "=== High-risk dependencies ==="
    echo "Backend dependencies:"
    cd backend && npm ls --depth=0 | grep -E "(WARN|ERROR)" || echo "No dependency issues found"
    cd ..
    echo ""
    echo "Frontend dependencies:"
    cd frontend && npm ls --depth=0 | grep -E "(WARN|ERROR)" || echo "No dependency issues found"
    cd ..
} > security-reports/dependency-check.txt

# 8. Check for common security misconfigurations
echo "Checking for security misconfigurations..."
{
    echo "=== CORS configuration ==="
    grep -r "cors\|origin" backend/ | grep -v node_modules || true
    echo ""
    echo "=== Authentication middleware ==="
    grep -r "auth\|session\|jwt" backend/ | grep -v node_modules | head -10 || true
    echo ""
    echo "=== Input validation ==="
    grep -r "validate\|sanitize" backend/ | grep -v node_modules | head -10 || true
} > security-reports/security-config-check.txt

# 9. Generate summary report
echo "Generating security summary report..."
{
    echo "========================================"
    echo "SECURITY AUDIT SUMMARY REPORT"
    echo "Project: INSY7314 Part 2 GradiQ"
    echo "Date: $(date)"
    echo "========================================"
    echo ""
    echo "Files generated:"
    ls -la security-reports/
    echo ""
    echo "Key findings:"
    echo "- NPM audit results: See backend-npm-audit.json and frontend-npm-audit.json"
    echo "- Snyk results: See snyk-backend.json and snyk-frontend.json"
    echo "- ESLint security: See backend-eslint-security.json and frontend-eslint-security.json"
    echo "- Sensitive data check: See sensitive-data-check.txt"
    echo "- SSL/TLS check: See ssl-tls-check.txt"
    echo "- Dependency check: See dependency-check.txt"
    echo "- Security config check: See security-config-check.txt"
    echo ""
    echo "Next steps:"
    echo "1. Review all generated reports"
    echo "2. Address high and critical vulnerabilities"
    echo "3. Update dependencies with known vulnerabilities"
    echo "4. Implement additional security measures as needed"
    echo "5. Schedule regular security audits"
} > security-reports/SECURITY-AUDIT-SUMMARY.txt

echo "Security audit complete! Check the security-reports/ directory for detailed results."
echo "Summary: security-reports/SECURITY-AUDIT-SUMMARY.txt"