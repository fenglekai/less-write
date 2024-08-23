#!/bin/sh

pnpm i --frozen-lockfile

pnpm exec conventional-changelog -p @less-write/conventional-changelog-custom -r 2 -i release.md -s
pnpm exec conventional-changelog -p angular -r 0 -i CHANGELOG.md -s