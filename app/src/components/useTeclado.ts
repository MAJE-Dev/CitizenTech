// Faz a tela subir quando o teclado abre, deixando o campo em que a pessoa escreve logo acima dele.
// Uso: const t = useTeclado(); <ScrollView ref={t.ref} onScroll={t.onScroll} scrollEventThrottle={16}
//   contentContainerStyle={[..., { paddingBottom: t.espaco }]}> ... <TextInput onFocus={t.revelar} />
import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, Platform, ScrollView, TextInput } from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

const FOLGA = 24; // espaço entre o campo e o teclado

export function useTeclado() {
  const ref = useRef<ScrollView>(null);
  const deslocamento = useRef(0);
  const topoTeclado = useRef<number | null>(null);
  const [espaco, setEspaco] = useState(0);

  const revelar = useCallback(() => {
    // espera o teclado e o espaço extra aparecerem antes de medir
    setTimeout(() => {
      const campo = TextInput.State.currentlyFocusedInput?.();
      const topo = topoTeclado.current;
      if (!campo || topo === null) return;
      campo.measureInWindow((_x, y, _w, altura) => {
        const sobra = y + altura + FOLGA - topo;
        if (sobra > 0) ref.current?.scrollTo({ y: deslocamento.current + sobra, animated: true });
      });
    }, 80);
  }, []);

  useEffect(() => {
    const ios = Platform.OS === "ios";
    const abre = Keyboard.addListener(ios ? "keyboardWillShow" : "keyboardDidShow", (e) => {
      topoTeclado.current = e.endCoordinates.screenY;
      setEspaco(e.endCoordinates.height);
      revelar();
    });
    const fecha = Keyboard.addListener(ios ? "keyboardWillHide" : "keyboardDidHide", () => {
      topoTeclado.current = null;
      setEspaco(0);
    });
    return () => {
      abre.remove();
      fecha.remove();
    };
  }, [revelar]);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    deslocamento.current = e.nativeEvent.contentOffset.y;
  }, []);

  return { ref, onScroll, espaco, revelar };
}
