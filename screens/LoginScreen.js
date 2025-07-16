// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';

const API = process.env.EXPO_PUBLIC_API_URL || 'http://193.111.124.238:5000/api';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
        const res = await axios.post(`${API}/auth/login`, { email, password });
        const token = res.data.token;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('role', res.data.role);

        // ✅ Reset ke tab navigator
        navigation.reset({
        index: 0,
        routes: [
            {
            name: 'MainApp',
            state: {
                index: 0,
                routes: [{ name: 'Home' }],
            },
            },
        ],
        });
    } catch (err) {
        setError(err.response?.data?.message || 'Login gagal');
    } finally {
        setLoading(false);
    }
    };


  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Traveloop</Text>
      <Text style={styles.subtext}>Login dan lanjutkan petualanganmu</Text>

      {error !== '' && <Text style={styles.error}>{error}</Text>}

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

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.or}>Atau</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.registerButton}
      >
        <Text style={styles.registerText}>Belum punya akun? Daftar di sini</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 24, backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32, fontWeight: 'bold', color: '#f97316', textAlign: 'center',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24,
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
  or: {
    textAlign: 'center', marginVertical: 20, color: '#aaa',
  },
  registerButton: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    padding: 12, alignItems: 'center',
  },
  registerText: {
    fontSize: 14, color: '#333',
  },
  error: {
    color: 'red', textAlign: 'center', marginBottom: 12,
  },
});
