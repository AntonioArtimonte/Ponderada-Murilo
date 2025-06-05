import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import RegisterIllustration from '../assets/images/register_screen.svg'; // usa a mesma ou outra SVG aqui
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = () => {
    if (name && email && senha) {
      Alert.alert('Conta criada com sucesso!');
      router.replace('/login');
    } else {
      Alert.alert('Erro', 'Preencha todos os campos');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === 'ios' ? 50 : 0 }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <RegisterIllustration width={250} height={180} style={styles.image} />

        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>Register to get started</Text>

        <View style={styles.form}>
          {/* NAME */}
          <Text style={styles.label}>Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
          </View>

          {/* EMAIL */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          {/* PASSWORD */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Choose a password"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/login')} style={styles.loginButton}>
            <Text style={styles.loginText}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    alignItems: 'center',
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 320,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#000',
    marginTop: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  registerButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  registerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    height: 48,
    borderColor: '#7C3AED',
    borderWidth: 1.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#7C3AED',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
