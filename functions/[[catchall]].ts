import type { Env } from './types';

export const onRequest = async (context: { request: Request; env: Env }) => {
  // First, attempt to fetch static assets (e.g. JS/CSS chunks, images, icons)
  const asset = await context.env.ASSETS.fetch(context.request);
  if (asset.status !== 404) {
    return asset;
  }

  const url = new URL(context.request.url);

  // If this is an unmatched /api/ route, return 404 JSON
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'NOT_FOUND', path: url.pathname }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // For all frontend routes (/booking/..., /profil, /ulasan), serve index.html with 200 OK
  const indexUrl = new URL('/index.html', context.request.url);
  return context.env.ASSETS.fetch(new Request(indexUrl.toString(), context.request));
};
