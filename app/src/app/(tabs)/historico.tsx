import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { Botao, Estado, GravidadeTag, StatusTag } from "@/components/ui";
import { useCarregar } from "@/hooks/useCarregar";
import { listarLocais } from "@/services/db";
import { Colors, Fonts, Radius, Spacing } from "@/theme";

export default function Historico() {
  const { dados, carregando, erro, recarregar } = useCarregar(listarLocais);
  return (
    <FlatList
      data={dados ?? []}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ padding: Spacing.md, gap: Spacing.sm }}
      ListHeaderComponent={
        <Text accessibilityRole="header" style={s.titulo}>
          Minhas ocorrências
        </Text>
      }
      ListEmptyComponent={
        carregando ? (
          <Estado tipo="loading" msg="Carregando..." />
        ) : erro ? (
          <Estado
            tipo="erro"
            msg="Não foi possível abrir seu histórico."
            acao={<Botao titulo="Tentar de novo" onPress={recarregar} />}
          />
        ) : (
          <Estado
            tipo="vazio"
            msg="Você ainda não registrou nenhuma ocorrência."
            acao={<Botao titulo="Registrar agora" onPress={() => router.push("/nova")} />}
          />
        )
      }
      renderItem={({ item: o }) => (
        <Link href={{ pathname: "/ocorrencia/[id]", params: { id: o.id } }} asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${o.tipo}, ${o.endereco}, gravidade ${o.gravidade}, ${o.status}`}
            style={s.item}
          >
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
          </Pressable>
        </Link>
      )}
    />
  );
}

const s = StyleSheet.create({
  titulo: {
    fontSize: Fonts.titulo,
    fontWeight: "800",
    color: Colors.texto,
    marginBottom: Spacing.sm,
  },
  item: {
    backgroundColor: Colors.cartao,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borda,
    gap: Spacing.xs,
  },
  topo: { flexDirection: "row", justifyContent: "space-between" },
  id: { fontSize: Fonts.subtitulo, fontWeight: "800", color: Colors.primaria },
  data: { fontSize: Fonts.pequena, color: Colors.textoSuave },
  texto: { fontSize: Fonts.corpo, color: Colors.texto },
  tags: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.xs },
});
