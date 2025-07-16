// screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react-native';

const API = process.env.EXPO_PUBLIC_API_URL || 'http://193.111.124.238:5000/api';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/auth/register`, { nama, email, password });
      setSuccess('Pendaftaran berhasil! Silakan login.');

      setNama('');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        navigation.replace('Login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Daftar Traveloop</Text>
      <Text style={styles.subtext}>Mulailah perjalananmu bersama kami</Text>

      {error !== '' && <Text style={styles.error}>{error}</Text>}
      {success !== '' && <Text style={styles.success}>{success}</Text>}

      <TextInput
        placeholder="Nama Lengkap"
        value={nama}
        onChangeText={setNama}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!show}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
        />
        <TouchableOpacity onPress={() => setShow(!show)} style={styles.eyeIcon}>
          {show ? <EyeOff size={20} color="#aaa" /> : <Eye size={20} color="#aaa" />}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register Account</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.loginRedirect}>
        Sudah punya akun?{' '}
        <Text
          onPress={() => navigation.replace('Login')}
          style={{ color: '#007bff', textDecorationLine: 'underline' }}
        >
          Login di sini
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff'
  },
  logo: {
    fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#f97316',
    marginBottom: 8,
  },
  subtext: {
    textAlign: 'center', fontSize: 14, color: '#666', marginBottom: 24,
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    paddingRight: 12, marginBottom: 16,
  },
  eyeIcon: {
    paddingHorizontal: 4,
  },
  button: {
    backgroundColor: '#000', padding: 14,
    borderRadius: 10, alignItems: 'center',
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold', fontSize: 16,
  },
  error: {
    color: 'red', textAlign: 'center', marginBottom: 10,
  },
  success: {
    color: 'green', textAlign: 'center', marginBottom: 10,
  },
  loginRedirect: {
    marginTop: 24, textAlign: 'center', fontSize: 14, color: '#444',
  },
});
