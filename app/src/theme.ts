// Tema centralizado: cores, fontes, espaçamentos e raios.
// Nenhuma tela deve usar cor, tamanho de fonte ou espaçamento fixo.
// Paleta da marca SmartRoad: um azul único (o mesmo no topo, nos botões e no ícone do app)
// e um amarelo de sinalização viária, usado em detalhes do logo e em avisos.
export const Marca = {
  azul: "#0054b0", // cor principal (contraste 7,2:1 com branco)
  azulEscuro: "#003d82", // variação para toque/pressionado
  azulClaro: "#e6f0fb", // fundo suave de destaque
  amarelo: "#ffc21a", // sinalização: faixa do logo e avisos
  amareloClaro: "#fff4d6", // fundo de avisos (texto escuro, contraste 15:1)
} as const;

export const Colors = {
  marca: Marca.azul, // barra do topo
  primaria: Marca.azul, // botões, links e aba ativa (mesma cor do topo)
  primariaPressionada: Marca.azulEscuro,
  primariaSuave: Marca.azulClaro,
  destaque: Marca.amarelo,
  avisoFundo: Marca.amareloClaro,
  branco: "#ffffff",
  primariaTexto: "#ffffff",
  fundo: "#f2f6fc",
  cartao: "#ffffff",
  texto: "#0f1b3d",
  textoSuave: "#46526b", // contraste 7:1 sobre o fundo
  borda: "#c5d0e3",
  grave: "#b3261e",
  moderada: "#e8710a",
  leve: "#f2c500",
  progresso: Marca.azul,
  concluida: "#1b7f4b",
  mapaTerra: "#e9efe3",
  mapaRua: "#ffffff",
  mapaParque: "#c8e6c0",
  mapaNota: "rgba(255,255,255,0.9)", // fundo da legenda do mapa
  sombra: "rgba(0,0,0,0.35)", // sombra dos pinos no mapa real
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

// Tamanhos de componentes (altura do mapa, barra de abas, pinos, ícones).
export const Sizes = {
  mapa: 260,
  tabBar: 64,
  chip: 40,
  campoMultilinha: 96,
  pino: 36,
  pinoAtivo: 44,
  rua: 6,
  iconePino: 20,
  iconePinoAtivo: 24,
  iconeMarca: 30,
  iconeAviso: 22,
  iconeBotao: 22,
  foto: 200, // altura da foto do problema
} as const;
