// components/modals/SearchBoatModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useUser } from "../../context/UserContext";

import { useBoats } from "../../context/BoatContext";
import { translateBoatType } from "../../utils/boatTypes";

export default function SearchBoatModal({
  visible,
  onClose,
  onSelectBoat,
  defaultBoatValue = "Seleccionar barco...",
}) {
  const { user } = useUser();
  const { fetchBoats, boatList } = useBoats();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Carga inicial al abrir
  useEffect(() => {
    if (visible) {
      setLoading(true);
      fetchBoats(user._id)
        .catch(() => Alert.alert("Error", "No se pudieron cargar los barcos"))
        .finally(() => setLoading(false));
    }
  }, [visible]);

  // Refresca la lista si cambia la query
  const handleSearch = (text) => {
    setQuery(text);
    setLoading(true);
    fetchBoats(user._id, text)
      .catch(() => Alert.alert("Error", "No se pudieron cargar los barcos"))
      .finally(() => setLoading(false));
  };

  const renderBoat = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onSelectBoat(item);
        onClose();
      }}
    >
      <Text style={styles.itemText}>
        {item.boatName} – {translateBoatType(item.boatType)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.title}>Seleccionar Barco</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre..."
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : boatList.length === 0 ? (
            <Text style={styles.empty}>No hay barcos disponibles</Text>
          ) : (
            <FlatList
              data={boatList}
              keyExtractor={(b) => b._id}
              renderItem={renderBoat}
              style={styles.list}
            />
          )}
          <TouchableOpacity
            style={styles.defaultBtn}
            onPress={() => {
              onSelectBoat(null);
              onClose();
            }}
          >
            <Text style={styles.defaultText}>{defaultBoatValue}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕ Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 8,
    maxHeight: "80%",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  list: {
    marginBottom: 12,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
  },
  empty: {
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
  defaultBtn: {
    padding: 12,
    backgroundColor: "#eef",
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 8,
  },
  defaultText: {
    color: "#333",
    fontWeight: "500",
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    color: "#007bff",
  },
});
