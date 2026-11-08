// Camada de rede: um único lugar que faz fetch e traduz falhas em mensagens simples.
const TIMEOUT_MS = 10000;
const MSG_ERRO =
  "Não foi possível carregar as ocorrências. Verifique sua internet e tente de novo.";

export async function getJson<T>(url: string): Promise<T> {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), TIMEOUT_MS);
  try {
    const resposta = await fetch(url, { signal: controle.signal });
    if (!resposta.ok) throw new Error(MSG_ERRO);
    const dados: unknown = await resposta.json();
    if (!Array.isArray(dados)) throw new Error(MSG_ERRO);
    return dados as T;
  } catch {
    throw new Error(MSG_ERRO);
  } finally {
    clearTimeout(timer);
  }
}
