// screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // langsung ke login
    }, 5000); // 2 detik

    return () => clearTimeout(timer); // bersihkan timer
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
  },
  logo: {
    width: 120, height: 120, marginBottom: 20,
    resizeMode: 'contain'
  },
  text: {
    fontSize: 26, fontWeight: 'bold', color: '#3498db'
  },
});
