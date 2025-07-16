// Tetap pakai import yang kamu pakai ya
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = process.env.EXPO_PUBLIC_API_URL || 'http://193.111.124.238:5000/api';

export default function HeroSearch() {
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [lokasiList, setLokasiList] = useState([]);
  const [tipeList, setTipeList] = useState([]);
  const durasiList = ['1 Hari', '2 Hari', '3+ Hari'];

  const [lokasi, setLokasi] = useState('');
  const [tipe, setTipe] = useState('');
  const [durasi, setDurasi] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await axios.get(`${API}/destinasi`);
        const semuaDestinasi = res.data;

        const lokasiUnik = [...new Set(semuaDestinasi.map((d) => d.lokasi))];
        const tipeUnik = [...new Set(semuaDestinasi.map((d) => d.tipe))];

        setLokasiList(lokasiUnik);
        setTipeList(tipeUnik);
      } catch (err) {
        console.error('Gagal memuat data destinasi:', err.message);
      }
    };

    fetchFilters();
  }, []);

const handleCari = async () => {
  if (!budget) {
    Alert.alert('Oops!', 'Masukkan budget terlebih dahulu!');
    return;
  }

  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    const res = await axios.post(
      `${API}/rekomendasi`,
      { budget, lokasi, tipe, durasi },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const rekomendasiId = res.data._id; // ✅ Ambil ID dari response backend
    navigation.navigate('AIResult', { id: rekomendasiId }); // ✅ lempar ke AIResult
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Gagal mendapatkan rekomendasi. Pastikan kamu sudah login.');
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jelajahi Dunia, Sesuai Gaya dan Biaya!</Text>
      <Text style={styles.subtitle}>Temukan destinasi terbaik hanya dengan sekali klik</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Lokasi</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={lokasi} onValueChange={setLokasi}>
            <Picker.Item label="Pilih Lokasi" value="" />
            {lokasiList.map((loc, i) => (
              <Picker.Item key={i} label={loc} value={loc} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Tipe</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={tipe} onValueChange={setTipe}>
            <Picker.Item label="Tipe Perjalanan" value="" />
            {tipeList.map((t, i) => (
              <Picker.Item key={i} label={t} value={t} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Durasi</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={durasi} onValueChange={setDurasi}>
            <Picker.Item label="Durasi" value="" />
            {durasiList.map((d, i) => (
              <Picker.Item key={i} label={d} value={d} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Budget (Rp)</Text>
        <TextInput
          placeholder="Contoh: 1500000"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.disabled]}
          onPress={handleCari}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cari</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Booking')}
        style={styles.customCard}
      >
        <Text style={styles.customTitle}>Punya Rencana Sendiri?</Text>
        <Text style={styles.customText}>
          Rancang perjalanan impianmu dengan fitur Booking Custom.
        </Text>
        <Text style={styles.customButton}>✨ Booking Custom Sekarang</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 4,
    color: '#111',
  },
  subtitle: {
    fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  label: {
    fontSize: 14, marginBottom: 4, color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 16,
  },
  button: {
    backgroundColor: '#ef4444', padding: 14,
    borderRadius: 8, alignItems: 'center',
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold', fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  customCard: {
    backgroundColor: '#fff3f3', padding: 18,
    borderRadius: 12, borderColor: '#fca5a5', borderWidth: 1,
  },
  customTitle: {
    fontWeight: 'bold', fontSize: 16, color: '#b91c1c', marginBottom: 4,
  },
  customText: {
    fontSize: 13, color: '#555', marginBottom: 8,
  },
  customButton: {
    color: '#fff', backgroundColor: '#ef4444',
    paddingVertical: 8, paddingHorizontal: 16,
    alignSelf: 'flex-start', borderRadius: 20,
    fontWeight: '600', fontSize: 13,
  },
});
