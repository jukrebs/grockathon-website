# Grok AR

Generate 3D objects from text descriptions and view them in AR on iPhone.

## Setup

```bash
npm install
npm run dev
```

## Environment

Create `.env.local`:

```env
EXTERNAL_API_URL=http://154.54.100.75:8000
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable `EXTERNAL_API_URL`
4. Deploy

## API

The frontend connects to a backend API with these endpoints:

- `POST /api/generate` - Start generation job
- `GET /api/status/{job_id}` - Poll job status  
- `GET /api/asset/{job_id}?asset_type=glb|usdz|image` - Download assets

See `API.md` for full documentation.
