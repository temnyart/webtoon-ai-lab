# Webtoon AI Lab V2

Vercel/Next.js deployment package for EP.01 production.

## Working now
- EP.01 CUT cards and Inspector
- MASTER image upload by drag/drop
- automatic + manual MASTER linking
- prompt editing
- Generate CUT -> `/api/generate-cut`
- server-side OpenAI API key
- high-quality 1024x1536 image generation with high input fidelity
- generated image preview + regenerate
- `/api/health` configuration check

## Vercel setup
Add these Project Environment Variables and redeploy:
- `OPENAI_API_KEY` (required, sensitive)
- `OPENAI_IMAGE_MODEL` (default `gpt-image-1.5`)
- `OPENAI_ORCHESTRATOR_MODEL` (default `gpt-5`)

MASTER uploads are currently browser-local. Persistent cloud asset storage is the next storage milestone.


## Security patch
- Next.js pinned to 15.5.21 (Maintenance LTS security release) for Vercel deployment compatibility.
