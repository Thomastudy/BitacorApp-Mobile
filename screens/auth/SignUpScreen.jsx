import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/UserContext";
import Logo from "../../assets/logo.png"; // ⚠️ Debe ser importado localmente

export default function SignupScreen() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    userName: "",
    email: "",
    phone: "",
    birth: "",
    fact: "",
    password: "",
    password2: "",
  };

  const { isAuth, register } = useUser();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name) newErrors.first_name = "El nombre es requerido";
    if (!formData.last_name) newErrors.last_name = "El apellido es requerido";
    if (!formData.userName) newErrors.userName = "El usuario es requerido";
    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.phone) newErrors.phone = "El teléfono es requerido";
    if (!formData.birth)
      newErrors.birth = "La fecha de nacimiento es requerida";
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (formData.password !== formData.password2) {
      newErrors.password2 = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);
    if (result.success) {
      navigation.navigate("Home");
    } else {
      setErrors({
        submit: result.message || "Ocurrió un error al registrarse",
      });
    }
  };

  const renderFormField = (name, label, type = "default") => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[name] && styles.inputError]}
        value={formData[name]}
        onChangeText={(text) => handleChange(name, text)}
        secureTextEntry={name.includes("password")}
        keyboardType={
          type === "email"
            ? "email-address"
            : type === "tel"
            ? "phone-pad"
            : "default"
        }
      />
      {errors[name] && <Text style={styles.error}>{errors[name]}</Text>}
    </View>
  );

  useEffect(() => {
    if (isAuth === true) {
      navigation.navigate("Home");
    }
  }, [isAuth]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 , backgroundColor:"#ffffff"}}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image source={Logo} style={styles.logo} />
          <Text style={styles.title}>Bitacapp</Text>
        </View>

        {renderFormField("first_name", "Nombre")}
        {renderFormField("last_name", "Apellido")}
        {renderFormField("userName", "Usuario")}
        {renderFormField("email", "Email", "email")}
        {renderFormField("phone", "Teléfono", "tel")}
        {renderFormField("birth", "Fecha de nacimiento")}
        {renderFormField("fact", "Dato importante")}
        {renderFormField("password", "Contraseña")}
        {renderFormField("password2", "Repita su Contraseña")}

        {errors.submit && <Text style={styles.error}>{errors.submit}</Text>}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Crear usuario</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Iniciar con usuario existente</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
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
  inputError: {
    borderColor: "red",
  },
  error: {
    marginTop: 4,
    color: "red",
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    color: "#007bff",
    textAlign: "center",
    fontWeight: "600",
  },
});
