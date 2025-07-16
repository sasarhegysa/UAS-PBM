import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User, Mail, LogOut, MapPinned,
  CalendarCheck, Plane, Home, FileText
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const API = 'http://193.111.124.238:5000/api';

export default function DashboardScreen() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      Alert.alert('Sesi Habis', 'Silakan login kembali.');
      navigation.navigate('Login');
    }
  };

  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API}/booking`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  useEffect(() => {
    fetchUser();
    fetchBookings();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* USER SECTION */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <User color="#fff" size={28} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>Hi, {user?.nama}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* QUICK INFO */}
      <View style={styles.infoSection}>
        <View style={styles.infoBox}>
          <Mail color="#3b82f6" />
          <Text style={styles.infoTitle}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoBox}>
          <User color="#22c55e" />
          <Text style={styles.infoTitle}>Role</Text>
          <Text style={styles.infoValue}>{user?.role}</Text>
        </View>
      </View>

      {/* QUICK ACTION */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Akses Cepat</Text>
        <View style={styles.quickActionRow}>
          <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Home')}>
            <Home color="#4f46e5" />
            <Text style={styles.quickText}>Beranda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickItem, styles.disabled]}>
            <MapPinned color="#aaa" />
            <Text style={styles.quickTextDisabled}>Eksplor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickItem, styles.disabled]}>
            <Plane color="#aaa" />
            <Text style={styles.quickTextDisabled}>Paket</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BOOKING HISTORY */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <CalendarCheck size={20} /> Riwayat Booking
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#ef4444" />
        ) : bookings.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada booking.</Text>
        ) : (
          bookings.map((item) => (
            <View key={item._id} style={styles.bookingItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bookingDest}>{item.tujuan}</Text>
                <Text style={styles.bookingDate}>{new Date(item.tanggal).toLocaleDateString()}</Text>
                <Text style={styles.bookingStatus}>
                  Status: <Text style={{ color: '#2563eb' }}>{item.status}</Text>
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => navigation.navigate('TransaksiDetail', { id: item._id })}
              >
                <FileText size={16} color="#fff" />
                <Text style={styles.viewText}>Lihat</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9fafb' },
  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1d4ed8', padding: 16,
    borderRadius: 14, marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#3b82f6', padding: 12,
    borderRadius: 100, marginRight: 14,
  },
  userName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  userEmail: { color: '#e0e7ff', fontSize: 13 },
  logoutBtn: {
    backgroundColor: '#ef4444',
    padding: 8, borderRadius: 8, marginLeft: 10,
  },

  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 14,
    marginHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
    elevation: 1,
  },
  infoTitle: { fontSize: 13, color: '#6b7280' },
  infoValue: { fontWeight: 'bold', fontSize: 14 },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 14,
    color: '#1f2937',
  },
  quickActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 10,
  },
  disabled: {
    opacity: 0.4,
  },
  quickText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
  },
  quickTextDisabled: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9ca3af',
  },

  bookingItem: {
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingDest: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  bookingDate: { fontSize: 12, color: '#6b7280' },
  bookingStatus: { fontSize: 12, marginTop: 2 },
  viewBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewText: { color: '#fff', fontSize: 13 },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 12,
  },
});
