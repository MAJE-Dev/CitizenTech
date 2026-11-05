// Camada de banco local (localStorage na web; no app Expo equivale ao SQLite/AsyncStorage).
import type { Ocorrencia } from "./ocorrencias";

const K_OC = "citizentech:ocorrencias";
const K_COM = "citizentech:comentarios";

const ler = <T,>(k: string, padrao: T): T => {
  if (typeof window === "undefined") return padrao;
  try {
    return JSON.parse(localStorage.getItem(k) ?? "") as T;
  } catch {
    return padrao;
  }
};

export const listarLocais = () => ler<Ocorrencia[]>(K_OC, []);

export function salvarOcorrencia(o: Ocorrencia) {
  localStorage.setItem(K_OC, JSON.stringify([o, ...listarLocais()]));
}

export interface Comentario { texto: string; data: string }

export const listarComentarios = (id: string) => ler<Record<string, Comentario[]>>(K_COM, {})[id] ?? [];

export function salvarComentario(id: string, texto: string) {
  const todos = ler<Record<string, Comentario[]>>(K_COM, {});
  todos[id] = [...(todos[id] ?? []), { texto, data: new Date().toLocaleString("pt-BR") }];
  localStorage.setItem(K_COM, JSON.stringify(todos));
}
