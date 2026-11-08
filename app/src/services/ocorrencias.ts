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

import { getJson } from "./api";

// Mock: arquivo JSON do repositório (app/mock/ocorrencias.json), buscado com fetch.
// A URL pode ser trocada pela variável EXPO_PUBLIC_API_URL (veja .env.example).
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://raw.githubusercontent.com/MAJE-Dev/CitizenTech/main/app/mock/ocorrencias.json";

/** Lista as ocorrências da cidade (mock via fetch) somadas às registradas no banco local. */
export async function listarOcorrencias(opcoes?: { simularErro?: boolean }): Promise<Ocorrencia[]> {
  // Para demonstrar o estado de erro, busca um arquivo que não existe.
  const cidade = await getJson<Ocorrencia[]>(
    opcoes?.simularErro ? `${API_URL}.inexistente` : API_URL,
  );
  const { listarLocais } = await import("./db");
  return [...(await listarLocais()), ...cidade];
}

export async function buscarOcorrencia(id: string): Promise<Ocorrencia | undefined> {
  const todas = await listarOcorrencias();
  return todas.find((o) => o.id === id);
}
