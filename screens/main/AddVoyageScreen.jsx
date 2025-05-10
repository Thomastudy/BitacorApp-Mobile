import React from "react";
import { useVoyages } from "../../context/VoyageContext";
import { useUser } from "../../context/UserContext";
import VoyageForm from "../../components/voyage/VoyageForm";

export default function AddVoyageScreen() {
  const { addVoyage } = useVoyages();
  const { user } = useUser();

  const handleCreate = async (formData) => {
    console.log(formData);
    
    await addVoyage(user, formData);
  };

  return <VoyageForm handleData={handleCreate} action="add" />;
}
