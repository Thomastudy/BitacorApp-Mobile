import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../config/axios";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

const initialUserState = {
  userID: "",
  userName: "",
  first_name: "",
  email: "",
  role: "",
};

const ERROR_MESSAGES = {
  AUTH_ERROR: "Error al autenticar usuario",
  LOGOUT_ERROR: "No se pudo cerrar sesión",
  NETWORK_ERROR: "Error de conexión",
  REGISTRATION_ERROR: "No se pudo registrar",
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(initialUserState);
  const [isAuth, setIsAuth] = useState(null); // null = no sabemos todavía
  const [theError, setTheError] = useState(null);
  const [loading, setLoading] = useState(true);

  

  const resetUserState = () => {
    setUser(initialUserState);
    setIsAuth(false);
    AsyncStorage.removeItem("token");
  };

  const checkAuthStatus = async () => {
    try {
      const response = await axiosInstance.get("/api/sessions/current");
      // const response = await axiosInstance.get(`/api/sessions/current`);

      const userData = response.data;

      if (userData && userData.data) {
        setUser(userData.data);
        setIsAuth(true);
      } else {
        resetUserState();
      }
    } catch (error) {
      console.log("error en el checkstatus");

      resetUserState();
      setTheError(
        error.response?.data?.message ||
          ERROR_MESSAGES[error.code] ||
          ERROR_MESSAGES.AUTH_ERROR
      );
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      const response = await axiosInstance.post("/api/sessions/logout");
      if (response) {
        resetUserState();
        Alert.alert("Sesión cerrada exitosamente");
        return { success: true };
      }
    } catch (error) {
      Alert.alert(ERROR_MESSAGES.LOGOUT_ERROR);
      return { success: false };
    } finally {
      checkAuthStatus();
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/sessions/login",
        credentials
      );
      console.log("credentials");

      const token = response.data.token;

      if (response.status === 200 && token) {
        await AsyncStorage.setItem("token", token);
        await checkAuthStatus();
        return { success: true };
      }
    } catch (error) {
      console.log("Login error: no token recibed " + error);

      const responseError =
        error.response?.data?.message || ERROR_MESSAGES.AUTH_ERROR;
      setTheError(responseError);
      return { success: false, error: responseError };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/sessions/register",
        userData
      );

      const token = response.data.token;

      if (response.status === 200 && token) {
        await AsyncStorage.setItem("token", token);
        await checkAuthStatus();
        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || ERROR_MESSAGES.REGISTRATION_ERROR;
      setTheError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/api/sessions/search/${userId}`
      );
      if (!response.data) throw new Error("User not found");
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      Alert.alert("Error al cargar el usuario");
      throw error;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuth,
        loading,
        theError,
        checkAuthStatus,
        logOut,
        getUserById,
        login,
        register,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
}
