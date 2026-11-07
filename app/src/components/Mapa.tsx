import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts, Radius, Spacing } from "@/theme";
import type { Gravidade, Ocorrencia } from "@/services/ocorrencias";

const corPino: Record<Gravidade, string> = {
  Grave: Colors.grave,
  Moderada: Colors.moderada,
  Leve: Colors.leve,
};

/** Mapa ilustrativo: posiciona as ocorrências em % sobre um fundo simples. */
export function Mapa({
  itens,
  selecionado,
  onSelect,
}: {
  itens: Ocorrencia[];
  selecionado?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={s.mapa} accessibilityLabel={`Mapa ilustrativo com ${itens.length} ocorrências`}>
      <View style={[s.parque, { left: "60%", top: "40%", width: "15%", height: "12%" }]} />
      <View style={[s.parque, { left: "8%", top: "10%", width: "10%", height: "14%" }]} />
      {[15, 35, 50, 75, 90].map((y) => (
        <View key={`h${y}`} style={[s.rua, { top: `${y}%`, left: 0, right: 0, height: 6 }]} />
      ))}
      {[20, 40, 60, 85].map((x) => (
        <View key={`v${x}`} style={[s.rua, { left: `${x}%`, top: 0, bottom: 0, width: 6 }]} />
      ))}
      {itens.map((o) => {
        const ativo = selecionado === o.id;
        const tam = ativo ? 44 : 36;
        return (
          <Pressable
            key={o.id}
            onPress={() => onSelect(o.id)}
            accessibilityRole="button"
            accessibilityLabel={`${o.tipo}, gravidade ${o.gravidade}, ${o.endereco}`}
            style={[
              s.pino,
              {
                left: `${o.x}%`,
                top: `${o.y}%`,
                width: tam,
                height: tam,
                marginLeft: -tam / 2,
                marginTop: -tam / 2,
                backgroundColor: corPino[o.gravidade],
              },
              ativo && s.pinoAtivo,
            ]}
          >
            <Ionicons name="location" size={ativo ? 24 : 20} color="#ffffff" />
          </Pressable>
        );
      })}
      <Text style={s.nota}>Mapa ilustrativo · dados simulados</Text>
    </View>
  );
}

const s = StyleSheet.create({
  mapa: {
    height: 260,
    backgroundColor: Colors.mapaTerra,
    overflow: "hidden",
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borda,
  },
  parque: { position: "absolute", backgroundColor: Colors.mapaParque, borderRadius: Radius.sm },
  rua: { position: "absolute", backgroundColor: Colors.mapaRua },
  pino: {
    position: "absolute",
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  pinoAtivo: { borderColor: Colors.primaria, borderWidth: 3 },
  nota: {
    position: "absolute",
    right: Spacing.sm,
    bottom: Spacing.sm,
    fontSize: Fonts.pequena,
    color: Colors.textoSuave,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
});
