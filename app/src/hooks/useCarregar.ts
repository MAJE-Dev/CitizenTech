import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

/** Carrega dados toda vez que a tela ganha foco, expondo loading, erro e recarregar. */
export function useCarregar<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [dados, setDados] = useState<T>();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string>();

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(undefined);
    try {
      setDados(await fn());
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Algo deu errado. Tente de novo.");
    } finally {
      setCarregando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );
  return { dados, carregando, erro, recarregar: carregar };
}
