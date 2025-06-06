import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ImageProvider } from './context/ImageContext';
import { NotificationsProvider } from './context/NotificationsContext';

export default function Layout() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <ImageProvider>
          <CartProvider>
            <Stack
              screenOptions={{
                headerShown: false, // 👈 Desativa o header globalmente
              }}
            />
          </CartProvider>
        </ImageProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}