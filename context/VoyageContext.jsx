import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useUser } from "./UserContext"; // Usamos el contexto para obtener el usuario
import axiosInstance from "../config/axios";

const VoyageContext = createContext();

const initialVoyageState = [];

const ERROR_MESSAGES = {
  AUTH_ERROR: "Error al autenticar usuario",
  FETCH_ERROR: "Error al obtener los viajes",
  NETWORK_ERROR: "Error de conexión",
};

export const VoyageProvider = ({ children }) => {
  const { user } = useUser(); // ✅ obtenemos el usuario directamente desde el contexto

  const [voyages, setVoyages] = useState(initialVoyageState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVoyages = async () => {
    if (!user?._id) {
      setError(ERROR_MESSAGES.AUTH_ERROR);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/voyages/${user._id}`);
   
      if (response.data?.data) {
        setVoyages(response.data.data);
      } else {
        setVoyages([]);
      }
    } catch (error) {
      console.error("Error fetching voyages:", error);
      setError(error.response?.data?.message || ERROR_MESSAGES.FETCH_ERROR);
      Alert.alert("Error", ERROR_MESSAGES.FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const addVoyage = async (user, newVoyageData) => {
    try {
      console.log("newvoy ", newVoyageData);
      const response = await axiosInstance.post(`/api/voyages/create`, {
        user,
        newVoyageData,
      });
      console.log(response.data);

      if (response.status === 201) {
        await fetchVoyages();
        Alert.alert("Éxito", "Creado exitosamente");
      }
    } catch (error) {
      console.error("Error adding voyage:", error);
      Alert.alert("Error", "Error al agregar el viaje");
    }
  };

  const loadVoyageDetails = async (voyageId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/voyages/detail/${voyageId}`
      );

      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error loading voyage details:", error);
    } finally {
      setLoading(false);
    }
  };

  //rtk query. 
  /**
   * tres partes
   *  crear archivo api donde configurar la url de fbase para los http
   *  poner en el store de reduce. conectar desde la app global. creo la api con los endpoints, lo meto en lo global para manejar los estados y eso es lo que va a usar los hooks
   * 
   * instalar toolkit npm install @reduxjs-toolkits
   * creo api con create api createApi()
   * 
   * para exportar hooks
   * useGetCategoriesQuery
   * useGetProductsQuery
   * useAddProductMutation
   * con eso tengo centralizado en un solo archivo
   * 
   * despues conecto a la api
   * 
   * Mutaciones en firebase: aparte de rtk query (haceer operaciones que modifiquen el estado de los datos)
   * 
   * 
   * como hacer mutaciones en firebase
   * 
   * 
   * 
   * rtk query
   * 
   */

  const updateVoyage = async (user, updatedData, voyageId) => {
    try {
      const response = await axiosInstance.put(`/api/voyages/${voyageId}`, {
        updatedData,
        user,
      });

      if (response.data?.data) {
        setVoyages((prev) =>
          prev.map((v) => (v._id === voyageId ? response.data.data : v))
        );
        Alert.alert("Éxito", "Viaje actualizado exitosamente");
      }
    } catch (error) {
      console.error("Error updating voyage:", error);
      Alert.alert("Error", "Error al actualizar el viaje");
    }
  };

  const deleteVoyage = async (voyageId) => {
    try {
      const response = await axiosInstance.delete(
        `/api/voyages/del/${voyageId}`
      );
      if (response.status === 200) {
        setVoyages((prev) => prev.filter((v) => v._id !== voyageId));
        Alert.alert("Éxito", "Viaje eliminado exitosamente");
      }
    } catch (error) {
      console.error("Error deleting voyage:", error);
      Alert.alert("Error", "Error al eliminar el viaje");
    }
  };

  const resetVoyageState = () => {
    setVoyages(initialVoyageState);
    setError(null);
    // Si querés navegar al login, podés usar useNavigation aquí
  };

  const countMiles = () => {
    return voyages.reduce((total, voyage) => total + (voyage.miles || 0), 0);
  };

  useEffect(() => {
    fetchVoyages();
  }, [user?._id]);

  return (
    <VoyageContext.Provider
      value={{
        voyages,
        loading,
        error,
        fetchVoyages,
        addVoyage,
        loadVoyageDetails,
        updateVoyage,
        deleteVoyage,
        resetVoyageState,
        countMiles,
      }}
    >
      {children}
    </VoyageContext.Provider>
  );
};

export const useVoyages = () => {
  const context = useContext(VoyageContext);
  if (!context) {
    throw new Error("useVoyages debe ser usado dentro de un VoyageProvider");
  }
  return context;
};
