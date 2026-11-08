import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, router } from "expo-router";
import { Botao, Cartao, Chip, Estado, GravidadeTag, Linha, StatusTag } from "@/components/ui";
import { Mapa } from "@/components/Mapa";
import { useCarregar } from "@/hooks/useCarregar";
import { listarOcorrencias, TIPOS } from "@/services/ocorrencias";
import { Colors, Fonts, MinTouch, Radius, Spacing } from "@/theme";

export default function Inicio() {
  const [simularErro, setSimularErro] = useState(false);
  const { dados, carregando, erro, recarregar } = useCarregar(
    () => listarOcorrencias({ simularErro }),
    [simularErro],
  );
  const [filtro, setFiltro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [sel, setSel] = useState<string>();

  const itens = (dados?.itens ?? []).filter(
    (o) =>
      (!filtro || o.tipo === filtro) &&
      (o.endereco + o.id).toLowerCase().includes(busca.toLowerCase()),
  );
  const atual = itens.find((o) => o.id === sel);

  return (
    <FlatList
      data={carregando || erro ? [] : itens}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ padding: Spacing.md, gap: Spacing.sm }}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={{ gap: Spacing.md }}>
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar endereço ou protocolo"
            placeholderTextColor={Colors.textoSuave}
            accessibilityLabel="Buscar por endereço ou protocolo"
            style={s.busca}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: Spacing.sm }}
          >
            {[null, ...TIPOS].map((t) => (
              <Chip
                key={t ?? "todos"}
                titulo={t ?? "Todos"}
                rotulo={t ? `Filtrar por ${t}` : "Mostrar todos os tipos"}
                ativo={filtro === t}
                onPress={() => setFiltro(t)}
              />
            ))}
          </ScrollView>
          {!carregando && !erro && (
            <>
              {dados?.offline && (
                <Text accessibilityRole="alert" style={s.aviso}>
                  Sem internet agora. Mostrando as ocorrências de exemplo que estão salvas no app.
                </Text>
              )}
              <Mapa itens={itens} selecionado={sel} onSelect={setSel} />
              {atual && (
                <Cartao>
                  <Text style={s.id}>{atual.id}</Text>
                  <View style={s.tags}>
                    <GravidadeTag g={atual.gravidade} />
                    <StatusTag st={atual.status} />
                  </View>
                  <Linha rotulo="Tipo" valor={atual.tipo} />
                  <Linha rotulo="Endereço" valor={atual.endereco} />
                  <Botao
                    titulo="Ver detalhes"
                    rotulo={`Ver detalhes da ocorrência ${atual.id}`}
                    onPress={() =>
                      router.push({ pathname: "/ocorrencia/[id]", params: { id: atual.id } })
                    }
                  />
                </Cartao>
              )}
            </>
          )}
          {carregando && <Estado tipo="loading" msg="Carregando ocorrências..." />}
          {erro && (
            <Estado
              tipo="erro"
              msg={erro}
              acao={
                <Botao
                  titulo="Tentar de novo"
                  onPress={() => {
                    setSimularErro(false);
                    if (!simularErro) recarregar();
                  }}
                />
              }
            />
          )}
          {dados && !carregando && !erro && itens.length === 0 && (
            <Estado tipo="vazio" msg="Nenhuma ocorrência encontrada. Tente outro filtro." />
          )}
        </View>
      }
      renderItem={({ item: o }) => (
        <Link href={{ pathname: "/ocorrencia/[id]", params: { id: o.id } }} asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${o.tipo}, ${o.endereco}, gravidade ${o.gravidade}, ${o.status}`}
            style={s.item}
          >
            <View style={{ gap: Spacing.xs }}>
              <View style={s.topo}>
                <Text style={s.id}>{o.id}</Text>
                <Text style={s.data}>{o.abertaEm}</Text>
              </View>
              <Text style={s.texto}>
                {o.tipo} · {o.endereco}
              </Text>
              <View style={s.tags}>
                <GravidadeTag g={o.gravidade} />
                <StatusTag st={o.status} />
              </View>
            </View>
          </Pressable>
        </Link>
      )}
      ListFooterComponent={
        <Botao
          secundario
          titulo={simularErro ? "Desligar erro simulado" : "Simular erro de conexão"}
          onPress={() => setSimularErro((v) => !v)}
          estilo={{ marginTop: Spacing.md }}
        />
      }
    />
  );
}

const s = StyleSheet.create({
  busca: {
    minHeight: MinTouch,
    borderWidth: 1,
    borderColor: Colors.borda,
    borderRadius: Radius.md,
    backgroundColor: Colors.cartao,
    paddingHorizontal: Spacing.md,
    fontSize: Fonts.corpo,
    color: Colors.texto,
  },
  item: {
    backgroundColor: Colors.cartao,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borda,
    overflow: "hidden",
  },
  topo: { flexDirection: "row", justifyContent: "space-between" },
  aviso: {
    fontSize: Fonts.pequena,
    color: Colors.texto,
    backgroundColor: Colors.cartao,
    borderWidth: 1,
    borderColor: Colors.moderada,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  id: { fontSize: Fonts.subtitulo, fontWeight: "800", color: Colors.primaria },
  data: { fontSize: Fonts.pequena, color: Colors.textoSuave },
  texto: { fontSize: Fonts.corpo, color: Colors.texto },
  tags: { flexDirection: "row", gap: Spacing.sm, marginVertical: Spacing.xs },
});
