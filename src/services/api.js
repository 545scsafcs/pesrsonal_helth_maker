const BASE_URL = '';

async function request(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  let res;
  try {
    res = await fetch(`${BASE_URL}${url}`, config);
  } catch (netErr) {
    throw new Error('Authentication server is unavailable. Check the API/database configuration.');
  }

  if (!res.ok) {
    let errorObj;
    try {
      errorObj = await res.json();
    } catch {
      errorObj = null;
    }

    if (res.status === 502 || res.status === 503 || res.status === 500) {
      const msg = errorObj?.message && !errorObj.message.toLowerCase().includes('server error')
        ? errorObj.message
        : 'Authentication server is unavailable. Check the API/database configuration.';
      throw new Error(msg);
    }

    throw new Error(errorObj?.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: (url) => request(url, { method: 'GET' }),

  post: (url, body) => request(url, {
    method: 'POST',
    body: JSON.stringify(body),
  }),

  patch: (url, body) => request(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }),

  delete: (url) => request(url, { method: 'DELETE' }),
};
