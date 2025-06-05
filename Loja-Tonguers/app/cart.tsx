// app/cart.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useCart, CartItem } from './context/CartContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, clearCart } = useCart();

  // Calcula subtotal somando os preços (assume-se formato "$123.00")
  const subtotal = items.reduce((sum, item) => {
    const num = parseFloat(item.price.replace(/[^0-9.-]+/g, '')) || 0;
    return sum + num;
  }, 0);
  const total = subtotal.toFixed(2);

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text numberOfLines={1} style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
        <Ionicons name="trash-outline" size={24} color="#e11d48" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === 'ios' ? 50 : 0 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Carrinho</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* Total e ação */}
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.subtotalText}>Subtotal:</Text>
              <Text style={styles.totalText}>${total}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => alert('Compra finalizada!')}>
              <Text style={styles.checkoutText}>Finalizar Compra</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearBtn} onPress={() => clearCart()}>
              <Text style={styles.clearText}>Limpar Carrinho</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginTop: 4,
  },
  removeBtn: {
    padding: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  checkoutBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  clearText: {
    color: '#e11d48',
    fontSize: 14,
    fontWeight: '600',
  },
});
