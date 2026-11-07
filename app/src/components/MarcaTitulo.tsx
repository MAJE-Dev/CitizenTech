import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Fonts, Spacing } from "@/theme";

export function MarcaTitulo() {
  return (
    <View style={s.linha} accessible accessibilityRole="header" accessibilityLabel="SmartRoad">
      <Ionicons name="location" size={26} color="#ffffff" />
      <Text style={s.txt}>SmartRoad</Text>
    </View>
  );
}

const s = StyleSheet.create({
  linha: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  txt: { color: "#ffffff", fontSize: Fonts.marca, fontWeight: "800" },
});
