import { Image, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, Sizes, Spacing } from "@/theme";

/** Logo do SmartRoad (pino de mapa com uma rua) + nome, usado na barra do topo. */
export function MarcaTitulo() {
  return (
    <View style={s.linha} accessible accessibilityRole="header" accessibilityLabel="SmartRoad">
      <Image
        source={require("../../assets/images/logo-marca.png")}
        style={s.logo}
        accessibilityIgnoresInvertColors
      />
      <Text style={s.txt}>SmartRoad</Text>
    </View>
  );
}

const s = StyleSheet.create({
  linha: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  logo: { width: Sizes.iconeMarca, height: Sizes.iconeMarca },
  txt: { color: Colors.branco, fontSize: Fonts.marca, fontWeight: "800" },
});
