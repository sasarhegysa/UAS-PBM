import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Image, StyleSheet,
  ActivityIndicator, TextInput, TouchableOpacity, Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API = 'http://193.111.124.238:5000/api';

export default function DetailPackageScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const id = params?.id;

  const [paket, setPaket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    tanggalBerangkat: '',
    tanggalPulang: '',
    metodePembayaran: 'transfer',
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${API}/package/${id}`);
        setPaket(res.data);
      } catch (err) {
        Alert.alert('Gagal', 'Gagal memuat detail paket');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleBooking = async () => {
    if (!form.tanggalBerangkat || !form.tanggalPulang || !form.metodePembayaran) {
      Alert.alert('Oops!', 'Lengkapi semua field booking.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(`${API}/package/${id}/booking`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Sukses', 'Booking berhasil!');
      navigation.navigate('TransaksiDetail', { id: res.data.booking._id });
    } catch (err) {
      console.error(err);
      Alert.alert('Gagal', err.response?.data?.message || 'Terjadi kesalahan saat booking');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ef4444" />
      </View>
    );
  }

  if (!paket) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#888' }}>Paket tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {paket.destinasi?.foto && (
        <Image
          source={{ uri: `http://193.111.124.238:5000${paket.destinasi.foto}` }}
          style={styles.image}
        />
      )}

      <Text style={styles.title}>{paket.nama}</Text>
      <Text style={styles.durasi}>{paket.durasi || 'Durasi tidak tersedia'}</Text>
      <Text style={styles.deskripsi}>{paket.deskripsi}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Destinasi:</Text>
        <Text style={styles.value}>{paket.destinasi?.nama || '-'}</Text>
        <Text style={styles.label}>Akomodasi:</Text>
        <Text style={styles.value}>{paket.akomodasi?.nama || '-'}</Text>
        <Text style={styles.label}>Transportasi:</Text>
        <Text style={styles.value}>{paket.transportasi?.namaOperator || '-'}</Text>
        <Text style={styles.label}>Harga:</Text>
        <Text style={[styles.value, { color: '#16a34a', fontWeight: 'bold' }]}>
          Rp{parseInt(paket.harga).toLocaleString('id-ID')}
        </Text>
      </View>

      {/* Form Booking */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Form Booking</Text>

        <Text style={styles.inputLabel}>Tanggal Berangkat (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={form.tanggalBerangkat}
          onChangeText={(val) => setForm({ ...form, tanggalBerangkat: val })}
          placeholder="Contoh: 2025-07-20"
        />

        <Text style={styles.inputLabel}>Tanggal Pulang (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={form.tanggalPulang}
          onChangeText={(val) => setForm({ ...form, tanggalPulang: val })}
          placeholder="Contoh: 2025-07-23"
        />

        <Text style={styles.inputLabel}>Metode Pembayaran</Text>
        <TextInput
          style={styles.input}
          value={form.metodePembayaran}
          onChangeText={(val) => setForm({ ...form, metodePembayaran: val })}
          placeholder="transfer / ewallet / cod"
        />

        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Booking Sekarang</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#dc2626', marginBottom: 4 },
  durasi: { fontStyle: 'italic', color: '#6b7280', marginBottom: 10 },
  deskripsi: { fontSize: 14, color: '#374151', marginBottom: 16 },
  infoBox: { backgroundColor: '#f9fafb', padding: 16, borderRadius: 10, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#6b7280', marginTop: 6 },
  value: { fontSize: 14, color: '#111827' },
  form: { backgroundColor: '#fff7f7', padding: 16, borderRadius: 12, marginBottom: 40 },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#b91c1c', marginBottom: 16 },
  inputLabel: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  input: {
    borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8,
    padding: 10, fontSize: 14, marginBottom: 12, backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ef4444', paddingVertical: 14, borderRadius: 8, marginTop: 10,
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 16,
  },
});
