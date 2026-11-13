import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useTeclado } from "@/components/useTeclado";
import { router } from "expo-router";
import { Botao, Chip } from "@/components/ui";
import { escolherFoto, tirarFoto } from "@/services/fotos";
import { obterLocalAtual } from "@/services/localizacao";
import { GRAVIDADES, registrarOcorrencia, TIPOS, type Gravidade } from "@/services/ocorrencias";
import { Colors, Fonts, MinTouch, Radius, Sizes, Spacing } from "@/theme";

const mensagem = (e: unknown, padrao: string) => (e instanceof Error ? e.message : padrao);

export default function Nova() {
  const teclado = useTeclado();
  const [tipo, setTipo] = useState(TIPOS[0]!);
  const [gravidade, setGravidade] = useState<Gravidade>("Moderada");
  const [endereco, setEndereco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState<{ lat: number; lng: number }>();
  const [localizando, setLocalizando] = useState(false);
  const [avisoLocal, setAvisoLocal] = useState("");
  const [fotoUri, setFotoUri] = useState<string>();
  const [avisoFoto, setAvisoFoto] = useState("");
  const [erroEndereco, setErroEndereco] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");
  const [salvando, setSalvando] = useState(false);

  const usarLocalizacao = async () => {
    setLocalizando(true);
    setAvisoLocal("");
    try {
      const atual = await obterLocalAtual();
      setLocal({ lat: atual.lat, lng: atual.lng });
      if (atual.endereco) {
        setEndereco(atual.endereco);
        setErroEndereco("");
      } else {
        setAvisoLocal("Localização marcada. Não achamos o nome da rua: digite o endereço.");
      }
    } catch (e) {
      setAvisoLocal(mensagem(e, "Não foi possível descobrir sua localização."));
    } finally {
      setLocalizando(false);
    }
  };

  const pegarFoto = async (origem: () => Promise<string | undefined>) => {
    setAvisoFoto("");
    try {
      const uri = await origem();
      if (uri) setFotoUri(uri);
    } catch (e) {
      setAvisoFoto(mensagem(e, "Não foi possível abrir a foto. Tente de novo."));
    }
  };

  const enviar = async () => {
    if (endereco.trim().length < 5) return setErroEndereco("Informe o endereço do problema.");
    setSalvando(true);
    setErroEnvio("");
    try {
      // O protocolo é gerado na camada de serviços, que garante que ele não se repete.
      const { id } = await registrarOcorrencia({
        tipo,
        gravidade,
        endereco: endereco.trim(),
        descricao: descricao.trim(),
        local,
        fotoUri,
      });
      setEndereco("");
      setDescricao("");
      setLocal(undefined);
      setAvisoLocal("");
      setFotoUri(undefined);
      router.push({ pathname: "/ocorrencia/[id]", params: { id } });
    } catch {
      setErroEnvio("Não foi possível salvar agora. Seus dados continuam aqui: tente de novo.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={teclado.ref}
        onScroll={teclado.onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          padding: Spacing.md,
          paddingBottom: Spacing.md + teclado.espaco,
          gap: Spacing.lg,
        }}
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
          <Text style={s.rotulo}>Onde fica?</Text>
          <Botao
            secundario
            icone="locate"
            titulo={localizando ? "Procurando você..." : "Usar minha localização"}
            rotulo="Usar minha localização para preencher o endereço"
            onPress={usarLocalizacao}
            desativado={localizando}
          />
          {!!local && (
            <Text accessibilityLiveRegion="polite" style={s.ok}>
              Localização marcada: {local.lat.toFixed(4)}, {local.lng.toFixed(4)}. Ela fica salva só
              neste aparelho.
            </Text>
          )}
          {!!avisoLocal && (
            <Text accessibilityRole="alert" style={s.aviso}>
              {avisoLocal}
            </Text>
          )}
          <TextInput
            value={endereco}
            onChangeText={(t) => {
              setEndereco(t);
              setErroEndereco("");
              setAvisoLocal("");
            }}
            placeholder="Ex.: Rua das Flores, 100"
            placeholderTextColor={Colors.textoSuave}
            accessibilityLabel="Endereço do problema"
            onFocus={teclado.revelar}
            style={[s.campo, !!erroEndereco && { borderColor: Colors.grave }]}
          />
          {!!erroEndereco && (
            <Text accessibilityRole="alert" style={s.erro}>
              {erroEndereco}
            </Text>
          )}
        </View>

        <View style={{ gap: Spacing.sm }}>
          <Text style={s.rotulo}>Foto (opcional)</Text>
          {fotoUri ? (
            <>
              <Image
                source={{ uri: fotoUri }}
                style={s.foto}
                contentFit="cover"
                accessibilityLabel="Foto escolhida para a ocorrência"
              />
              <Botao
                secundario
                icone="trash"
                titulo="Remover foto"
                onPress={() => setFotoUri(undefined)}
              />
            </>
          ) : (
            <View style={s.grade}>
              <Botao
                secundario
                icone="camera"
                titulo="Tirar foto"
                onPress={() => pegarFoto(tirarFoto)}
                estilo={s.metade}
              />
              <Botao
                secundario
                icone="images"
                titulo="Galeria"
                rotulo="Escolher foto da galeria"
                onPress={() => pegarFoto(escolherFoto)}
                estilo={s.metade}
              />
            </View>
          )}
          {!!avisoFoto && (
            <Text accessibilityRole="alert" style={s.aviso}>
              {avisoFoto}
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
            onFocus={teclado.revelar}
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

        <View style={{ gap: Spacing.sm }}>
          {!!erroEnvio && (
            <Text accessibilityRole="alert" style={s.erro}>
              {erroEnvio}
            </Text>
          )}
          <Botao
            titulo={salvando ? "Enviando..." : "Enviar ocorrência"}
            onPress={enviar}
            desativado={salvando}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: Fonts.titulo, fontWeight: "800", color: Colors.texto },
  suave: { fontSize: Fonts.corpo, color: Colors.textoSuave },
  rotulo: { fontSize: Fonts.subtitulo, fontWeight: "700", color: Colors.texto },
  grade: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  metade: { flexGrow: 1, flexBasis: 0 },
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
  foto: {
    height: Sizes.foto,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borda,
    backgroundColor: Colors.cartao,
  },
  ok: { fontSize: Fonts.pequena, fontWeight: "700", color: Colors.concluida },
  aviso: {
    fontSize: Fonts.pequena,
    color: Colors.texto,
    backgroundColor: Colors.avisoFundo,
    borderWidth: 1,
    borderColor: Colors.destaque,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  erro: { fontSize: Fonts.corpo, fontWeight: "700", color: Colors.grave },
});
