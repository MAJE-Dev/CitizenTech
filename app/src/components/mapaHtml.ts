// Página do mapa real: Leaflet + imagens do OpenStreetMap (gratuito, sem chave).
// Ela roda dentro de um WebView e conversa com o app por mensagens:
//   página -> app: { tipo: "pronto" } | { tipo: "selecionar", id } | { tipo: "falha" }
//   app -> página: window.atualizar({ pontos, selecionado })
import { Colors, Sizes } from "@/theme";

/** Endereço das imagens do mapa. Pode ser trocado por EXPO_PUBLIC_MAPA_TILES (veja .env.example). */
export const MAPA_TILES =
  process.env.EXPO_PUBLIC_MAPA_TILES || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
/** Identifica o app para o servidor do mapa (a política do OpenStreetMap pede isso). */
export const MAPA_ORIGEM = "https://github.com/MAJE-Dev/CitizenTech";
const LEAFLET = "https://unpkg.com/leaflet@1.9.4/dist";
const ESPERA_MS = 10000; // sem nenhuma imagem do mapa nesse tempo, o app volta ao mapa ilustrativo

export interface PontoMapa {
  id: string;
  lat: number;
  lng: number;
  cor: string;
  rotulo: string;
}
export interface DadosMapa {
  pontos: PontoMapa[];
  selecionado: string | null;
}
export type MensagemMapa =
  | { tipo: "pronto" }
  | { tipo: "falha" }
  | { tipo: "selecionar"; id: string };

export function lerMensagem(texto: unknown): MensagemMapa | undefined {
  try {
    const m: unknown = typeof texto === "string" ? JSON.parse(texto) : undefined;
    if (m && typeof m === "object" && "tipo" in m) return m as MensagemMapa;
  } catch {
    // mensagem de outra origem: ignora
  }
  return undefined;
}

export function htmlDoMapa(): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="stylesheet" href="${LEAFLET}/leaflet.css">
<style>
  html, body, #mapa { height: 100%; margin: 0; background: ${Colors.mapaTerra}; }
  .pino { position: relative; border-radius: 50%; border: 2px solid ${Colors.branco}; box-sizing: border-box;
          box-shadow: 0 1px 4px ${Colors.sombra}; }
  .pino::after { content: ""; position: absolute; inset: 32%; border-radius: 50%; background: ${Colors.branco}; }
  .pino.ativo { border: 3px solid ${Colors.primaria}; }
</style>
</head>
<body>
<div id="mapa"></div>
<script>
  function avisar(m) {
    var texto = JSON.stringify(m);
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(texto);
    else if (window.parent !== window) window.parent.postMessage(texto, "*");
  }
  function falha() { avisar({ tipo: "falha" }); }
</script>
<script src="${LEAFLET}/leaflet.js" onerror="falha()"></script>
<script>
(function () {
  if (!window.L) return falha();
  var mapa = L.map("mapa", { zoomControl: true }).setView([-23.55, -46.63], 13);
  mapa.attributionControl.setPrefix(false);
  var chegou = 0;
  var camada = L.tileLayer(${JSON.stringify(MAPA_TILES)}, {
    maxZoom: 19,
    attribution: "\\u00a9 OpenStreetMap",
  }).addTo(mapa);
  camada.on("tileload", function () { chegou++; });
  setTimeout(function () { if (!chegou) falha(); }, ${ESPERA_MS});

  var marcadores = [];
  var idsNoMapa = "";
  window.atualizar = function (dados) {
    marcadores.forEach(function (m) { m.remove(); });
    marcadores = dados.pontos.map(function (p) {
      var ativo = p.id === dados.selecionado;
      var tam = ativo ? ${Sizes.pinoAtivo} : ${Sizes.pino};
      var m = L.marker([p.lat, p.lng], {
        title: p.rotulo,
        keyboard: true,
        zIndexOffset: ativo ? 1000 : 0,
        icon: L.divIcon({
          className: "",
          iconSize: [tam, tam],
          html: '<div class="pino' + (ativo ? " ativo" : "") + '" style="width:' + tam +
            "px;height:" + tam + "px;background:" + p.cor + '"></div>',
        }),
      }).addTo(mapa);
      m.on("click", function () { avisar({ tipo: "selecionar", id: p.id }); });
      var el = m.getElement();
      if (el) el.setAttribute("aria-label", p.rotulo);
      return m;
    });
    // Só reenquadra quando o conjunto de pontos muda (não ao tocar num pino).
    var ids = dados.pontos.map(function (p) { return p.id; }).join("|");
    if (ids !== idsNoMapa && dados.pontos.length) {
      mapa.fitBounds(dados.pontos.map(function (p) { return [p.lat, p.lng]; }),
        { padding: [36, 36], maxZoom: 16 });
    }
    idsNoMapa = ids;
  };
  // No navegador (iframe) os dados chegam por mensagem; no celular, por window.atualizar.
  window.addEventListener("message", function (e) {
    try {
      var d = typeof e.data === "string" ? JSON.parse(e.data) : null;
      if (d && d.pontos) window.atualizar(d);
    } catch (erro) {}
  });
  avisar({ tipo: "pronto" });
})();
</script>
</body>
</html>`;
}
