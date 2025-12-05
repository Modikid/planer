#!/bin/bash
# Shell script to setup KV namespace for Firebase Auth
# Run this script from the project root directory

echo "Creating KV namespace for Firebase Auth..."

# Create KV namespace
output=$(npx wrangler kv:namespace create PUBLIC_JWK_CACHE_KV 2>&1)

echo "$output"

# Extract the ID from the output
if [[ $output =~ id\ =\ \"([^\"]+)\" ]]; then
    kv_id="${BASH_REMATCH[1]}"
    echo ""
    echo "KV Namespace ID: $kv_id"
    echo ""
    echo "Please update wrangler.jsonc:"
    echo "Replace 'placeholder' with: $kv_id"
else
    echo ""
    echo "Couldn't extract KV ID from output. Please check the output above."
fi

echo ""
echo "Next steps:"
echo "1. Update the KV namespace ID in wrangler.jsonc"
echo "2. Enable Email/Password authentication in Firebase Console"
echo "3. Run: npm run dev"
