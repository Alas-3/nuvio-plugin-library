# Nuvio Plugin Library

A modern, searchable directory of Nuvio plugin providers and their scraper manifests.

## Features

- Live provider sync from the official Notion source page
- Fast search across plugin name, author, and language tags
- Sort by relevance, name, author, or scraper count
- One-click manifest copy with direct open action
- Responsive layout optimized for desktop and mobile
- Expandable scraper details for each provider

## Tech Stack

- React 19 + TypeScript
- Vite 8
- ESLint 9
- Bun or npm for package management

## Prerequisites

- Node.js 20+
- Bun (recommended) or npm

## Local Development

### 1. Install dependencies

With Bun:

```bash
bun install
```

With npm:

```bash
npm install
```

### 2. Run the app

With Bun:

```bash
bun run dev
```

With npm:

```bash
npm run dev
```

Then open the URL shown by Vite (usually http://localhost:5173).

## Build and Preview

### Production build

With Bun:

```bash
bun run build
```

With npm:

```bash
npm run build
```

### Preview the production output

With Bun:

```bash
bun run preview
```

With npm:

```bash
npm run preview
```

## Linting

With Bun:

```bash
bun run lint
```

With npm:

```bash
npm run lint
```

## How Provider Data Works

- The app pulls table data from a Notion page through `/api/notion/:pageId`
- It discovers plugin repository/manifest URLs from that table
- For each provider, it fetches `manifest.json` and extracts scraper metadata
- The UI renders providers and scrapers dynamically from live data

## Deploying

This project includes [vercel.json](vercel.json) rewrite rules for both API and SPA routing.

Quick deploy flow:

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Keep the default Vite build command (`vite build`) through package scripts.
4. Deploy.

## Provider Submission Tips

To make a provider list entry useful:

1. Ensure the manifest URL is valid and publicly reachable.
2. Add clear scraper names and descriptions.
3. Include `supportedTypes` and `contentLanguage` in every scraper.
4. Keep logos lightweight and stable (PNG or SVG URLs).

## Project Structure

```text
src/
  components/      # UI sections and cards
  hooks/           # Notion + manifest fetching logic
  data/            # Local sample data
  types.ts         # Shared TypeScript types
  App.tsx          # Main page composition
```
