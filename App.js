import React from "react";
import { StatusBar } from "expo-status-bar";
//import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from "react-native";
import AppNavigation from "./navigation/appNavigation";

// ici c le commentaire de teste ahahaha

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigation />
    </>
  );
}
