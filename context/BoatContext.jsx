// context/BoatContext.js
import React, { createContext, useContext, useState, useCallback } from "react";
import axiosInstance from "../config/axios";
import { Alert } from "react-native";

const BoatContext = createContext();

export function BoatProvider({ children }) {
  const [boatList, setBoatList] = useState([]);

  const fetchBoats = useCallback(async (userID, query = "") => {
    try {
      const response = await axiosInstance.get(
        `/api/boats/${userID}?boatname=${encodeURIComponent(query)}`
      );
      if (response.status === 200) {
        setBoatList(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching boats:", error);
      Alert.alert("Error", "No se pudieron cargar los barcos");
    }
  }, []);

  const addBoat = async (user, boatData) => {
    try {
      
      const response = await axiosInstance.post("/api/boats/create", {
        user,
        boatData,
      });
      if (response.status === 201) {
        setBoatList((prev) => [...prev, response.data.data || response.data]);
        Alert.alert("Éxito", "Barco agregado correctamente");
      }
    } catch (error) {
      console.error("Error adding boat:", error);
      Alert.alert("Error", "No se pudo agregar el barco");
    }
  };

  const updateBoat = async (boatId, updatedData) => {
    try {
      const response = await axiosInstance.put(
        `/api/boats/${boatId}`,
        updatedData
      );
      if (response.status === 200) {
        setBoatList((prev) =>
          prev.map((boat) =>
            boat._id === boatId ? response.data.data || response.data : boat
          )
        );
        Alert.alert("Éxito", "Barco actualizado correctamente");
      }
    } catch (error) {
      console.error("Error updating boat:", error);
      Alert.alert("Error", "No se pudo actualizar el barco");
    }
  };

  const deleteBoat = async (boatId) => {
    try {
      const response = await axiosInstance.delete(`/api/boats/${boatId}`);
      if (response.status === 200) {
        setBoatList((prev) => prev.filter((boat) => boat._id !== boatId));
        Alert.alert("Éxito", "Barco eliminado correctamente");
      }
    } catch (error) {
      console.error("Error deleting boat:", error);
      Alert.alert("Error", "No se pudo eliminar el barco");
    }
  };

  return (
    <BoatContext.Provider
      value={{ boatList, fetchBoats, addBoat, updateBoat, deleteBoat }}
    >
      {children}
    </BoatContext.Provider>
  );
}

export function useBoats() {
  const context = useContext(BoatContext);
  if (!context) {
    throw new Error("useBoats debe usarse dentro de un BoatProvider");
  }
  return context;
}
