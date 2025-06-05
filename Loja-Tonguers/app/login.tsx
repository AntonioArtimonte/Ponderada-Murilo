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
import LoginIllustration from '../assets/images/shop_img.svg';
import { Ionicons } from '@expo/vector-icons';

export const options = {
    headerShown: false,
  };
  

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (email === 'teste' && senha === 'teste') {
      Alert.alert('Login feito com sucesso!');
      router.replace('/home');
    } else {
      Alert.alert('Erro', 'Email ou senha inválidos!');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LoginIllustration width={250} height={180} style={styles.image} />

        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <View style={styles.form}>
          {/* EMAIL */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.forgotWrapper}>
            <Text style={styles.forgot} onPress={() => router.push('/forgot-password')}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerButton}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  forgotWrapper: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgot: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButton: {
    width: '100%',
    height: 48,
    borderColor: '#7C3AED',
    borderWidth: 1.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#7C3AED',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
