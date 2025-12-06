# PowerShell script to setup KV namespace for Firebase Auth
# Run this script from the project root directory

Write-Host "Creating KV namespace for Firebase Auth..." -ForegroundColor Cyan

# Create KV namespace (note: use spaces not colons in newer Wrangler)
$output = npx wrangler kv namespace create PUBLIC_JWK_CACHE_KV 2>&1 | Out-String

Write-Host $output

# Extract the ID from the output
if ($output -match 'id = "([^"]+)"') {
    $kvId = $matches[1]
    Write-Host "`nKV Namespace ID: $kvId" -ForegroundColor Green
    Write-Host "`nPlease update wrangler.jsonc:" -ForegroundColor Yellow
    Write-Host "Replace 'placeholder' with: $kvId" -ForegroundColor Yellow
} else {
    Write-Host "`nCouldn't extract KV ID from output. Please check the output above." -ForegroundColor Red
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update the KV namespace ID in wrangler.jsonc"
Write-Host "2. Enable Email/Password authentication in Firebase Console"
Write-Host "3. Run: npm run dev" -ForegroundColor Green



