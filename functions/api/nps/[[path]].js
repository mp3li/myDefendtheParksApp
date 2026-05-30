const NPS_API_BASE_URL = 'https://developer.nps.gov/api/v1';

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      ...init.headers,
    },
  });
}

export async function onRequest(context) {
  const { request, env, params } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-allow-headers': 'content-type, accept',
        'access-control-max-age': '86400',
      },
    });
  }

  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
  }

  const apiKey = env.NPS_API_KEY || env.EXPO_PUBLIC_NPS_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: 'NPS API key is not configured.' }, { status: 500 });
  }

  const pathParam = params.path;
  const pathParts = Array.isArray(pathParam) ? pathParam : pathParam ? [pathParam] : [];
  const upstreamPath = pathParts.join('/');
  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(`${NPS_API_BASE_URL}/${upstreamPath}`);

  incomingUrl.searchParams.forEach((value, key) => {
    if (key.toLowerCase() !== 'api_key') {
      upstreamUrl.searchParams.set(key, value);
    }
  });
  upstreamUrl.searchParams.set('api_key', apiKey);

  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    headers: {
      'X-Api-Key': apiKey,
      Accept: 'application/json',
    },
  });

  const responseBody = await upstreamResponse.text();
  return new Response(responseBody, {
    status: upstreamResponse.status,
    headers: {
      'content-type': upstreamResponse.headers.get('content-type') || 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'access-control-allow-origin': '*',
    },
  });
}
