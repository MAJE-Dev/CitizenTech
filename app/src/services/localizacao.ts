// Camada de localização (expo-location): pega a posição do celular só quando o cidadão pede.
// A posição não sai do aparelho: fica salva apenas no banco local, junto da ocorrência.
import * as Location from "expo-location";

export interface LocalAtual {
  lat: number;
  lng: number;
  /** Endereço aproximado da posição, quando o aparelho consegue descobrir. */
  endereco?: string;
}

const LIMITE_MS = 15000;
const MSG_SEM_PERMISSAO =
  "Sem permissão para usar a localização. Você pode digitar o endereço abaixo.";
const MSG_FALHA =
  "Não foi possível descobrir sua localização. Veja se o GPS está ligado ou digite o endereço.";

function comLimite<T>(promessa: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolver, rejeitar) => {
    const timer = setTimeout(() => rejeitar(new Error("tempo esgotado")), ms);
    promessa.then(resolver, rejeitar).finally(() => clearTimeout(timer));
  });
}

/** Monta "Rua, número - Bairro" com o que o aparelho devolver. */
async function descobrirEndereco(lat: number, lng: number): Promise<string | undefined> {
  try {
    const [lugar] = await comLimite(
      Location.reverseGeocodeAsync({ latitude: lat, longitude: lng }),
      LIMITE_MS,
    );
    if (!lugar) return undefined;
    const rua = lugar.street ?? lugar.name;
    const ruaNumero = rua && lugar.streetNumber ? `${rua}, ${lugar.streetNumber}` : rua;
    const texto = [ruaNumero, lugar.district ?? lugar.city].filter(Boolean).join(" - ");
    return texto || undefined;
  } catch {
    return undefined; // sem endereço: a pessoa digita, e as coordenadas continuam valendo
  }
}

/**
 * Pede permissão e devolve a posição atual do celular.
 * Lança um erro com mensagem simples quando a permissão é negada ou o GPS não responde.
 */
export async function obterLocalAtual(): Promise<LocalAtual> {
  let permitido = false;
  try {
    permitido = (await Location.requestForegroundPermissionsAsync()).granted;
  } catch {
    throw new Error(MSG_FALHA);
  }
  if (!permitido) throw new Error(MSG_SEM_PERMISSAO);

  let posicao: Location.LocationObject | null = null;
  try {
    posicao = await comLimite(
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      LIMITE_MS,
    );
  } catch {
    // GPS demorou ou falhou: tenta a última posição conhecida.
    posicao = await Location.getLastKnownPositionAsync().catch(() => null);
  }
  if (!posicao) throw new Error(MSG_FALHA);

  const { latitude: lat, longitude: lng } = posicao.coords;
  return { lat, lng, endereco: await descobrirEndereco(lat, lng) };
}
