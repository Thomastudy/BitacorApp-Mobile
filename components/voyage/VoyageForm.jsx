// components/voyage/VoyageComponent.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
// import * as ImagePicker from "expo-image-picker";

import { useUser } from "../../context/UserContext";

import SearchCrewModal from "../modals/SearchCrewModal";
import SearchBoatModal from "../modals/SearchBoatModal";
import { useBoats } from "../../context/BoatContext";
import { SafeAreaView } from "react-native-safe-area-context";

const KM_TO_NM = 0.539957;

export default function VoyageComponent({
  action,
  handleData,
  preloadTripData = {},
}) {
  const navigation = useNavigation();
  const { user } = useUser();
  const { fetchBoats, listBoats } = useBoats();

  const defaultTripData = {
    boatName: "",
    boatId: "",
    mode: "Paseo",
    crewMembers: [],
    guestCrew: [],
    crewDisplay: [],
    departureDate: new Date(),
    departureTime: new Date(),
    arrivalDate: new Date(),
    arrivalTime: new Date(),
    miles: "",
    comments: "",
    distanceUnit: "NM",
    photos: [],
  };

  const [tripData, setTripData] = useState({
    ...defaultTripData,
    ...preloadTripData,
  });
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [showBoatModal, setShowBoatModal] = useState(false);
  const [dtPicker, setDtPicker] = useState({
    type: null,
    mode: "date",
    visible: false,
  });

  useEffect(() => {
    fetchBoats(user._id);
  }, [listBoats]);

  const handleSelectBoat = (boat) => {
    setTripData((p) => ({
      ...p,
      boatName: boat.boatName,
      boatId: boat._id,
    }));
    setShowBoatModal(false);
  };

  const addNewBoat = () => navigation.navigate("AddBoat");

  const handleSelectCrewMember = (member) => {
    if (tripData.crewDisplay.some((c) => c._id === member._id)) {
      Alert.alert("Error", "Este usuario ya es parte de la tripulación");
      setShowCrewModal(false);
      return;
    }
    setTripData((p) => ({
      ...p,
      crewMembers: [...p.crewMembers, member._id],
      crewDisplay: [
        ...p.crewDisplay,
        { _id: member._id, userName: member.userName, type: "crew" },
      ],
    }));
    setShowCrewModal(false);
  };

  const handleSelectGuestCrew = (guestName) => {
    if (tripData.crewDisplay.some((c) => c.userName === guestName)) {
      Alert.alert("Error", "Este usuario ya es parte de la tripulación");
      setShowCrewModal(false);
      return;
    }
    setTripData((p) => ({
      ...p,
      guestCrew: [...p.guestCrew, guestName],
      crewDisplay: [...p.crewDisplay, { userName: guestName, type: "guest" }],
    }));
    setShowCrewModal(false);
  };

  const handleRemoveCrewMember = (index) => {
    setTripData((p) => {
      const newDisplay = [...p.crewDisplay];
      const removed = newDisplay.splice(index, 1)[0];
      let newCrew = [...p.crewMembers];
      let newGuests = [...p.guestCrew];
      if (removed.type === "crew")
        newCrew = newCrew.filter((id) => id !== removed._id);
      else newGuests = newGuests.filter((g) => g !== removed.userName);
      return {
        ...p,
        crewMembers: newCrew,
        guestCrew: newGuests,
        crewDisplay: newDisplay,
      };
    });
  };

  // date/time
  const openDatePicker = (type, mode = "date") =>
    setDtPicker({ type, mode, visible: true });
  const onChangeDt = (e, selected) => {
    setDtPicker((p) => ({ ...p, visible: false }));
    if (selected) {
      setTripData((p) => ({
        ...p,
        [dtPicker.type]: selected,
      }));
    }
  };

  // distance
  const handleDistanceChange = (text) => {
    const val = parseFloat(text) || "";
    const nm = tripData.distanceUnit === "KM" ? val * KM_TO_NM : val;
    setTripData((p) => ({ ...p, miles: nm, distanceInput: text }));
  };
  const toggleUnit = () => {
    setTripData((p) => ({
      ...p,
      distanceUnit: p.distanceUnit === "NM" ? "KM" : "NM",
      distanceInput:
        p.distanceUnit === "NM"
          ? (p.miles / KM_TO_NM).toString()
          : p.miles.toString(),
    }));
  };

  // photos
  //   const pickImage = async () => {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== "granted") {
  //       Alert.alert("Error", "Permiso denegado para acceder a tus fotos");
  //       return;
  //     }
  //     const res = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       quality: 0.7,
  //     });
  //     if (!res.cancelled) {
  //       setTripData((p) => ({ ...p, photos: [...p.photos, res.uri] }));
  //     }
  //   };

  const handleSubmit = () => {
    if (!tripData.boatId)
      return Alert.alert("Error", "Debes seleccionar un barco");
    handleData({
      boatId: tripData.boatId,
      mode: tripData.mode,
      crewMembers: tripData.crewMembers,
      guestCrew: tripData.guestCrew,
      departure: tripData.departureDate,
      arrival: tripData.arrivalDate,
      miles: tripData.miles,
      comments: tripData.comments,
      photos: tripData.photos,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Barco */}
        <Text style={styles.label}>Barco</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowBoatModal(true)}
          >
            <Text>{tripData.boatName || "Seleccionar barco..."}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={addNewBoat}>
            <Text style={styles.addTxt}>＋</Text>
          </TouchableOpacity>
        </View>

        {/* Modo */}
        <Text style={styles.label}>Modo</Text>
        <TextInput
          style={styles.input}
          value={tripData.mode}
          onChangeText={(t) => setTripData((p) => ({ ...p, mode: t }))}
        />

        {/* Tripulación */}
        <Text style={styles.label}>Tripulación</Text>
        <View style={styles.crewContainer}>
          {tripData.crewDisplay.map((m, i) => (
            <View key={i} style={styles.crewMember}>
              <Text>{m.type === "guest" ? `+ ${m.userName}` : m.userName}</Text>
              {m._id !== user._id && (
                <TouchableOpacity onPress={() => handleRemoveCrewMember(i)}>
                  <Text style={styles.remove}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowCrewModal(true)}
          >
            <Text style={styles.addTxt}>＋</Text>
          </TouchableOpacity>
        </View>

        {/* Fechas */}
        <Text style={styles.label}>Salida</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => openDatePicker("departureDate", "date")}
        >
          <Text>{tripData.departureDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Llegada</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => openDatePicker("arrivalDate", "date")}
        >
          <Text>{tripData.arrivalDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {/* Distancia */}
        <Text style={styles.label}>Distancia ({tripData.distanceUnit})</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
            value={tripData.distanceInput || ""}
            onChangeText={handleDistanceChange}
          />
          <TouchableOpacity style={styles.unitBtn} onPress={toggleUnit}>
            <Text>{tripData.distanceUnit}</Text>
          </TouchableOpacity>
        </View>

        {/* Comentarios */}
        <Text style={styles.label}>Comentario</Text>
        <TextInput
          style={styles.textarea}
          multiline
          value={tripData.comments}
          onChangeText={(t) => setTripData((p) => ({ ...p, comments: t }))}
        />

        {/* Fotos */}
        {/* <Text style={styles.label}>Fotos</Text>
        <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
          <Text>📷 Subir foto</Text>
        </TouchableOpacity>
        <FlatList
          horizontal
          data={tripData.photos}
          keyExtractor={(uri) => uri}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.thumb} />}
          style={{ marginBottom: 20 }}
        /> */}

        {/* Submit */}
        <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
          <Text style={styles.submitTxt}>
            {action === "add" ? "Crear navegada" : "Guardar cambios"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modales */}
      <SearchBoatModal
        visible={showBoatModal}
        onClose={() => setShowBoatModal(false)}
        onSelectBoat={handleSelectBoat}
      />
      <SearchCrewModal
        visible={showCrewModal}
        onClose={() => setShowCrewModal(false)}
        onSelectCrewMember={handleSelectCrewMember}
        onSelectGuestCrew={handleSelectGuestCrew}
      />

      {/* DateTimePicker */}
      {dtPicker.visible && (
        <DateTimePicker
          value={tripData[dtPicker.type] || new Date()}
          mode={dtPicker.mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDt}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  back: { fontSize: 24, marginRight: 16 },
  title: { fontSize: 20, fontWeight: "600" },
  container: { padding: 16 },
  label: { fontWeight: "600", marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  row: { flexDirection: "row", alignItems: "center" },
  addBtn: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1, // grosor
    borderColor: "#2a2a2a", // color
    borderStyle: "dotted", // estilo punteado
  },
  addTxt: { color: "#2a2a2a", fontSize: 24, lineHeight: 24 },
  crewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  crewMember: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef",
    padding: 8,
    borderRadius: 16,
    margin: 4,
  },
  remove: { marginLeft: 4, color: "red", fontWeight: "600" },
  addCrew: {
    backgroundColor: "#007bff",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },
  unitBtn: {
    marginLeft: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  photoBtn: {
    padding: 12,
    backgroundColor: "#eef",
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  thumb: { width: 60, height: 60, borderRadius: 6, marginRight: 8 },
  submit: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 20,
  },
  submitTxt: { color: "#fff", fontWeight: "600" },
});
