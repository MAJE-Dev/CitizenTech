import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { Colors, Fonts, Radius, Sizes, Spacing } from "@/theme";
import { dadosDoMapa, type MapaProps } from "./mapaDados";
import { htmlDoMapa, lerMensagem, MAPA_ORIGEM } from "./mapaHtml";

const HTML = htmlDoMapa();
// A tipagem do WebView pede um parâmetro para as props extras; aqui não há nenhuma.
type SemExtras = Record<never, never>;

/**
 * Mapa de verdade (OpenStreetMap) com um pino por ocorrência.
 * Se o mapa não carregar (sem internet, por exemplo), chama `onFalha` para a tela
 * mostrar o mapa ilustrativo no lugar.
 */
export function MapaReal({
  itens,
  selecionado,
  onSelect,
  onFalha,
}: MapaProps & { onFalha: () => void }) {
  const web = useRef<WebView<SemExtras>>(null);
  const [pronto, setPronto] = useState(false);
  const dados = dadosDoMapa(itens, selecionado);

  // Manda os pontos para a página sem recarregar o mapa (filtro, busca e seleção).
  useEffect(() => {
    if (pronto) web.current?.injectJavaScript(`window.atualizar(${dados}); true;`);
  }, [pronto, dados]);

  return (
    <View style={s.mapa}>
      <WebView<SemExtras>
        ref={web}
        originWhitelist={["*"]}
        source={{ html: HTML, baseUrl: MAPA_ORIGEM }}
        applicationNameForUserAgent="SmartRoadCitizenTech"
        onMessage={(e: WebViewMessageEvent) => {
          const m = lerMensagem(e.nativeEvent.data);
          if (m?.tipo === "pronto") setPronto(true);
          else if (m?.tipo === "selecionar") onSelect(m.id);
          else if (m?.tipo === "falha") onFalha();
        }}
        onError={onFalha}
        // O mapa fica com os toques (arrastar e zoom) em vez de rolar a lista.
        nestedScrollEnabled
        overScrollMode="never"
        setSupportMultipleWindows={false}
        accessibilityLabel={`Mapa com ${itens.length} ocorrências. A lista abaixo traz as mesmas informações.`}
        style={s.web}
      />
      <Text style={s.nota}>Dados simulados</Text>
    </View>
  );
}

const s = StyleSheet.create({
  mapa: {
    height: Sizes.mapa,
    backgroundColor: Colors.mapaTerra,
    overflow: "hidden",
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borda,
  },
  web: { flex: 1, backgroundColor: Colors.mapaTerra },
  nota: {
    position: "absolute",
    right: Spacing.sm,
    top: Spacing.sm,
    fontSize: Fonts.pequena,
    color: Colors.textoSuave,
    backgroundColor: Colors.mapaNota,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
});
