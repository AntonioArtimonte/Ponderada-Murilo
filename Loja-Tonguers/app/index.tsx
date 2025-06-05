import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/login');
    }, 10); // pequeno atraso para evitar erro de layout

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View>
      <Text>Carregando...</Text>
    </View>
  );
}