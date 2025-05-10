import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// ⚠️ Reemplazá esta IP con la IP local de tu máquina
const BASE_URL = "http://192.168.1.13:8080"; // ejemplo: IP de tu PC + puerto de backend

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default axiosInstance;
