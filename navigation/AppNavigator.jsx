// navigation/AppNavigator.jsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LogInScreen";
import SignupScreen from "../screens/auth/SignUpScreen";
import HomeScreen from "../screens/main/HomeScreen";
import AddVoyageScreen from "../screens/main/AddVoyageScreen";
// import VoyageDetailScreen from "../screens/main/VoyageDetailScreen";
import SplashScreen from "../screens/auth/SplashScreen"; // pantalla con logo o ActivityIndicator

import { useUser } from "../context/UserContext";
import AddBoatScreen from "../screens/main/AddBoatScreen";
import { Button } from "react-native";
import BaseHeader from "../components/footer&header/BaseHeader";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <BaseHeader {...props} />,
        headerStyle: { backgroundColor: "#023850", height: 80 },
        headerTintColor: "#fff",
        headerTitleStyle: { fontSize: 22, fontWeight: "600" },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="AddVoyage"
        component={AddVoyageScreen}
        options={{
          // headerStyle: { backgroundColor: "#023850", height: 80 },
          // headerTintColor: "#fff",
          // headerTitleStyle: { fontSize: 22, fontWeight: "600" },
          title: "Nueva navegada",
          headerBackTitle: "hola",
        }}
      />
      <Stack.Screen name="AddBoat" component={AddBoatScreen} />
      {/* <Stack.Screen name="VoyageDetail" component={VoyageDetailScreen} /> */}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuth, loading } = useUser();

  return (
    <NavigationContainer>
      {loading ? <SplashScreen /> : isAuth ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
