import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Botao, Cartao, Estado, GravidadeTag, Linha, StatusTag } from "@/components/ui";
import { useCarregar } from "@/hooks/useCarregar";
import { listarComentarios, salvarComentario } from "@/services/db";
import { uriDaFoto } from "@/services/fotos";
import { buscarOcorrencia } from "@/services/ocorrencias";
import { Colors, Fonts, MinTouch, Radius, Sizes, Spacing } from "@/theme";

export default function Detalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom } = useSafeAreaInsets();
  const { dados, carregando, erro, recarregar } = useCarregar(() => buscarOcorrencia(id), [id]);
  // Comentários têm carregamento e erro próprios: uma falha aqui não derruba o resto da tela.
  const comentarios = useCarregar(() => listarComentarios(id), [id]);
  const coms = comentarios.dados ?? [];
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");
  const [fotoFalhou, setFotoFalhou] = useState(false);

  const enviar = async () => {
    const limpo = texto.trim();
    if (!limpo || enviando) return;
    setEnviando(true);
    setErroEnvio("");
    try {
      await salvarComentario(id, limpo);
      setTexto("");
      comentarios.recarregar();
    } catch {
      // O texto continua no campo para a pessoa não precisar digitar de novo.
      setErroEnvio("Não foi possível enviar o comentário. Seu texto continua aqui: tente de novo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          padding: Spacing.md,
          paddingBottom: Spacing.md + bottom,
          gap: Spacing.md,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {carregando && <Estado tipo="loading" msg="Carregando detalhes..." />}
        {erro && (
          <Estado
            tipo="erro"
            msg="Não conseguimos abrir esta ocorrência."
            acao={<Botao titulo="Tentar de novo" onPress={recarregar} />}
          />
        )}
        {!carregando && !erro && !dados && <Estado tipo="vazio" msg="Ocorrência não encontrada." />}
        {dados && (
          <>
            <View style={{ gap: Spacing.sm }}>
              <Text accessibilityRole="header" style={s.titulo}>
                {dados.id}
              </Text>
              <View style={s.tags}>
                <GravidadeTag g={dados.gravidade} />
                <StatusTag st={dados.status} />
              </View>
            </View>
            <Cartao>
              <Linha rotulo="Aberta em" valor={dados.abertaEm} />
              <Linha rotulo="Endereço" valor={dados.endereco} />
              <Linha
                rotulo="Coordenadas"
                valor={`${dados.lat.toFixed(4)}, ${dados.lng.toFixed(4)}${
                  dados.localReal === 0 ? " (aproximadas)" : ""
                }`}
              />
            </Cartao>
            {!!dados.foto && !fotoFalhou && (
              <Image
                source={{ uri: uriDaFoto(dados.foto) }}
                style={s.foto}
                contentFit="cover"
                accessibilityLabel="Foto do problema enviada no registro"
                onError={() => setFotoFalhou(true)}
              />
            )}
            <Cartao>
              <Linha rotulo="Tipo" valor={dados.tipo} />
              <Linha rotulo="Andamento" valor={dados.andamento} />
              <Linha rotulo="Última atualização" valor={dados.atualizadaEm} />
              <Linha rotulo="Descrição" valor={dados.descricao} />
            </Cartao>
            <Cartao estilo={{ gap: Spacing.sm }}>
              <Text accessibilityRole="header" style={s.subtitulo}>
                Comentários
              </Text>
              {comentarios.carregando && !comentarios.dados && (
                <Estado tipo="loading" msg="Carregando comentários..." />
              )}
              {comentarios.erro && (
                <Estado
                  tipo="erro"
                  msg="Não foi possível carregar os comentários."
                  acao={<Botao titulo="Tentar de novo" onPress={comentarios.recarregar} />}
                />
              )}
              {comentarios.dados && !comentarios.erro && coms.length === 0 && (
                <Text style={s.suave}>Ainda não há comentários.</Text>
              )}
              {!comentarios.erro &&
                coms.map((c) => (
                  <View
                    key={c.id}
                    style={s.com}
                    accessible
                    accessibilityLabel={`Comentário: ${c.texto}. ${c.data}`}
                  >
                    <Text style={s.comTxt}>{c.texto}</Text>
                    <Text style={s.data}>{c.data}</Text>
                  </View>
                ))}
              <TextInput
                value={texto}
                onChangeText={(t) => {
                  setTexto(t);
                  setErroEnvio("");
                }}
                placeholder="Escreva aqui..."
                placeholderTextColor={Colors.textoSuave}
                accessibilityLabel="Escreva um comentário"
                style={[s.campo, !!erroEnvio && { borderColor: Colors.grave }]}
              />
              {!!erroEnvio && (
                <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={s.erro}>
                  {erroEnvio}
                </Text>
              )}
              <Botao
                titulo={enviando ? "Enviando..." : "Enviar comentário"}
                onPress={enviar}
                desativado={!texto.trim() || enviando}
              />
            </Cartao>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: Fonts.titulo, fontWeight: "800", color: Colors.primaria },
  subtitulo: { fontSize: Fonts.subtitulo, fontWeight: "700", color: Colors.texto },
  suave: { fontSize: Fonts.corpo, color: Colors.textoSuave },
  tags: { flexDirection: "row", gap: Spacing.sm },
  com: { backgroundColor: Colors.fundo, borderRadius: Radius.sm, padding: Spacing.sm },
  comTxt: { fontSize: Fonts.corpo, color: Colors.texto },
  data: { fontSize: Fonts.pequena, color: Colors.textoSuave },
  erro: { fontSize: Fonts.corpo, fontWeight: "700", color: Colors.grave },
  foto: {
    height: Sizes.foto,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borda,
    backgroundColor: Colors.cartao,
  },
  campo: {
    minHeight: MinTouch,
    borderWidth: 1,
    borderColor: Colors.borda,
    borderRadius: Radius.md,
    backgroundColor: Colors.cartao,
    paddingHorizontal: Spacing.md,
    fontSize: Fonts.corpo,
    color: Colors.texto,
  },
});
