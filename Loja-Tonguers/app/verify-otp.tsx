import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyOtpScreen() {
  const router = useRouter();
  // Pegar o parâmetro de email enviado pela rota anterior
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');

  const handleConfirm = () => {
    if (code.length === 6) {
      Alert.alert('Código validado', 'Seu código foi confirmado com sucesso!');
      router.replace('/login'); // ou prossiga para reset de senha, se preferir
    } else {
      Alert.alert('Erro', 'Informe um código de 6 dígitos válido.');
    }
  };

  const handleResend = () => {
    Alert.alert('Código reenviado', `Um novo código foi enviado para ${email}.`);
    // Aqui, em um app real, você chamaria sua API de OTP novamente
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === 'ios' ? 50 : 0 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={64} color="#7C3AED" />
        </View>

        <Text style={styles.title}>Verificação de Código</Text>
        {/* Mostrar qual e-mail recebeu o código */}
        {email && <Text style={styles.subtitleSmall}>Código enviado para {email}</Text>}
        <Text style={styles.subtitle}>
          Insira o código de 6 dígitos enviado para o seu e-mail
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Código OTP</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="••••••"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
            <Text style={styles.resendText}>Reenviar código</Text>
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
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleSmall: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 24,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 18,
    letterSpacing: 8,
    textAlign: 'center',
  },
  confirmButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '600',
  },
});
