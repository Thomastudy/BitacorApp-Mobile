// components/BoatTypePicker.jsx
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../../context/ThemeContext";
import { boatTypesFrontend } from "../../utils/boatTypes";

export default function BoatTypePicker({ boatType, onChange }) {
  const { theme } = useTheme();

  return (
    <View style={[{ borderColor: theme.border }]}>
      <Picker
        selectedValue={boatType}
        onValueChange={onChange}
        mode="dropdown"
        style={[
          styles.picker,
          {
            color: theme.text,
            backgroundColor: theme.backgroundSecondary,
          },
        ]}
        itemStyle={[
          styles.item,
          {
            color: theme.text,
          },
        ]}
        dropdownIconColor={theme.textSecondary}
      >
        <Picker.Item label="Selecciona tipo..." value="" color={theme.textSecondary} />
        {boatTypesFrontend.map((bt) => (
          <Picker.Item key={bt} label={bt} value={bt} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    overflow: "hidden", // para que respete el borderRadius en Android
  },
  picker: {
    height: Platform.OS === "ios" ? 200 : 50, // iOS muestra rueda, Android dropdown
    width: "100%",
  },
  item: {
    height: 44, // sólo aplica en iOS
  },
});
