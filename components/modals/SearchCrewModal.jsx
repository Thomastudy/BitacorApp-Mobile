// components/modals/SearchCrewModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import axiosInstance from "../../config/axios";

export default function SearchCrewModal({
  visible,
  onClose,
  onSelectCrewMember,
  onSelectGuestCrew,
  guestNeeded = true,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lanza la búsqueda cuando cambia el texto
  useEffect(() => {
    const fetch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/sessions/search?username=${encodeURIComponent(searchQuery)}`
        );
        setSearchResults(response.data.data || []);
      } catch (error) {
        console.error("Error searching crew members:", error);
        Alert.alert("Error", "No se pudieron cargar los tripulantes");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onSelectCrewMember(item);
        onClose();
      }}
    >
      <Text style={styles.username}>@{item.userName}</Text>
      <Text style={styles.name}>
        {item.first_name} {item.last_name}
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
          {/* Header con input y cerrar */}
          <View style={styles.header}>
            <TextInput
              style={styles.input}
              placeholder="Agregar tripulante..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              clearButtonMode="while-editing"
            />
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Resultados */}
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(u) => u._id}
              renderItem={renderItem}
              ListEmptyComponent={
                guestNeeded && searchQuery.trim() ? (
                  <TouchableOpacity
                    style={styles.guestItem}
                    onPress={() => {
                      onSelectGuestCrew(searchQuery.trim());
                      onClose();
                    }}
                  >
                    <Text style={styles.guestTxt}>
                      Agregar como invitado: "{searchQuery.trim()}"
                    </Text>
                  </TouchableOpacity>
                ) : (
                  searchQuery.trim() && (
                    <Text style={styles.emptyTxt}>
                      No se encontraron resultados
                    </Text>
                  )
                )
              }
              style={styles.list}
            />
          )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: Platform.OS === "ios" ? 12 : 8,
  },
  closeBtn: {
    marginLeft: 12,
  },
  closeTxt: {
    fontSize: 24,
    color: "#333",
  },
  list: {
    marginTop: 12,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  username: {
    fontWeight: "600",
  },
  name: {
    color: "#555",
  },
  guestItem: {
    padding: 12,
    backgroundColor: "#eef",
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
  guestTxt: {
    color: "#333",
    fontWeight: "500",
  },
  emptyTxt: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});
