// Versão para navegador (expo start --web): o mesmo mapa, dentro de um iframe.
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Colors, Radius, Sizes } from "@/theme";
import { dadosDoMapa, type MapaProps } from "./mapaDados";
import { htmlDoMapa, lerMensagem } from "./mapaHtml";

const HTML = htmlDoMapa();

export function MapaReal({
  itens,
  selecionado,
  onSelect,
  onFalha,
}: MapaProps & { onFalha: () => void }) {
  const quadro = useRef<HTMLIFrameElement>(null);
  const [pronto, setPronto] = useState(false);
  const dados = dadosDoMapa(itens, selecionado);

  useEffect(() => {
    const ouvir = (e: MessageEvent) => {
      if (e.source !== quadro.current?.contentWindow) return;
      const m = lerMensagem(e.data);
      if (m?.tipo === "pronto") setPronto(true);
      else if (m?.tipo === "selecionar") onSelect(m.id);
      else if (m?.tipo === "falha") onFalha();
    };
    window.addEventListener("message", ouvir);
    return () => window.removeEventListener("message", ouvir);
  }, [onSelect, onFalha]);

  useEffect(() => {
    if (pronto) quadro.current?.contentWindow?.postMessage(dados, "*");
  }, [pronto, dados]);

  return (
    <View
      style={{
        height: Sizes.mapa,
        overflow: "hidden",
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Colors.borda,
      }}
    >
      <iframe
        ref={quadro}
        srcDoc={HTML}
        title={`Mapa com ${itens.length} ocorrências`}
        style={{ border: 0, width: "100%", height: "100%" }}
      />
    </View>
  );
}
