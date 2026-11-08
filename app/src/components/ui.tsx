import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Colors, Fonts, MinTouch, Radius, Sizes, Spacing } from "@/theme";
import type { Gravidade, Status } from "@/services/ocorrencias";

export function Botao({
  titulo,
  onPress,
  rotulo,
  secundario,
  desativado,
  estilo,
}: {
  titulo: string;
  onPress: () => void;
  rotulo?: string;
  secundario?: boolean;
  desativado?: boolean;
  estilo?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desativado}
      accessibilityRole="button"
      accessibilityLabel={rotulo ?? titulo}
      accessibilityState={{ disabled: !!desativado }}
      style={({ pressed }) => [
        s.botao,
        secundario && s.botaoSec,
        pressed && { opacity: 0.8 },
        desativado && { opacity: 0.5 },
        estilo,
      ]}
    >
      <Text style={[s.botaoTxt, secundario && { color: Colors.primaria }]}>{titulo}</Text>
    </Pressable>
  );
}

export function Chip({
  titulo,
  ativo,
  onPress,
  rotulo,
}: {
  titulo: string;
  ativo: boolean;
  onPress: () => void;
  rotulo?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotulo ?? titulo}
      accessibilityState={{ selected: ativo }}
      style={[s.chip, ativo && { backgroundColor: Colors.primaria, borderColor: Colors.primaria }]}
    >
      <Text style={[s.chipTxt, ativo && { color: Colors.primariaTexto, fontWeight: "700" }]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

export function Cartao({
  children,
  estilo,
}: {
  children: ReactNode;
  estilo?: StyleProp<ViewStyle>;
}) {
  return <View style={[s.cartao, estilo]}>{children}</View>;
}

export function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={s.linha} accessible accessibilityLabel={`${rotulo}: ${valor}`}>
      <Text style={s.linhaRotulo}>{rotulo}</Text>
      <Text style={s.linhaValor}>{valor}</Text>
    </View>
  );
}

const gravCor: Record<Gravidade, { bg: string; fg: string }> = {
  Grave: { bg: Colors.grave, fg: Colors.branco },
  Moderada: { bg: Colors.moderada, fg: Colors.texto },
  Leve: { bg: Colors.leve, fg: Colors.texto },
};
const statusCor: Record<Status, { bg: string; fg: string }> = {
  Recebida: { bg: Colors.cartao, fg: Colors.texto },
  "Em andamento": { bg: Colors.progresso, fg: Colors.branco },
  Concluída: { bg: Colors.concluida, fg: Colors.branco },
};

export const GravidadeTag = ({ g }: { g: Gravidade }) => (
  <Text
    accessibilityLabel={`Gravidade ${g}`}
    style={[s.tag, { backgroundColor: gravCor[g].bg, color: gravCor[g].fg }]}
  >
    ● {g}
  </Text>
);
export const StatusTag = ({ st }: { st: Status }) => (
  <Text
    accessibilityLabel={`Situação: ${st}`}
    style={[
      s.tag,
      { backgroundColor: statusCor[st].bg, color: statusCor[st].fg },
      st === "Recebida" && { borderWidth: 1, borderColor: Colors.borda },
    ]}
  >
    {st}
  </Text>
);

export function Estado({
  tipo,
  msg,
  acao,
}: {
  tipo: "loading" | "erro" | "vazio";
  msg: string;
  acao?: ReactNode;
}) {
  return (
    <View
      style={s.estado}
      accessibilityRole={tipo === "erro" ? "alert" : undefined}
      accessibilityLiveRegion="polite"
    >
      {tipo === "loading" && (
        <ActivityIndicator size="large" color={Colors.primaria} accessibilityLabel="Carregando" />
      )}
      <Text style={[s.estadoTxt, tipo === "erro" && { color: Colors.grave, fontWeight: "700" }]}>
        {msg}
      </Text>
      {acao}
    </View>
  );
}

const s = StyleSheet.create({
  botao: {
    minHeight: MinTouch,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaria,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primaria,
  },
  botaoSec: { backgroundColor: Colors.cartao },
  botaoTxt: { color: Colors.primariaTexto, fontSize: Fonts.subtitulo, fontWeight: "700" },
  chip: {
    minHeight: Sizes.chip,
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borda,
    backgroundColor: Colors.cartao,
  },
  chipTxt: { fontSize: Fonts.corpo, color: Colors.texto },
  cartao: {
    backgroundColor: Colors.cartao,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borda,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  linhaRotulo: { fontSize: Fonts.corpo, color: Colors.textoSuave },
  linhaValor: {
    fontSize: Fonts.corpo,
    color: Colors.texto,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "right",
  },
  tag: {
    fontSize: Fonts.pequena,
    fontWeight: "700",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    overflow: "hidden",
  },
  estado: { alignItems: "center", gap: Spacing.md, padding: Spacing.xl },
  estadoTxt: { fontSize: Fonts.corpo, color: Colors.textoSuave, textAlign: "center" },
});
