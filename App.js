import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import Weather from "./views/Weather";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Weather />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
