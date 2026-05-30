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
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
        'access-control-max-age': '86400',
      },
    });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ granted: false }, { status: 405 });
  }

  const expectedCode = env.WEB_ACCESS_CODE;
  if (!expectedCode) {
    return jsonResponse({ granted: false }, { status: 500 });
  }

  let submittedCode = '';
  try {
    const body = await request.json();
    submittedCode = String(body?.code ?? '').trim();
  } catch {
    return jsonResponse({ granted: false }, { status: 400 });
  }

  return jsonResponse({
    granted: submittedCode.toUpperCase() === expectedCode.trim().toUpperCase(),
  });
}
