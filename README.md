<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Nexus - Business Automation Platform

AI-powered business automation platform built with React, TypeScript, and Vite.

View your app in AI Studio: https://ai.studio/apps/drive/1hLjuoP1M4uOorusvVdlr1kE5_ANa0Z5a

## Features

- 📊 Interactive Dashboard with analytics
- 👥 Employee Management
- ✅ Task Automation
- 🤖 AI Integration (Google Gemini)
- 📈 Data Visualization with Recharts
- 🎨 Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API Key

## Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Set your `GEMINI_API_KEY` in `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deploy to Production

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`

### Option 2: Netlify

1. Connect your GitHub repository to Netlify

2. Set build command: `npm run build`

3. Set publish directory: `dist`

4. Add environment variable `GEMINI_API_KEY` in Netlify settings

### Option 3: Docker

```bash
docker build -t nexus-automation .
docker run -p 80:80 -e GEMINI_API_KEY=your_key nexus-automation
```

### Option 4: Static Hosting

Upload the contents of `dist/` folder to any static hosting service (S3, Cloudflare Pages, etc.)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `VITE_APP_TITLE` | Application title | No |
| `VITE_APP_URL` | Production URL | No |

See `.env.example` for all available options.

## Project Structure

```
├── components/       # React components
├── services/         # API and business logic
├── constants.ts      # App constants
├── types.ts          # TypeScript types
├── App.tsx           # Main application component
├── index.tsx         # Entry point
└── vite.config.ts    # Vite configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## License

MIT
