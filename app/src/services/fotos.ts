// Camada de fotos: tirar/escolher a foto (expo-image-picker) e guardá-la no aparelho
// (expo-file-system). A foto não é enviada para nenhum servidor.
import { Directory, File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

const PASTA = "fotos";
const OPCOES: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"], quality: 0.6 };
const MSG_SEM_CAMERA = "Sem permissão para usar a câmera. Você pode escolher uma foto da galeria.";

/** Abre a câmera. Devolve o endereço temporário da foto, ou undefined se a pessoa desistir. */
export async function tirarFoto(): Promise<string | undefined> {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  if (!granted) throw new Error(MSG_SEM_CAMERA);
  const resultado = await ImagePicker.launchCameraAsync(OPCOES);
  return resultado.canceled ? undefined : resultado.assets[0]?.uri;
}

/** Abre a galeria. Devolve o endereço temporário da foto, ou undefined se a pessoa desistir. */
export async function escolherFoto(): Promise<string | undefined> {
  const resultado = await ImagePicker.launchImageLibraryAsync(OPCOES);
  return resultado.canceled ? undefined : resultado.assets[0]?.uri;
}

/**
 * Copia a foto temporária para a pasta do app (para ela não sumir quando o sistema limpar o cache)
 * e devolve o valor que vai para o banco: só o nome do arquivo.
 * Se a cópia não for possível (ex.: navegador), guarda o endereço original.
 */
export async function guardarFoto(uriTemporaria: string): Promise<string> {
  try {
    const pasta = new Directory(Paths.document, PASTA);
    if (!pasta.exists) pasta.create();
    const extensao = /\.(jpe?g|png|webp|heic)$/i.exec(uriTemporaria)?.[1]?.toLowerCase() ?? "jpg";
    const destino = new File(pasta, `foto-${Date.now()}.${extensao}`);
    await new File(uriTemporaria).copy(destino);
    return destino.name;
  } catch {
    return uriTemporaria;
  }
}

/** Converte o valor guardado no banco em um endereço que a tela consegue abrir. */
export function uriDaFoto(guardado: string): string {
  if (guardado.includes(":")) return guardado; // já é um endereço completo
  try {
    return new File(Paths.document, PASTA, guardado).uri;
  } catch {
    return guardado;
  }
}
