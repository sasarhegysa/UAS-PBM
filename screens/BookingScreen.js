import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const API = 'http://193.111.124.238:5000/api';

export default function BookingScreen() {
  const navigation = useNavigation();
  const [destinasi, setDestinasi] = useState([]);
  const [akomodasi, setAkomodasi] = useState([]);
  const [transportasi, setTransportasi] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAkomodasi, setSelectedAkomodasi] = useState(null);
  const [selectedTransportasi, setSelectedTransportasi] = useState(null);

  const [form, setForm] = useState({
    destinasiId: '',
    akomodasiId: '',
    kamarTipe: '',
    transportasiId: '',
    tanggalBerangkat: '',
    tanggalPulang: '',
    metodePembayaran: 'transfer',
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [dRes, aRes, tRes] = await Promise.all([
          axios.get(`${API}/destinasi`),
          axios.get(`${API}/akomodasi`),
          axios.get(`${API}/transportasi`)
        ]);
        setDestinasi(dRes.data);
        setAkomodasi(aRes.data);
        setTransportasi(tRes.data);
      } catch (err) {
        Alert.alert('Gagal memuat data pilihan');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'akomodasiId') {
      const selected = akomodasi.find((a) => a._id === value);
      setSelectedAkomodasi(selected || null);
      setForm((prev) => ({ ...prev, kamarTipe: '' }));
    }

    if (name === 'transportasiId') {
      const selected = transportasi.find((t) => t._id === value);
      setSelectedTransportasi(selected || null);
    }
  };

  const getJumlahMalam = () => {
    const { tanggalBerangkat, tanggalPulang } = form;
    if (!tanggalBerangkat || !tanggalPulang) return 0;
    const start = new Date(tanggalBerangkat);
    const end = new Date(tanggalPulang);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return isNaN(diff) || diff <= 0 ? 1 : Math.ceil(diff);
  };

  const totalHarga = (() => {
    const malam = getJumlahMalam();
    let hargaKamar = 0;
    if (selectedAkomodasi && form.kamarTipe) {
      const kamar = selectedAkomodasi.kamar.find((k) => k.nama === form.kamarTipe);
      if (kamar) hargaKamar = kamar.hargaPerMalam * malam;
    }
    const hargaTransport = selectedTransportasi?.harga || 0;
    const total = hargaKamar + hargaTransport;
    return isNaN(total) ? 0 : total;
  })();

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');

    if (isNaN(totalHarga) || totalHarga <= 0) {
      Alert.alert('Oops!', 'Pastikan semua pilihan sudah dipilih!');
      return;
    }

    const dataToSend = { ...form, totalHarga };

    try {
      await axios.post(`${API}/booking/custom`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Berhasil!', 'Booking berhasil. Silakan upload bukti pembayaran.');
      navigation.navigate('Dashboard');
    } catch (err) {
      console.error(err);
      Alert.alert('Gagal!', 'Terjadi kesalahan saat booking.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ef4444" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ padding: 20 }}>
        <Text style={styles.heading}>Booking Custom Perjalananmu</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Pilih Destinasi</Text>
          <Picker
            selectedValue={form.destinasiId}
            onValueChange={(val) => handleChange('destinasiId', val)}
            style={styles.picker}
          >
            <Picker.Item label="-- Pilih --" value="" />
            {destinasi.map((d) => (
              <Picker.Item key={d._id} label={`${d.nama} (${d.lokasi})`} value={d._id} />
            ))}
          </Picker>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Pilih Akomodasi</Text>
          <Picker
            selectedValue={form.akomodasiId}
            onValueChange={(val) => handleChange('akomodasiId', val)}
            style={styles.picker}
          >
            <Picker.Item label="-- Pilih --" value="" />
            {akomodasi.map((a) => (
              <Picker.Item key={a._id} label={`${a.nama} - ${a.tipe}`} value={a._id} />
            ))}
          </Picker>

          {selectedAkomodasi && (
            <>
              <Text style={styles.label}>Tipe Kamar</Text>
              <Picker
                selectedValue={form.kamarTipe}
                onValueChange={(val) => handleChange('kamarTipe', val)}
                style={styles.picker}
              >
                <Picker.Item label="-- Pilih --" value="" />
                {selectedAkomodasi.kamar.map((k, i) => (
                  <Picker.Item
                    key={i}
                    label={`${k.nama} - Kapasitas ${k.kapasitas} - Rp${k.hargaPerMalam.toLocaleString('id-ID')}`}
                    value={k.nama}
                  />
                ))}
              </Picker>
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Pilih Transportasi</Text>
          <Picker
            selectedValue={form.transportasiId}
            onValueChange={(val) => handleChange('transportasiId', val)}
            style={styles.picker}
          >
            <Picker.Item label="-- Pilih --" value="" />
            {transportasi.map((t) => (
              <Picker.Item
                key={t._id}
                label={`${t.namaOperator} - ${t.jenis} (${t.rute}) - Rp${t.harga.toLocaleString('id-ID')}`}
                value={t._id}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tanggal Berangkat</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={form.tanggalBerangkat}
            onChangeText={(val) => handleChange('tanggalBerangkat', val)}
            style={styles.input}
          />

          <Text style={styles.label}>Tanggal Pulang</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={form.tanggalPulang}
            onChangeText={(val) => handleChange('tanggalPulang', val)}
            style={styles.input}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Metode Pembayaran</Text>
          <Picker
            selectedValue={form.metodePembayaran}
            onValueChange={(val) => handleChange('metodePembayaran', val)}
            style={styles.picker}
          >
            <Picker.Item label="Transfer" value="transfer" />
            <Picker.Item label="QRIS" value="qris" />
          </Picker>
        </View>

        <View style={styles.card}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'right', color: '#b91c1c' }}>
            Total Harga: Rp{totalHarga.toLocaleString('id-ID')}
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Booking Sekarang</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
  },
  picker: {
    marginTop: -6,
    marginBottom: -6,
  },
  button: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
