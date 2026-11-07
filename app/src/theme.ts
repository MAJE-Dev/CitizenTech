// Tema centralizado: cores, fontes, espaçamentos e raios.
// Nenhuma tela deve usar cor, tamanho de fonte ou espaçamento fixo.
export const Colors = {
  marca: "#0080ff", // barra do topo (SmartRoad)
  primaria: "#0057b8", // botões e links (contraste 7:1 com branco)
  primariaTexto: "#ffffff",
  fundo: "#f2f6fc",
  cartao: "#ffffff",
  texto: "#0f1b3d",
  textoSuave: "#46526b", // contraste 7:1 sobre o fundo
  borda: "#c5d0e3",
  grave: "#b3261e",
  moderada: "#e8710a",
  leve: "#f2c500",
  progresso: "#0057b8",
  concluida: "#1b7f4b",
  mapaTerra: "#e9efe3",
  mapaRua: "#ffffff",
  mapaParque: "#c8e6c0",
} as const;

export const Fonts = {
  corpo: 16, // mínimo para leitura confortável
  pequena: 14,
  subtitulo: 18,
  titulo: 24,
  marca: 22,
} as const;

export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const Radius = { sm: 8, md: 12, pill: 999 } as const;
export const MinTouch = 48; // área mínima de toque
