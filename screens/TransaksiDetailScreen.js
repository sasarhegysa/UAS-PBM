// screens/TransaksiDetailScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API = 'http://193.111.124.238:5000/api';

export default function TransaksiDetailScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const id = params?.id;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API}/booking/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(res.data);
    } catch (err) {
      Alert.alert('Error', 'Gagal memuat data booking');
    } finally {
      setLoading(false);
    }
  };

  const pickFileAndUpload = async (type) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true
    });
    if (result?.assets?.length > 0) {
      const file = result.assets[0];
      const formData = new FormData();
      formData.append(type, {
        uri: file.uri,
        type: file.mimeType,
        name: file.name
      });

      const token = await AsyncStorage.getItem('token');
      let endpoint = `${API}/booking/${id}/upload`;
      if (type === 'ktp' || type === 'paspor') endpoint = `${API}/booking/${id}/traveler`;

      try {
        await axios.patch(endpoint, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        Alert.alert('Sukses', `${type.toUpperCase()} berhasil diupload`);
        fetchBooking();
      } catch (err) {
        Alert.alert('Gagal', `Upload ${type.toUpperCase()} gagal`);
      }
    }
  };

  const cancelBooking = async () => {
    Alert.alert('Konfirmasi', 'Yakin ingin membatalkan booking?', [
      { text: 'Batal' },
      {
        text: 'Ya', onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.patch(`${API}/booking/${id}/cancel`, {}, {
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert('Sukses', 'Booking berhasil dibatalkan');
            fetchBooking();
          } catch (err) {
            Alert.alert('Gagal', 'Pembatalan gagal');
          }
        }
      }
    ]);
  };

  useEffect(() => { fetchBooking(); }, [id]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#ef4444" /></View>;
  if (!booking) return <View style={styles.center}><Text>Data tidak ditemukan</Text></View>;

  const isUploadLengkap = booking.buktiPembayaran && booking.ktp && booking.paspor;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detail Booking</Text>
      <View style={styles.card}>
            <Text>
            <Text style={styles.bold}>Jenis:</Text> 
            {booking.package ? 'Paket' : booking.event ? 'Event' : booking.rekomendasi ? 'Rekomendasi' : 'Manual'}
            </Text>

            <Text>
            <Text style={styles.bold}>Destinasi:</Text> 
            {booking.destinasi?.nama 
                || (typeof booking.rekomendasi?.destinasi === 'string' ? booking.rekomendasi?.destinasi : booking.rekomendasi?.destinasi?.nama)
                || booking.package?.destinasi?.nama 
                || '-'}
            </Text>

            <Text>
            <Text style={styles.bold}>Akomodasi:</Text> 
            {booking.akomodasi?.nama || booking.rekomendasi?.akomodasi || booking.package?.akomodasi?.nama || '-'}
            </Text>

            <Text>
            <Text style={styles.bold}>Transportasi:</Text> 
            {booking.transportasi?.jenis || booking.rekomendasi?.transportasi || booking.package?.transportasi?.operator || '-'}
            </Text>

            <Text>
            <Text style={styles.bold}>Tanggal:</Text> 
            {new Date(booking.tanggalBerangkat).toLocaleDateString()} - {new Date(booking.tanggalPulang).toLocaleDateString()}
            </Text>

            <Text>
            <Text style={styles.bold}>Status:</Text> {booking.status}
            </Text>

            <Text>
            <Text style={styles.bold}>Total:</Text> Rp{booking.totalHarga?.toLocaleString('id-ID') || '0'}
            </Text>

            <Text>
            <Text style={styles.bold}>Bukti Pembayaran:</Text> 
            {booking.buktiPembayaran ? 'Sudah diupload' : 'Belum ada'}
            </Text>

      </View>

      {booking.status === 'pending' && (
        <View style={styles.section}>
          {!booking.buktiPembayaran && (
            <TouchableOpacity onPress={() => pickFileAndUpload('bukti')} style={styles.button}>
              <Text style={styles.buttonText}>Upload Bukti Pembayaran</Text>
            </TouchableOpacity>
          )}

          {(!booking.ktp || !booking.paspor) && (
            <>
              <TouchableOpacity onPress={() => pickFileAndUpload('ktp')} style={styles.buttonSecondary}>
                <Text style={styles.buttonText}>Upload KTP</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickFileAndUpload('paspor')} style={styles.buttonSecondary}>
                <Text style={styles.buttonText}>Upload Paspor</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={cancelBooking} style={[styles.button, { backgroundColor: '#dc2626' }]}>
            <Text style={styles.buttonText}>Batalkan Booking</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 24, elevation: 2, gap: 8
  },
  bold: { fontWeight: 'bold', color: '#374151' },
  section: { gap: 12 },
  button: {
    backgroundColor: '#10b981', padding: 14,
    borderRadius: 8, alignItems: 'center', marginTop: 10
  },
  buttonSecondary: {
    backgroundColor: '#3b82f6', padding: 14,
    borderRadius: 8, alignItems: 'center', marginTop: 10
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold', fontSize: 15
  }
});
