import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ActivityIndicator, ScrollView, Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  MapPin, Bed, Plane, Wallet, Calendar, ArrowLeft
} from 'lucide-react-native';

const API = 'http://193.111.124.238:5000/api';

export default function BookingDariRekomendasiScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const id = params?.id;

  const [rekomendasi, setRekomendasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    tanggalBerangkat: '',
    tanggalPulang: '',
    metodePembayaran: 'transfer',
  });

  useEffect(() => {
    const fetchRekomendasi = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`${API}/rekomendasi/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRekomendasi(res.data);
      } catch (err) {
        console.error(err);
        Alert.alert('Gagal', 'Tidak dapat memuat data rekomendasi');
      } finally {
        setLoading(false);
      }
    };
    fetchRekomendasi();
  }, [id]);

  const handleSubmit = async () => {
    if (!form.tanggalBerangkat || !form.tanggalPulang) {
      Alert.alert('Oops!', 'Lengkapi tanggal terlebih dahulu!');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(`${API}/booking/rekomendasi/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Sukses', 'Booking berhasil!');
      navigation.navigate('TransaksiDetail', { id: res.data.booking._id });
    } catch (err) {
      console.error(err);
      Alert.alert('Gagal', 'Terjadi kesalahan saat booking');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ef4444" />
      </View>
    );
  }

  if (!rekomendasi) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#999' }}>Data tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft size={16} color="#ef4444" />
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Konfirmasi Booking</Text>

      {/* Card Rekomendasi */}
      <View style={styles.card}>
        <Info icon={<MapPin color="#dc2626" size={24} />} label="Destinasi" value={rekomendasi.destinasi} />
        <Info icon={<Bed color="#3b82f6" size={24} />} label="Akomodasi" value={rekomendasi.akomodasi} />
        <Info icon={<Plane color="#10b981" size={24} />} label="Transportasi" value={rekomendasi.transportasi} />
        <Info icon={<Wallet color="#6366f1" size={24} />} label="Total Estimasi" value={`Rp${rekomendasi.totalEstimasi.toLocaleString('id-ID')}`} bold />
      </View>

      {/* Form Booking */}
      <View style={styles.form}>
        <Label text="Tanggal Berangkat" icon={<Calendar size={16} color="#ef4444" />} />
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={form.tanggalBerangkat}
          onChangeText={(val) => setForm({ ...form, tanggalBerangkat: val })}
        />

        <Label text="Tanggal Pulang" icon={<Calendar size={16} color="#ef4444" />} />
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={form.tanggalPulang}
          onChangeText={(val) => setForm({ ...form, tanggalPulang: val })}
        />

        <Label text="Metode Pembayaran" />
        <TextInput
          style={styles.input}
          value={form.metodePembayaran}
          onChangeText={(val) => setForm({ ...form, metodePembayaran: val })}
          placeholder="transfer / ewallet / cod"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Konfirmasi Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const Info = ({ icon, label, value, bold }) => (
  <View style={styles.row}>
    {icon}
    <View style={{ marginLeft: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, bold && { fontWeight: 'bold', fontSize: 16 }]}>{value}</Text>
    </View>
  </View>
);

const Label = ({ text, icon }) => (
  <Text style={styles.label}>
    {icon && <>{icon} </>}
    {text}
  </Text>
);

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9fafb' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  backText: { color: '#ef4444', fontWeight: '600', fontSize: 14 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 24, elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  label: { color: '#6b7280', fontSize: 13, marginBottom: 6 },
  value: { color: '#111827', fontSize: 15 },
  form: {
    backgroundColor: '#fff', padding: 16, borderRadius: 12,
    elevation: 1, gap: 12, marginBottom: 40,
  },
  input: {
    borderColor: '#e5e7eb', borderWidth: 1,
    borderRadius: 8, padding: 10, fontSize: 14,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#ef4444', paddingVertical: 14,
    borderRadius: 8, marginTop: 10,
  },
  submitText: {
    textAlign: 'center', color: '#fff',
    fontWeight: 'bold', fontSize: 16,
  },
});
