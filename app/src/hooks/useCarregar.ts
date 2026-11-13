import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

/**
 * Carrega dados toda vez que a tela ganha foco, expondo loading, erro e recarregar.
 * - `fn(forcar)`: `forcar` é true quando o usuário pede (Tentar de novo / puxar para atualizar)
 *   e false na recarga automática ao voltar para a tela.
 * - Os dados antigos continuam disponíveis durante a recarga, para a tela não piscar.
 */
export function useCarregar<T>(fn: (forcar: boolean) => Promise<T>, deps: unknown[] = []) {
  const [dados, setDados] = useState<T>();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string>();
  const pedido = useRef(0); // ignora respostas de pedidos antigos que chegarem atrasadas

  const carregar = useCallback(async (forcar: boolean) => {
    const atual = ++pedido.current;
    setCarregando(true);
    setErro(undefined);
    try {
      const resultado = await fn(forcar);
      if (atual === pedido.current) setDados(resultado);
    } catch (e) {
      if (atual === pedido.current)
        setErro(e instanceof Error ? e.message : "Algo deu errado. Tente de novo.");
    } finally {
      if (atual === pedido.current) setCarregando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useFocusEffect(
    useCallback(() => {
      carregar(false);
    }, [carregar]),
  );
  const recarregar = useCallback(() => carregar(true), [carregar]);
  return { dados, carregando, erro, recarregar };
}
