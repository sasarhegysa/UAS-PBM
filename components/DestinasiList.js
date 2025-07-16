import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import CardDestinasi from './CardDestinasi';

const API = 'http://193.111.124.238:5000/api';

const DestinasiList = () => {
  const [destinasi, setDestinasi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinasi = async () => {
      try {
        const res = await axios.get(`${API}/destinasi`);
        setDestinasi(res.data.slice(0, 6)); // Ambil 6 data saja
      } catch (err) {
        console.error("Gagal mengambil data destinasi", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinasi();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={styles.line} />
        <Text style={styles.subtitle}>Destinasi</Text>
      </View>

      <Text style={styles.title}>Saran Perjalanan</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ef4444" />
      ) : (
        <FlatList
          data={destinasi}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          renderItem={({ item }) => <CardDestinasi destinasi={item} />}
        />
      )}
    </View>
  );
};

export default DestinasiList;

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  line: {
    width: 24,
    height: 2,
    backgroundColor: '#f87171',
    marginRight: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#f87171',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
});
