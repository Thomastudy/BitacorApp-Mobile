// components/BaseHeader.jsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export default function BaseHeader({ navigation, route, options, back }) {
  const title =
    options.headerTitle !== undefined ? options.headerTitle : options.title; // fallback

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {back ? (
          <TouchableOpacity onPress={navigation.goBack} style={styles.backBtn}>
            <Text>{"<-"} </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}

        <Text style={styles.title}>{title}</Text>

        {options.headerRight ? (
          options.headerRight()
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea:{backgroundColor:"#023850", height:"10"},
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "#023850",
    height: 60,
    color: "#fff",
  },
  backBtn: { width: 60 },
  spacer: { width: 60 },
  title: { fontSize: 22, fontWeight: "600", color: "#fff" },
});
