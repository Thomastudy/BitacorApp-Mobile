import { BoatProvider } from "./context/BoatContext";
import { UserProvider, useUser } from "./context/UserContext";
import { VoyageProvider } from "./context/VoyageContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppNavigator from "./navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <VoyageProvider>
            <BoatProvider>
              <AppNavigator />
            </BoatProvider>
          </VoyageProvider>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
