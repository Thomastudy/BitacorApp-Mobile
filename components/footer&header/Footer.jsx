// components/Footer.jsx
import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import { useTheme } from "../../context/ThemeContext";
import AddVoyageButton from "../voyage/AddVoyageButton";

export default function Footer({ navigation }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundSecondary,
          borderTopColor: theme.border,
        },
      ]}
    >
      {/* Ejemplo de un botón Home */}
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={{ color: theme.text, fontSize: 16 }}>Home</Text>
      </TouchableOpacity>

      {/* Tu botón central de Agregar navegada */}
      <AddVoyageButton />

      {/* Ejemplo de otro botón, p.ej. Perfil */}
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Text style={{ color: theme.text, fontSize: 16 }}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    elevation: 8, // sombra en Android
    shadowColor: "#000",
    shadowOpacity: 0.1, // sombra iOS
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
});
