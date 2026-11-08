import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts, Sizes, Spacing } from "@/theme";

export function MarcaTitulo() {
  return (
    <View style={s.linha} accessible accessibilityRole="header" accessibilityLabel="SmartRoad">
      <Ionicons name="location" size={Sizes.iconeMarca} color={Colors.branco} />
      <Text style={s.txt}>SmartRoad</Text>
    </View>
  );
}

const s = StyleSheet.create({
  linha: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  txt: { color: Colors.branco, fontSize: Fonts.marca, fontWeight: "800" },
});
