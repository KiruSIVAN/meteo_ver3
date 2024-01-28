import React from "react";
import { StatusBar } from "expo-status-bar";
//import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from "react-native";
import AppNavigation from "./navigation/appNavigation";

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigation />
    </>
  );
}
