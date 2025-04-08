#!/usr/bin/env bash

corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm build
