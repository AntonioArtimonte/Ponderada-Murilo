import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { faker } from '@faker-js/faker';
import { useRouter } from 'expo-router';
import { useImage } from './context/ImageContext';

import { useAuth } from './context/AuthContext';

const { width } = Dimensions.get('window');

faker.locale = 'en';

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: faker.commerce.price({ symbol: '$' }),
    image: faker.image.urlLoremFlickr({ category: 'product' }),
  }));
};

const CATEGORIES = [
  { label: 'Electronics', icon: '💻' },
  { label: 'Clothing', icon: '👕' },
  { label: 'Home', icon: '🏠' },
  { label: 'Books', icon: '📚' },
  { label: 'Toys', icon: '🧸' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { imageUri } = useImage();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts] = useState(generateProducts(10000));
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const CHUNK = 20;

  const { user } = useAuth();

  const loadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const start = (page - 1) * CHUNK;
    const end = start + CHUNK;
    const nextChunk = allProducts.slice(start, end);
    setTimeout(() => {
      setProducts(prev => [...prev, ...nextChunk]);
      setPage(prev => prev + 1);
      setLoadingMore(false);
    }, 300);
  };

  useEffect(() => {
    loadMore();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => router.push(`/modal/product/${item.id}`)}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View>
      {/* Display last selected image if available */}
      {imageUri && (
        <View style={styles.uploadedImageContainer}>
          <Text style={styles.uploadedText}>Última imagem selecionada:</Text>
          <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Welcome, {user?.name} 👋</Text>
          <Text style={styles.subHeader}>Explore our marketplace</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <View style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/camera')}>
          <Text style={styles.quickText}>+ New Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickCard}>
          <Text style={styles.quickText}>📦 My Listings</Text>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerText}>🔥 Limited Offer</Text>
          <Text style={styles.bannerTitle}>Post now and get +15% reach</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Boost</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {CATEGORIES.map((cat, i) => (
          <TouchableOpacity key={i} style={styles.categoryCard}>
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Today’s Highlights</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === 'ios' ? 50 : 0 }]}>      
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.productsContainer}
        ListHeaderComponent={ListHeader}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={loadingMore ? <ActivityIndicator color="#7C3AED" /> : null}
        showsVerticalScrollIndicator={false}
      />
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
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  subHeader: { fontSize: 14, color: '#555' },
  avatar: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  quickCard: {
    backgroundColor: '#F4F4F4',
    borderRadius: 14,
    padding: 16,
    flex: 1,
    alignItems: 'center',
  },
  quickText: { color: '#000', fontWeight: '600' },

  banner: {
    backgroundColor: '#7C3AED',
    margin: 24,
    borderRadius: 16,
    padding: 20,
  },
  bannerText: { color: '#fff', fontSize: 14 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginVertical: 4 },
  bannerButton: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bannerButtonText: { color: '#fff', fontWeight: 'bold' },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 16,
    color: '#000',
  },

  categories: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#F4F4F4',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: 80,
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 12,
    marginTop: 6,
    color: '#000',
  },

  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16,
    width: (width - 32 - 12) / 2,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 100,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    margin: 8,
    marginBottom: 2,
    color: '#000',
  },
  productPrice: {
    marginHorizontal: 8,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#7C3AED',
  },

  uploadedImageContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  uploadedText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  uploadedImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
});