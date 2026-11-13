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
import { router } from "expo-router";
import { Botao, Chip } from "@/components/ui";
import { GRAVIDADES, registrarOcorrencia, TIPOS, type Gravidade } from "@/services/ocorrencias";
import { Colors, Fonts, MinTouch, Radius, Sizes, Spacing } from "@/theme";

export default function Nova() {
  const [tipo, setTipo] = useState(TIPOS[0]!);
  const [gravidade, setGravidade] = useState<Gravidade>("Moderada");
  const [endereco, setEndereco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const enviar = async () => {
    if (endereco.trim().length < 5) return setErro("Informe o endereço do problema.");
    setSalvando(true);
    try {
      // O protocolo é gerado na camada de serviços, que garante que ele não se repete.
      const { id } = await registrarOcorrencia({
        tipo,
        gravidade,
        endereco: endereco.trim(),
        descricao: descricao.trim(),
      });
      setEndereco("");
      setDescricao("");
      setErro("");
      router.push({ pathname: "/ocorrencia/[id]", params: { id } });
    } catch {
      setErro("Não foi possível salvar agora. Tente de novo.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: Spacing.md, gap: Spacing.lg }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: Spacing.xs }}>
          <Text accessibilityRole="header" style={s.titulo}>
            Registrar ocorrência
          </Text>
          <Text style={s.suave}>Conte o que aconteceu. Leva menos de 1 minuto.</Text>
        </View>

        <View style={{ gap: Spacing.sm }}>
          <Text style={s.rotulo}>Qual é o problema?</Text>
          <View style={s.grade}>
            {TIPOS.map((t) => (
              <Chip key={t} titulo={t} ativo={tipo === t} onPress={() => setTipo(t)} />
            ))}
          </View>
        </View>

        <View style={{ gap: Spacing.sm }}>
          <Text style={s.rotulo}>Qual a gravidade?</Text>
          <View style={s.grade}>
            {GRAVIDADES.map((g) => (
              <Chip key={g} titulo={g} ativo={gravidade === g} onPress={() => setGravidade(g)} />
            ))}
          </View>
        </View>

        <View style={{ gap: Spacing.sm }}>
          <Text style={s.rotulo}>Endereço</Text>
          <TextInput
            value={endereco}
            onChangeText={(t) => {
              setEndereco(t);
              setErro("");
            }}
            placeholder="Ex.: Rua das Flores, 100"
            placeholderTextColor={Colors.textoSuave}
            accessibilityLabel="Endereço do problema"
            style={[s.campo, !!erro && { borderColor: Colors.grave }]}
          />
          {!!erro && (
            <Text accessibilityRole="alert" style={s.erro}>
              {erro}
            </Text>
          )}
        </View>

        <View style={{ gap: Spacing.sm }}>
          <Text style={s.rotulo}>Descrição (opcional)</Text>
          <TextInput
            value={descricao}
            onChangeText={setDescricao}
            multiline
            placeholder="Ex.: buraco grande perto da faixa"
            placeholderTextColor={Colors.textoSuave}
            accessibilityLabel="Descrição do problema"
            style={[
              s.campo,
              {
                minHeight: Sizes.campoMultilinha,
                textAlignVertical: "top",
                paddingTop: Spacing.sm,
              },
            ]}
          />
        </View>

        <Botao
          titulo={salvando ? "Enviando..." : "Enviar ocorrência"}
          onPress={enviar}
          desativado={salvando}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: Fonts.titulo, fontWeight: "800", color: Colors.texto },
  suave: { fontSize: Fonts.corpo, color: Colors.textoSuave },
  rotulo: { fontSize: Fonts.subtitulo, fontWeight: "700", color: Colors.texto },
  grade: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
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
  erro: { fontSize: Fonts.corpo, fontWeight: "700", color: Colors.grave },
});
