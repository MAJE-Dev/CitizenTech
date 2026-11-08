import type { ColorValue } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MarcaTitulo } from "@/components/MarcaTitulo";
import { Colors, Fonts } from "@/theme";

type Icone = keyof typeof Ionicons.glyphMap;
const aba = (titulo: string, icone: Icone) => ({
  title: titulo,
  tabBarAccessibilityLabel: `Aba ${titulo}`,
  tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={icone} size={size} color={color as string} />
  ),
});

export default function TabsLayout() {
  // Sobe a barra para não ficar embaixo dos botões do Android (navegação por gestos ou 3 botões).
  const { bottom } = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.marca },
        headerTitle: () => <MarcaTitulo />,
        headerTitleAlign: "left",
        tabBarActiveTintColor: Colors.primaria,
        tabBarInactiveTintColor: Colors.textoSuave,
        tabBarLabelStyle: { fontSize: Fonts.pequena, fontWeight: "600" },
        tabBarStyle: { height: 64 + bottom, paddingBottom: 8 + bottom, paddingTop: 6 },
        sceneStyle: { backgroundColor: Colors.fundo },
      }}
    >
      <Tabs.Screen name="index" options={aba("Início", "map")} />
      <Tabs.Screen name="nova" options={aba("Registrar", "add-circle")} />
      <Tabs.Screen name="historico" options={aba("Histórico", "time")} />
    </Tabs>
  );
}
