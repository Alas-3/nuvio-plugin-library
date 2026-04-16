<div align="center">

<img src="./public/NuvioLogo.png" alt="Nuvio logo" width="320" />

<h1>Nuvio Plugins</h1>

<p>The official plugin/add-on index for the Nuvio ecosystem.</p>

[![Stars](https://img.shields.io/github/stars/NuvioCommunity/plugins?style=for-the-badge)](https://github.com/NuvioCommunity/plugins/stargazers)
[![Issues](https://img.shields.io/github/issues/NuvioCommunity/plugins?style=for-the-badge)](https://github.com/NuvioCommunity/plugins/issues)

<p>Search providers fast, inspect scraper manifests, and install with confidence.</p>

</div>

<p align="center">
  <img src="./public/thumbnail.png" alt="Nuvio Plugins home page showing search, filters, and provider cards" width="860" />
</p>

## About

Nuvio Plugins is a React + TypeScript web app that indexes plugin providers and their scraper manifests from Nuvio's official source data.

It gives the community one trusted place to discover plugins, compare metadata, and open manifests directly.

## Why Nuvio Built This

As the plugin ecosystem grew, provider data became harder to browse quickly across different sources. Nuvio Plugins solves that by presenting one official directory with live synchronized data and searchable scraper details.

## What It Does

- Syncs provider data from the official Notion source.
- Resolves provider manifests and extracts scraper metadata.
- Supports fast search by provider, author, language, and country.
- Includes sorting by relevance, provider name, author, and scraper count.
- Offers quick actions to copy manifest links and open repositories.
- Works across desktop and mobile layouts.

## Requirements

- Node.js 20+
- npm or Bun

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run in development:

```bash
npm run dev
```

3. Open the local URL shown by Vite (usually `http://localhost:5173`).

## Build and Preview

```bash
npm run build
npm run preview
```

## Lint

```bash
npm run lint
```

## How Data Sync Works

- The app requests Notion table data through `/api/notion/:pageId`.
- It discovers plugin repository/manifest URLs from each row.
- It fetches each provider `manifest.json` and normalizes scraper fields.
- The UI renders providers and scraper cards from the synchronized payload.

## Deploying

This repository includes [vercel.json](vercel.json) rewrites for API proxying and SPA routing.

Typical deploy flow:

1. Push to GitHub.
2. Import the repository in Vercel.
3. Keep the default package build script (`npm run build`).
4. Deploy.

## Project Structure

```text
src/
  components/      # UI sections and cards
  hooks/           # Notion + manifest fetching logic
  data/            # Local sample data
  types.ts         # Shared TypeScript types
  App.tsx          # Main page composition
```
