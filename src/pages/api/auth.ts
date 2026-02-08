import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  // Redirect back to admin with the auth code
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/admin?auth=${code}`
    }
  });
};
