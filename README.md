# FORGE - 3D Object Generator

A sleek, dark-themed Next.js website inspired by Grok's aesthetic. Users can describe any object and get a 3D model generated that can be viewed in AR on iPhone.

![FORGE Preview](preview.png)

## Features

- 🎨 **Grok-inspired Dark UI** - Minimalist design with orange accents and subtle animations
- 🗣️ **Text-to-3D Generation** - Describe any object and generate a 3D model
- 📱 **iPhone AR Support** - View generated models in augmented reality using AR Quick Look
- 🔄 **Interactive 3D Preview** - Rotate, zoom, and explore models in the browser
- ⬇️ **Download Models** - Export as GLB (web) or USDZ (iOS AR)

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Framer Motion** - Smooth animations
- **Google Model Viewer** - 3D model preview with AR support
- **CSS Modules** - Scoped styling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A 3D generation API backend (see API Requirements)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd grok-website

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your API URL
# EXTERNAL_API_URL=http://your-api-server.com

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## API Requirements

This frontend expects a backend API that generates 3D models. Configure the API URL in `.env.local`:

```env
EXTERNAL_API_URL=http://localhost:8000
```

### Expected API Endpoint

**POST** `/api/generate-3d`

Request body:
```json
{
  "prompt": "A futuristic robot with glowing blue eyes",
  "formats": ["glb", "usdz"]
}
```

Response:
```json
{
  "glbUrl": "https://storage.example.com/models/robot.glb",
  "usdzUrl": "https://storage.example.com/models/robot.usdz",
  "name": "Futuristic Robot"
}
```

### Model Format Requirements

- **GLB** - For web 3D preview (required)
- **USDZ** - For iPhone AR Quick Look (required for AR feature)

## AR Viewing

The AR feature uses Apple's AR Quick Look on iOS devices:

1. Generate a 3D model
2. On iPhone/iPad, tap "View in AR"
3. The model opens in AR Quick Look
4. Place the model in your real environment

## Project Structure

```
grok-website/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts      # API route to external service
│   ├── globals.css           # Global styles & CSS variables
│   ├── layout.tsx            # Root layout with fonts
│   ├── page.tsx              # Main page component
│   └── page.module.css       # Page styles
├── components/
│   ├── ModelPreview.tsx      # 3D viewer & AR button
│   └── ModelPreview.module.css
├── .env.local.example        # Environment template
├── package.json
└── README.md
```

## Customization

### Colors

Edit CSS variables in `app/globals.css`:

```css
:root {
  --bg-primary: #0a0a0b;
  --accent-primary: #f97316;  /* Orange accent */
  --text-primary: #fafafa;
  /* ... */
}
```

### Fonts

Fonts are configured in `app/layout.tsx` using `next/font`:
- **Outfit** - Main headings and body text
- **Space Mono** - Logo and labels

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variables in Vercel dashboard:
- `EXTERNAL_API_URL` - Your 3D generation API URL

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## License

MIT
