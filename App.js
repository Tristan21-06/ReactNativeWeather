import {StyleSheet, ActivityIndicator, ImageBackground} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import Weather from "./views/Weather";
import {useState} from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
          <ActivityIndicator size={"large"} />
      ) : (
          <ImageBackground source={{uri: imageUrl}}>
            <Weather setImageUrl={setImageUrl} setLoading={setLoading} />
          </ImageBackground>
      )}
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
