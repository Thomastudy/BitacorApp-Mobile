import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/UserContext"; // Ajustá si es necesario
import Logo from "../../assets/logo.png";

export default function LoginScreen() {
  const { isAuth, login, loading } = useUser();
  const navigation = useNavigation();

  const [activeField, setActiveField] = useState("userName");
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const result = await login(formData);
    
    if (!result.success) {
      alert(result.error || "Error en el usuario");
    }
  };

  useEffect(() => {
    
    if (isAuth) {
      navigation.navigate("Home");
    }
  }, [isAuth]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
   

    
<ScrollView contentContainerStyle={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>Iniciar sesión con:</Text>

      <View style={styles.selector}>
        {activeField !== "userName" && (
          <TouchableOpacity onPress={() => setActiveField("userName")}>
            <Text style={styles.link}>Usuario</Text>
          </TouchableOpacity>
        )}
        {activeField !== "email" && (
          <TouchableOpacity onPress={() => setActiveField("email")}>
            <Text style={styles.link}>Email</Text>
          </TouchableOpacity>
        )}
        {activeField !== "phone" && (
          <TouchableOpacity onPress={() => setActiveField("phone")}>
            <Text style={styles.link}>Teléfono</Text>
          </TouchableOpacity>
        )}
      </View>

      {activeField === "userName" && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            value={formData.userName}
            onChangeText={(text) => handleChange("userName", text)}
            autoCapitalize="none"
          />
        </View>
      )}
      {activeField === "email" && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
      )}
      {activeField === "phone" && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => handleChange("phone", text)}
            keyboardType="phone-pad"
          />
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.registerLink}>Crear usuario</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flexGrow: 1,
    alignItems: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 12,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  selector: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  link: {
    color: "#007bff",
    fontWeight: "600",
    fontSize: 14,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 6,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 20,
    color: "#007bff",
    fontWeight: "600",
  },
});
