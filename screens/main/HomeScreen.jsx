import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useVoyages } from "../../context/VoyageContext";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import AddVoyageButton from "../../components/voyage/AddVoyageButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../../components/footer&header/Footer";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { voyages, loading } = useVoyages();
  const { user, logOut } = useUser();
  const { theme } = useTheme();

  const [displayedVoyages, setDisplayedVoyages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (voyages.length > 0) {
      setDisplayedVoyages(voyages.slice(0, itemsPerPage));
    }
  }, [voyages]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setDisplayedVoyages([
      ...displayedVoyages,
      ...voyages.slice(startIndex, endIndex),
    ]);

    setCurrentPage(nextPage);
  };

  const hasMoreVoyages = displayedVoyages.length < voyages.length;

  const handleVoyageClick = (voyageId) => {
    navigation.navigate("VoyageDetail", { voyageId }); // Asegurate de tener esta ruta
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];
    const month = monthNames[date.getMonth()];
    return `${day}, ${month}`;
  };

  const renderVoyageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.voyageItem}
      onPress={() => handleVoyageClick(item._id)}
    >
      <Text style={styles.createdBy}>
        {item.createdBy._id === user._id
          ? "Creado por ti"
          : `Creado por ${item.createdBy.userName}`}
      </Text>
      <Text style={styles.dateText}>
        {formatDate(item.departure)}, {item.boatId.boatName}
      </Text>
      <Text style={styles.mode}>{item.mode}</Text>
    </TouchableOpacity>
  );

  const handleLogOut = () => {
    logOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : displayedVoyages.length > 0 ? (
        <>
          <FlatList
            data={displayedVoyages}
            renderItem={renderVoyageItem}
            keyExtractor={(item, index) => item._id || index.toString()}
          />
          {hasMoreVoyages && (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
              <Text style={styles.loadMoreText}>Cargar más navegadas</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text>No se han encontrado navegadas.</Text>
      )}
      <TouchableOpacity style={styles.fab} onPress={() => handleLogOut()}>
        <Text>Chau</Text>
      </TouchableOpacity>
      <AddVoyageButton />
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fdfcfa",
  },
  voyageItem: {
    backgroundColor: "#fdfcfa",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },
  createdBy: {
    position: "absolute",
    right: 16,
    top: 8,
    fontSize: 14,
    color: "#023850", // o reemplazá por tu azul corporativo
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  mode: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  loadMoreButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 6,
    alignItems: "center",
    alignSelf: "center",
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
