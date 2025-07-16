import React from 'react';
import { FlatList, SafeAreaView, StatusBar } from 'react-native';
import HeroSearch from '../components/HeroSearch';
import DestinasiList from '../components/DestinasiList';
import TourPackage from '../components/TourPackage';

const sections = [
  { key: 'hero', component: <HeroSearch /> },
  { key: 'destinasi', component: <DestinasiList /> },
  { key: 'paket', component: <TourPackage /> },
];

const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => item.component}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
