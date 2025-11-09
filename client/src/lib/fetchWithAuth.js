const API_BASE = import.meta.env.VITE_API_BASE || ''; // configure Vercel env var VITE_API_BASE=https://sua-api.onrender.com

export async function fetchWithAuth(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const defaultOpts = {
    credentials: 'include', // envia cookies httpOnly
    headers: { ...(opts.headers || {}) },
    ...opts,
  };
  return fetch(url, defaultOpts);
}

// helper para enviar FormData (não seta Content-Type)
export async function fetchWithAuthForm(path, opts = {}) {
  return fetchWithAuth(path, { ...opts });
}

export default fetchWithAuth;