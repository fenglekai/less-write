#!/bin/sh

set -e

pnpm i --frozen-lockfile
pnpm update:version

pnpm build

cd dist/less-write-ui
npm publish --provenance
cd -

echo "✅ Publish completed"
