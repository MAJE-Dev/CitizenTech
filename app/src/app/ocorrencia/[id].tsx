import { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Botao, Cartao, Estado, GravidadeTag, Linha, StatusTag } from "@/components/ui";
import { useCarregar } from "@/hooks/useCarregar";
import { listarComentarios, salvarComentario, type Comentario } from "@/services/db";
import { buscarOcorrencia } from "@/services/ocorrencias";
import { Colors, Fonts, MinTouch, Radius, Spacing } from "@/theme";

export default function Detalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, carregando, erro, recarregar } = useCarregar(() => buscarOcorrencia(id), [id]);
  const [coms, setComs] = useState<Comentario[]>([]);
  const [texto, setTexto] = useState("");

  const carregarComs = useCallback(async () => setComs(await listarComentarios(id)), [id]);
  useEffect(() => {
    carregarComs();
  }, [carregarComs]);

  const enviar = async () => {
    if (!texto.trim()) return;
    await salvarComentario(id, texto.trim());
    setTexto("");
    carregarComs();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: Spacing.md, gap: Spacing.md }}
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
                valor={`${dados.lat.toFixed(4)}, ${dados.lng.toFixed(4)}`}
              />
            </Cartao>
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
              {coms.length === 0 && <Text style={s.suave}>Ainda não há comentários.</Text>}
              {coms.map((c, i) => (
                <View
                  key={i}
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
                onChangeText={setTexto}
                placeholder="Escreva aqui..."
                placeholderTextColor={Colors.textoSuave}
                accessibilityLabel="Escreva um comentário"
                style={s.campo}
              />
              <Botao titulo="Enviar comentário" onPress={enviar} desativado={!texto.trim()} />
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
