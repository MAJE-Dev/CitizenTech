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

const MOCK_EMBUTIDO = mockEmbutido as unknown as Ocorrencia[];

// Última lista da cidade carregada nesta sessão. Evita baixar tudo de novo a cada tela:
// o Detalhe e a volta para o Início reaproveitam o que já está na memória.
let cidade: ListaOcorrencias | undefined;

/** Lista da cidade: usa a memória quando pode e só vai à internet se precisar (ou se `forcar`). */
async function carregarCidade(forcar = false): Promise<ListaOcorrencias> {
  // Se a última tentativa caiu na cópia offline, tenta a internet de novo.
  if (cidade && !cidade.offline && !forcar) return cidade;
  try {
    cidade = { itens: await getJson<Ocorrencia[]>(API_URL), offline: false };
  } catch {
    // Sem rede: fica com o que já tinha ou com a cópia do mesmo JSON que vai dentro do app.
    cidade = { itens: cidade?.itens ?? MOCK_EMBUTIDO, offline: true };
  }
  return cidade;
}

/**
 * Lista as ocorrências da cidade (mock via fetch) somadas às registradas no banco local.
 * `forcar` busca na internet de novo (puxar para atualizar / "Tentar de novo").
 */
export async function listarOcorrencias(opcoes?: {
  simularErro?: boolean;
  forcar?: boolean;
}): Promise<ListaOcorrencias> {
  const { listarLocais } = await import("./db");
  const locais = await listarLocais();
  // Para demonstrar o estado de erro, busca um arquivo que não existe (e não usa a cópia).
  if (opcoes?.simularErro) await getJson<Ocorrencia[]>(`${API_URL}.inexistente`);
  const { itens, offline } = await carregarCidade(opcoes?.forcar);
  // Garante protocolos únicos na tela mesmo que a cidade publique um igual a um local.
  const idsLocais = new Set(locais.map((o) => o.id));
  return { itens: [...locais, ...itens.filter((o) => !idsLocais.has(o.id))], offline };
}

/**
 * Busca uma ocorrência pelo protocolo sem recarregar a lista inteira:
 * primeiro o banco local, depois a lista que já está na memória.
 * Só vai à internet se o Detalhe for aberto antes de qualquer lista ter sido carregada.
 */
export async function buscarOcorrencia(id: string): Promise<Ocorrencia | undefined> {
  const { buscarLocal } = await import("./db");
  const local = await buscarLocal(id);
  if (local) return local;
  const { itens } = cidade ?? (await carregarCidade());
  return itens.find((o) => o.id === id);
}

export interface NovaOcorrencia {
  tipo: string;
  gravidade: Gravidade;
  endereco: string;
  descricao: string;
}

const sortear = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));
const MAX_TENTATIVAS = 20;

/**
 * Registra uma ocorrência no banco com um protocolo que não se repete.
 * O protocolo sorteado é conferido contra a lista da cidade e contra o banco
 * (a chave primária recusa repetidos); se já existir, sorteia outro.
 */
export async function registrarOcorrencia(nova: NovaOcorrencia): Promise<Ocorrencia> {
  const { dataBR, inserirOcorrencia } = await import("./db");
  const daCidade = new Set((cidade?.itens ?? MOCK_EMBUTIDO).map((o) => o.id));
  const hoje = dataBR(new Date());
  for (let tentativa = 0; tentativa < MAX_TENTATIVAS; tentativa++) {
    const id = `OC-${sortear(1000, 9999)}-${sortear(100, 999)}`;
    if (daCidade.has(id)) continue;
    const ocorrencia: Ocorrencia = {
      id,
      tipo: nova.tipo,
      gravidade: nova.gravidade,
      status: "Recebida",
      endereco: nova.endereco,
      descricao: nova.descricao || "Sem descrição.",
      lat: -23.55 + Math.random() * 0.01, // coordenadas fictícias
      lng: -46.64 + Math.random() * 0.01,
      x: sortear(15, 85), // posição no mapa ilustrativo (%)
      y: sortear(15, 85),
      abertaEm: hoje,
      atualizadaEm: hoje,
      andamento: "Aguardando vistoria",
    };
    if (await inserirOcorrencia(ocorrencia)) return ocorrencia;
  }
  throw new Error("Não foi possível gerar um protocolo. Tente de novo.");
}
