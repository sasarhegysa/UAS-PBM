import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CardDestinasi = ({ destinasi }) => {
  const navigation = useNavigation();

  if (!destinasi) return null;

  const {
    _id,
    nama,
    lokasi,
    deskripsi,
    hargaTiket,
    foto
  } = destinasi;

  const handleDetail = () => {
    navigation.navigate('DetailDestinasi', { id: _id });
  };

  return (
    <View style={styles.card}>
      {foto ? (
        <Image
          source={{ uri: `http://193.111.124.238:5000${foto}` }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{nama}</Text>
        <Text style={styles.location}>📍 {lokasi}</Text>
        <Text style={styles.price}>Rp{parseInt(hargaTiket).toLocaleString()}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {deskripsi}
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleDetail}>
          <Text style={styles.buttonText}>Lihat Detail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CardDestinasi;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    marginBottom: 16,
    marginHorizontal: 8,
    width: 280,
  },
  image: {
    height: 140,
    width: '100%',
    backgroundColor: '#eee',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#888',
    fontSize: 12,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#6b7280',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 4,
    color: '#1f2937',
  },
  description: {
    fontSize: 12,
    color: '#4b5563',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
