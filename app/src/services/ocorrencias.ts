// Camada de serviços: dados simulados (mock) de ocorrências urbanas.
// Nenhum dado pessoal real. Endereços e coordenadas são fictícios.
export type Gravidade = "Grave" | "Moderada" | "Leve";
export type Status = "Recebida" | "Em andamento" | "Concluída";

export interface Ocorrencia {
  id: string;
  tipo: string;
  gravidade: Gravidade;
  status: Status;
  endereco: string;
  lat: number;
  lng: number;
  x: number; // posição no mapa ilustrativo (%)
  y: number;
  abertaEm: string;
  atualizadaEm: string;
  andamento: string;
  descricao: string;
}

export const TIPOS = ["Buraco", "Bueiro quebrado", "Iluminação", "Calçada danificada"];
export const GRAVIDADES: Gravidade[] = ["Leve", "Moderada", "Grave"];

import mockEmbutido from "../../mock/ocorrencias.json";
import { getJson } from "./api";

// Mock: arquivo JSON do repositório (app/mock/ocorrencias.json), buscado com fetch.
// A URL pode ser trocada pela variável EXPO_PUBLIC_API_URL (veja .env.example).
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://raw.githubusercontent.com/MAJE-Dev/CitizenTech/main/app/mock/ocorrencias.json";

export interface ListaOcorrencias {
  itens: Ocorrencia[];
  /** true quando a internet falhou e o app mostrou a cópia de exemplo guardada nele. */
  offline: boolean;
}

/**
 * Lista as ocorrências da cidade (mock via fetch) somadas às registradas no banco local.
 * Se a rede falhar, usa a cópia do mesmo JSON que vai dentro do app, para ele não ficar inutilizável.
 */
export async function listarOcorrencias(opcoes?: {
  simularErro?: boolean;
}): Promise<ListaOcorrencias> {
  const { listarLocais } = await import("./db");
  const locais = await listarLocais();
  // Para demonstrar o estado de erro, busca um arquivo que não existe (e não usa a cópia).
  if (opcoes?.simularErro) await getJson<Ocorrencia[]>(`${API_URL}.inexistente`);
  try {
    const cidade = await getJson<Ocorrencia[]>(API_URL);
    return { itens: [...locais, ...cidade], offline: false };
  } catch {
    return { itens: [...locais, ...(mockEmbutido as unknown as Ocorrencia[])], offline: true };
  }
}

/** Ocorrências registradas no aparelho abrem sem internet; as demais vêm da lista. */
export async function buscarOcorrencia(id: string): Promise<Ocorrencia | undefined> {
  const { buscarLocal } = await import("./db");
  const local = await buscarLocal(id);
  if (local) return local;
  const { itens } = await listarOcorrencias();
  return itens.find((o) => o.id === id);
}
