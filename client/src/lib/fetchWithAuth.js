export async function fetchWithAuth(input, init = {}) {
  const opts = {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  };

  const res = await fetch(input, opts);

  // Se status 401 -> redireciona para login imediatamente
  if (res.status === 401) {
    window.location.href = '/_adm/portal/entrar';
    throw new Error('Unauthorized');
  }

  // Tentar inspecionar corpo para mensagens de token inválido sem consumir o response original
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
    // no-op: se algo falhar ao inspecionar, não bloquear comportamento normal
  }

  return res;
}