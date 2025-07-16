import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

const HeaderMobile = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const handlePress = () => {
    if (user) {
      navigation.navigate(user.role === 'admin' ? 'AdminDashboard' : 'UserDashboard');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.logoArea}
      >
        <Text style={styles.logoText}>Traveloop</Text>
        <ArrowRight size={20} color="#EF4444" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Text style={styles.buttonText}>
          {user ? 'Dashboard' : 'Get in Touch'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderMobile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginRight: 6,
  },
  button: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#111827',
  },
});
