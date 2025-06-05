import { Stack } from 'expo-router';
import { ImageProvider } from './context/ImageContext';
import { CartProvider } from './context/CartContext';

export default function Layout() {
  return (
    <ImageProvider>
      <CartProvider>
    <Stack
      screenOptions={{
        headerShown: false, // 👈 Desativa o header globalmente
      }}
    />
      </CartProvider>
    </ImageProvider>
  );
}