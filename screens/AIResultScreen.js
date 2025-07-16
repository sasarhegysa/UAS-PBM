import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MapPin, Hotel, BusFront, Wallet, ArrowLeft, Settings
} from 'lucide-react-native';

const API = 'http://193.111.124.238:5000/api';

export default function AIResultScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = params?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`${API}/rekomendasi/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error('Gagal memuat data rekomendasi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ef4444" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#999' }}>Data tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* BACK */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <ArrowLeft size={18} color="#ef4444" />
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>

      {/* TITLE */}
      <Text style={styles.title}>✨ Rekomendasi Perjalananmu</Text>
      <Text style={styles.subtitle}>Hasil dari AI berdasarkan preferensimu</Text>

      {/* CARD */}
      <View style={styles.card}>
        <InfoRow icon={<MapPin color="#dc2626" size={24} />} label="Destinasi" value={data.destinasi} />
        <InfoRow icon={<Hotel color="#3b82f6" size={24} />} label="Akomodasi" value={data.akomodasi} />
        <InfoRow icon={<BusFront color="#10b981" size={24} />} label="Transportasi" value={data.transportasi} />
        <InfoRow
          icon={<Wallet color="#6366f1" size={24} />}
          label="Total Estimasi Biaya"
          value={`Rp${data.totalEstimasi.toLocaleString('id-ID')}`}
          bold
        />
      </View>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => navigation.navigate('BookingDariRekomendasi', { id })}
        >
          <Text style={styles.bookingText}>🚀 Booking Sekarang</Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>Butuh perjalanan yang lebih fleksibel?</Text>

        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('Booking')}
        >
          <Settings size={16} color="#2563eb" />
          <Text style={styles.customText}>Atur Perjalanan Custom</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value, bold }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, bold && styles.boldValue]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafb',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  backText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconWrap: {
    width: 36,
    alignItems: 'center',
    marginTop: 2,
  },
  label: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    color: '#111827',
    fontSize: 15,
  },
  boldValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111827',
  },
  ctaContainer: {
    alignItems: 'center',
    gap: 10,
  },
  bookingButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    shadowColor: '#ef4444',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bookingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoText: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 16,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  customText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
  },
});
