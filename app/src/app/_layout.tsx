import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.marca },
          headerTintColor: Colors.branco,
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor: Colors.fundo },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="ocorrencia/[id]"
          options={{ title: "Detalhe da ocorrência", headerBackTitle: "Voltar" }}
        />
      </Stack>
    </>
  );
}
