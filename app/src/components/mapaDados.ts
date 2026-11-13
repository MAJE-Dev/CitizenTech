// O que os dois mapas (real e ilustrativo) têm em comum: props, cor dos pinos e dados dos pontos.
import { Colors } from "@/theme";
import type { Gravidade, Ocorrencia } from "@/services/ocorrencias";
import type { DadosMapa } from "./mapaHtml";

export const corPino: Record<Gravidade, string> = {
  Grave: Colors.grave,
  Moderada: Colors.moderada,
  Leve: Colors.leve,
};

export interface MapaProps {
  itens: Ocorrencia[];
  selecionado?: string;
  onSelect: (id: string) => void;
}

/** Converte as ocorrências no formato que a página do mapa entende. */
export function dadosDoMapa(itens: Ocorrencia[], selecionado?: string): string {
  const dados: DadosMapa = {
    selecionado: selecionado ?? null,
    pontos: itens.map((o) => ({
      id: o.id,
      lat: o.lat,
      lng: o.lng,
      cor: corPino[o.gravidade],
      rotulo: `${o.tipo}, gravidade ${o.gravidade}, ${o.endereco}`,
    })),
  };
  return JSON.stringify(dados);
}
