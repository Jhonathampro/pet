// Cliente HTTP da API do Hub Pet (pasta api/).
// Em desenvolvimento o Vite repassa /api para http://localhost:3333 (ver vite.config.ts).
const BASE_URL: string = import.meta.env.VITE_API_URL ?? '/api';

const TOKEN_KEY = 'pethub_token';

/** Disparado quando a API recusa o token (expirado/inválido), para o AuthContext deslogar. */
export const SESSION_EXPIRED_EVENT = 'pethub:session-expired';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = getToken();
  let response: Response;
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o servidor (pasta api) está rodando.');
  }

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    // token recusado em uma rota que não é a de login -> sessão acabou
    if (response.status === 401 && token && !path.startsWith('/auth/login')) {
      setToken(null);
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    const details: { field: string; message: string }[] | undefined = data?.error?.details;
    const message = data?.error?.message ?? `Erro ${response.status} ao falar com a API.`;
    throw new Error(
      details?.length ? `${message} ${details.map((d) => `${d.field}: ${d.message}`).join('; ')}` : message,
    );
  }
  return data as T;
}
