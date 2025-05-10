import React from "react";
import { useBoats } from "../../context/BoatContext";
import { useUser } from "../../context/UserContext";
import BoatsForm from "../../components/boats/BoatsForm";
import { Text } from "react-native";

export default function AddBoatScreen() {
  const { addBoat } = useBoats();
  const { user } = useUser();

  const handleCreate = async (formData) => {
    await addBoat(user, formData);
  };

  return <BoatsForm handleData={handleCreate} action="add" />;
}
