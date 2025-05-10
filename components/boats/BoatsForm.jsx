import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import BoatTypePicker from "./BoatTypePicker";
import SearchCrewModal from "../modals/SearchCrewModal";
import { useUser } from "../../context/UserContext";

export default function BoatsForm({
  action,
  handleData,
  preloadBoatData = {},
}) {
  
  const defaultBoatData = {
    boatName: "",
    boatType: "",
    owners: [],
    ownersDisplay: [],
    authorizedUsers: [],
    brand: "",
    model: "",
    length: "",
    flag: "",
    photo: "",
    comments: "",
    crewMembers: [],
    crewDisplay: [],
  };

  // Contexts
  const theme = useTheme();
  const navigation = useNavigation();


  // UseStates
  const [boatData, setBoatData] = useState({
    ...defaultBoatData,
    ...preloadBoatData,
  });
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [isSearchingOwner, setIsSearchingOwner] = useState(false);
  const [isSearchingCrew, setIsSearchingCrew] = useState(false);
  const [showCrewModal, setShowCrewModal] = useState(false);

  const handleBack = () => navigation.goBack();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!boatData.boatName || !boatData.boatType) {
      console.log(
        "El nombre del barco y el tipo son obligatorios.",
        "error",
        1200
      );
      return;
    }

    // Convertir a inglés antes de enviar al backend

    try {
      await handleData(boatData);
    } catch (error) {
      console.error("Error al agregar barco:", error);
    }
  };

  // OWNER SETTINGS

  const handleSelectOwner = (owner) => {
    const isAlreadyOwner = boatData.ownersDisplay.some(
      (owners) => owners.id === owner._id
    );

    if (isAlreadyOwner) {
      alertIcon("Este usuario ya es propietario", "error", 1100);
      setIsSearchingOwner(false);
      return;
    }

    const isAlreadyInCrew = boatData.crewDisplay.some(
      (crewMember) => crewMember._id === owner._id
    );
    if (isAlreadyInCrew) {
      handleRemoveCrewMember(owner._id);
    }

    setBoatData((prev) => ({
      ...prev,
      owners: [...prev.owners, owner._id],
      ownersDisplay: [
        ...prev.ownersDisplay,
        {
          _id: owner._id,
          userName: owner.userName,
        },
      ],
    }));
    setIsSearchingOwner(false);
  };
  const handleRemoveOwner = (_id) => {
    setBoatData((prev) => {
      const newOwnerDisplay = prev.ownersDisplay.filter(
        (owner) => owner._id !== _id
      );
      const newOwners = newOwnerDisplay.map((owner) => owner._id);
      return {
        ...prev,
        ownersDisplay: newOwnerDisplay,
        owners: newOwners,
      };
    });
  };

  // CREW SETTINGS

  const handleSelectCrewMember = (member) => {
    const isAlreadyInCrew = boatData.crewDisplay.some(
      (crewMember) => crewMember._id === member._id
    );

    if (isAlreadyInCrew) {
      alertIcon("Este usuario ya es parte de la tripulación", "error", 1100);
      setIsSearchingCrew(false);
      return;
    }

    const isAlreadyOwner = boatData.ownersDisplay.some(
      (owners) => owners._id === member._id
    );
    if (isAlreadyOwner) {
      handleRemoveOwner(member._id);
    }

    setBoatData((prev) => ({
      ...prev,
      crewMembers: [...prev.crewMembers, member._id],
      crewDisplay: [
        ...prev.crewDisplay,
        {
          _id: member._id,
          userName: member.userName,
          type: "crew",
        },
      ],
    }));
    setIsSearchingCrew(false);
  };
  const handleRemoveCrewMember = (_id) => {
    setBoatData((prev) => {
      const newCrewDisplay = prev.crewDisplay.filter(
        (member) => member._id !== _id
      );
      const newCrewMembers = newCrewDisplay.map((member) => member._id);
      return {
        ...prev,
        crewDisplay: newCrewDisplay,
        crewMembers: newCrewMembers,
      };
    });
  };

  // BOAT TYPE SETTINGS



  return (
    <SafeAreaView style={[styles.outer, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleBack()}>
          <Text style={[styles.back, { color: theme.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Nuevo Barco</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Nombre */}
        <Text style={[styles.label, { color: theme.text }]}>
          Nombre del barco
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.border, color: theme.text },
          ]}
          placeholder="Nombre..."
          placeholderTextColor={theme.textSecondary}
          value={boatData.boatName}
          onChangeText={(t) => setBoatData((p) => ({ ...p, boatName: t }))}
        />

        {/* Tipo */}
        <Text style={[styles.label, { color: theme.text }]}>Tipo</Text>
        <View style={[styles.pickerWrapper, { borderColor: theme.border }]}>
          <BoatTypePicker
            boatType={boatData.boatType}
            onChange={(val) =>
              setBoatData((prev) => ({ ...prev, boatType: val }))
            }
          />
        </View>

        {/* Propietarios */}
        <Text style={[styles.label, { color: theme.text }]}>Propietarios</Text>
        <View style={styles.row}>
          {boatData.ownersDisplay.map((o) => (
            <View
              key={o._id}
              style={[
                styles.tag,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Text style={{ color: theme.text }}>{o.userName}</Text>
              <TouchableOpacity onPress={() => handleRemoveOwner(o._id)}>
                <Text style={[styles.remove, { color: theme.error }]}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.addTag, { backgroundColor: theme.primary }]}
            onPress={() => setShowOwnerModal(true)}
          >
            <Text style={{ color: theme.textOnPrimary }}>＋</Text>
          </TouchableOpacity>
        </View>

        {/* Autorizados */}
        <Text style={[styles.label, { color: theme.text }]}>
          Autorizados para registros
        </Text>
        <View style={styles.row}>
          {boatData.crewDisplay.map((c) => (
            <View
              key={c._id}
              style={[
                styles.tag,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Text style={{ color: theme.text }}>{c.userName}</Text>
              <TouchableOpacity onPress={() => handleRemoveCrewMember(c._id)}>
                <Text style={[styles.remove, { color: theme.error }]}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.addTag, { backgroundColor: theme.primary }]}
            onPress={() => setShowCrewModal(true)}
          >
            <Text style={{ color: theme.textOnPrimary }}>＋</Text>
          </TouchableOpacity>
        </View>

        {/* Otros campos */}
        {[
          { key: "brand", label: "Marca", placeholder: "Marca..." },
          { key: "model", label: "Modelo", placeholder: "Modelo..." },
          { key: "length", label: "Eslora", placeholder: "Eslora..." },
          { key: "flag", label: "Bandera", placeholder: "Bandera..." },
        ].map(({ key, label, placeholder }) => (
          <View key={key}>
            <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: theme.border, color: theme.text },
              ]}
              placeholder={placeholder}
              placeholderTextColor={theme.textSecondary}
              value={boatData[key]}
              onChangeText={(t) => setBoatData((p) => ({ ...p, [key]: t }))}
            />
          </View>
        ))}

        {/* Comentarios */}
        <Text style={[styles.label, { color: theme.text }]}>Comentario</Text>
        <TextInput
          style={[
            styles.input,
            styles.textarea,
            { borderColor: theme.border, color: theme.text },
          ]}
          placeholder="¿Algo para contar...?"
          placeholderTextColor={theme.textSecondary}
          multiline
          value={boatData.comments}
          onChangeText={(t) => setBoatData((p) => ({ ...p, comments: t }))}
        />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
        >
          <Text style={{ color: theme.textOnPrimary, fontWeight: "600" }}>
            Subir
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modales */}
      <SearchCrewModal
        visible={showOwnerModal}
        onClose={() => setShowOwnerModal(false)}
        onSelectCrewMember={handleSelectOwner}
        guestNeeded={false}
      />
      <SearchCrewModal
        visible={showCrewModal}
        onClose={() => setShowCrewModal(false)}
        onSelectCrewMember={handleSelectCrewMember}
        guestNeeded={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  back: { fontSize: 24, marginRight: 16 },
  title: { fontSize: 20, fontWeight: "600" },
  container: {
    paddingHorizontal: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  remove: {
    marginLeft: 6,
    fontSize: 16,
  },
  addTag: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginVertical: 20,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
});
