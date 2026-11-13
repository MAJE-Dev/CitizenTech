import { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Botao, Cartao, Chip, Estado, GravidadeTag, Linha, StatusTag } from "@/components/ui";
import { Mapa } from "@/components/Mapa";
import { useCarregar } from "@/hooks/useCarregar";
import { listarOcorrencias, TIPOS } from "@/services/ocorrencias";
import { Colors, Fonts, MinTouch, Radius, Sizes, Spacing } from "@/theme";

export default function Inicio() {
  const [simularErro, setSimularErro] = useState(false);
  const { dados, carregando, erro, recarregar } = useCarregar(
    (forcar) => listarOcorrencias({ simularErro, forcar }),
    [simularErro],
  );
  // Só mostra "Carregando" na primeira vez; depois a lista fica na tela enquanto atualiza.
  const primeiraCarga = carregando && !dados;
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
      data={primeiraCarga || erro ? [] : itens}
      keyExtractor={(o) => o.id}
      refreshing={carregando && !primeiraCarga}
      onRefresh={recarregar}
      contentContainerStyle={{ padding: Spacing.md, gap: Spacing.sm }}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={{ gap: Spacing.md }}>
          <View style={s.demo}>
            <Ionicons name="construct" size={Sizes.iconeAviso} color={Colors.texto} />
            <View style={{ flex: 1 }}>
              <Text style={s.demoTitulo}>Simular erro de conexão</Text>
              <Text style={s.demoTexto}>Para demonstração: mostra a tela de erro.</Text>
            </View>
            <Switch
              value={simularErro}
              onValueChange={setSimularErro}
              accessibilityLabel="Simular erro de conexão"
              accessibilityHint="Liga ou desliga a demonstração da tela de erro"
              trackColor={{ false: Colors.borda, true: Colors.primaria }}
              thumbColor={Colors.branco}
            />
          </View>
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
          {!primeiraCarga && !erro && (
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
          {primeiraCarga && <Estado tipo="loading" msg="Carregando ocorrências..." />}
          {erro && (
            <Estado
              tipo="erro"
              msg={erro}
              acao={
                <Botao
                  titulo="Tentar de novo"
                  onPress={() => {
                    // Desliga a simulação (a chave do topo volta) e busca de novo.
                    if (simularErro) setSimularErro(false);
                    else recarregar();
                  }}
                />
              }
            />
          )}
          {dados && !erro && itens.length === 0 && (
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
  demo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    minHeight: MinTouch,
    backgroundColor: Colors.avisoFundo,
    borderWidth: 1,
    borderColor: Colors.destaque,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  demoTitulo: { fontSize: Fonts.corpo, fontWeight: "700", color: Colors.texto },
  demoTexto: { fontSize: Fonts.pequena, color: Colors.texto },
  aviso: {
    fontSize: Fonts.pequena,
    color: Colors.texto,
    backgroundColor: Colors.avisoFundo,
    borderWidth: 1,
    borderColor: Colors.destaque,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  id: { fontSize: Fonts.subtitulo, fontWeight: "800", color: Colors.primaria },
  data: { fontSize: Fonts.pequena, color: Colors.textoSuave },
  texto: { fontSize: Fonts.corpo, color: Colors.texto },
  tags: { flexDirection: "row", gap: Spacing.sm, marginVertical: Spacing.xs },
});
