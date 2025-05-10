// components/SplashScreen.jsx
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

export default function SplashScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Si tienes un logo, muéstralo */}
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Nombre de la app */}
      <Text style={[styles.title, { color: theme.text }]}>Bitacapp</Text>

      {/* Spinner para indicar carga */}
      <ActivityIndicator
        size="large"
        color={theme.primary}
        style={styles.spinner}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  spinner: {
    marginTop: 8,
  },
});
