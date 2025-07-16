// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import BottomTabNavigator from './screens/navigation/BottomTabNavigator';
import AIResultScreen from './screens/AIResultScreen';
import BookingDariRekomendasiScreen from './screens/BookingDariRekomendasiScreen';
import TransaksiDetailScreen from './screens/TransaksiDetailScreen';
import BookingScreen from './screens/BookingScreen';
import DetailPackageScreen from './screens/DetailPackageScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="AIResult" component={AIResultScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
          
          {/* ✅ Tambahkan screen untuk booking dari rekomendasi */}
          <Stack.Screen
            name="BookingDariRekomendasi"
            component={BookingDariRekomendasiScreen}
          />
          <Stack.Screen name="TransaksiDetail" component={TransaksiDetailScreen} />
          <Stack.Screen name="DetailPackage" component={DetailPackageScreen} />


          {/* ✅ Ini tab utama setelah login */}
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
