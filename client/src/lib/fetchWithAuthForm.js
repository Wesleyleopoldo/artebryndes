// ...new file...
export async function fetchWithAuthForm(input, init = {}) {
  const opts = {
    credentials: 'include',
    ...init,
    // IMPORTANT: do not set Content-Type here so the browser can set the multipart boundary
    headers: { ...(init.headers || {}) },
  };

  const res = await fetch(input, opts);

  if (res.status === 401) {
    window.location.href = '/_adm/portal/entrar';
    throw new Error('Unauthorized');
  }

  try {
    const ct = (res.headers.get('content-type') || '').toLowerCase();

    if (ct.includes('application/json')) {
      const json = await res.clone().json().catch(() => null);
      if (json && (json.message === 'Token inválido!!' || json.message === 'Token inválido')) {
        window.location.href = '/_adm/portal/entrar';
        throw new Error('Unauthorized');
      }
    } else {
      const text = await res.clone().text().catch(() => '');
      if (text && text.includes('Token inválido')) {
        window.location.href = '/_adm/portal/entrar';
        throw new Error('Unauthorized');
      }
    }
  } catch (err) {
    // no-op
  }

  return res;
}