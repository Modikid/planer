# Planer

A modern planner application built with React 19, TypeScript, and Vite, deployable to Cloudflare Workers and as a native Android app via Capacitor.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 7
- **Deployment**: Cloudflare Workers (serverless)
- **Mobile**: Capacitor 7 (Android support)
- **Code Quality**: ESLint with TypeScript support

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Cloudflare account (for deployment)
- Android Studio (for mobile development)

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

Build the project for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Deployment

### Cloudflare Workers

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

Generate TypeScript types for Cloudflare bindings:

```bash
npm run cf-typegen
```

Configuration is managed in `wrangler.jsonc`.

## Mobile Development

### Android

Sync web assets to native project:

```bash
npm run cap:sync
```

Build and sync:

```bash
npm run cap:build
```

Open Android Studio:

```bash
npm run cap:android
```

## Project Structure

```
planer/
├── src/                 # React application source
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── assets/         # Static assets
├── worker/             # Cloudflare Worker code
│   └── index.ts        # Worker entry point
├── android/            # Capacitor Android project
├── public/             # Public static files
├── dist/               # Build output
│   ├── client/         # Web app build
│   └── planer/         # Worker build
├── capacitor.config.ts # Capacitor configuration
├── wrangler.jsonc      # Cloudflare Workers config
└── vite.config.ts      # Vite configuration
```

## Configuration Files

- **capacitor.config.ts** - Capacitor mobile app configuration
- **wrangler.jsonc** - Cloudflare Workers deployment settings
- **vite.config.ts** - Vite build configuration
- **tsconfig.json** - TypeScript configuration
- **eslint.config.js** - ESLint rules

## License

Private project
