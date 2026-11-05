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
  x: number; // posição no mapa (%)
  y: number;
  abertaEm: string;
  atualizadaEm: string;
  andamento: string;
  descricao: string;
}

export const TIPOS = ["Buraco", "Bueiro quebrado", "Iluminação", "Calçada danificada"];

const MOCK: Ocorrencia[] = [
  { id: "OC-3426-456", tipo: "Buraco", gravidade: "Grave", status: "Em andamento", endereco: "Rua das Palmeiras, 32 - Centro", lat: -23.5489, lng: -46.6388, x: 42, y: 30, abertaEm: "23/10/2026", atualizadaEm: "24/10/2026", andamento: "Reparo emergencial", descricao: "Rachaduras perto do cruzamento." },
  { id: "OC-3427-101", tipo: "Bueiro quebrado", gravidade: "Moderada", status: "Recebida", endereco: "Av. Brasil, 1200 - Jardim Sul", lat: -23.5521, lng: -46.6302, x: 68, y: 22, abertaEm: "25/10/2026", atualizadaEm: "25/10/2026", andamento: "Aguardando vistoria", descricao: "Tampa do bueiro solta." },
  { id: "OC-3428-220", tipo: "Buraco", gravidade: "Leve", status: "Concluída", endereco: "Rua Ipê Amarelo, 78 - Vila Nova", lat: -23.5455, lng: -46.6411, x: 25, y: 55, abertaEm: "10/10/2026", atualizadaEm: "18/10/2026", andamento: "Asfalto refeito", descricao: "Buraco pequeno na faixa da direita." },
  { id: "OC-3429-332", tipo: "Iluminação", gravidade: "Moderada", status: "Em andamento", endereco: "Praça da Matriz, s/n - Centro", lat: -23.5502, lng: -46.6355, x: 55, y: 62, abertaEm: "20/10/2026", atualizadaEm: "22/10/2026", andamento: "Troca de lâmpada agendada", descricao: "Poste apagado à noite." },
  { id: "OC-3430-418", tipo: "Calçada danificada", gravidade: "Grave", status: "Recebida", endereco: "Rua do Comércio, 410 - Bela Vista", lat: -23.5477, lng: -46.6290, x: 80, y: 70, abertaEm: "26/10/2026", atualizadaEm: "26/10/2026", andamento: "Aguardando vistoria", descricao: "Calçada com desnível, risco de queda." },
  { id: "OC-3431-509", tipo: "Buraco", gravidade: "Moderada", status: "Em andamento", endereco: "Av. das Flores, 950 - Jardim Sul", lat: -23.5533, lng: -46.6372, x: 35, y: 80, abertaEm: "21/10/2026", atualizadaEm: "23/10/2026", andamento: "Equipe a caminho", descricao: "Buraco médio após chuva." },
];

export async function listarOcorrencias(): Promise<Ocorrencia[]> {
  await new Promise((r) => setTimeout(r, 700));
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("simularErro")) {
    throw new Error("Não foi possível carregar as ocorrências. Verifique sua internet.");
  }
  const { listarLocais } = await import("./db");
  return [...listarLocais(), ...MOCK];
}

export async function buscarOcorrencia(id: string): Promise<Ocorrencia | undefined> {
  const todas = await listarOcorrencias();
  return todas.find((o) => o.id === id);
}
