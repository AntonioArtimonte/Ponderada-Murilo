import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

faker.locale = 'en';

export default function ProductDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const [favorited, setFavorited] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: faker.string.uuid(),
      name: product.name,
      price: product.price,
      image: product.image,
    });
    router.push('/cart');
  };

  const [product, setProduct] = useState({
    name: '',
    price: '',
    oldPrice: '',
    description: '',
    image: '',
    rating: 4.5,
    shop: faker.company.name(),
  });

  useEffect(() => {
    if (id) {
      setProduct({
        name: faker.commerce.productName(),
        price: faker.commerce.price({ symbol: '$' }),
        oldPrice: faker.commerce.price({ symbol: '$' }),
        description: faker.commerce.productDescription(),
        image: faker.image.urlLoremFlickr({ category: 'product' }),
        rating: 4.5,
        shop: faker.company.name(),
      });
    }
  }, [id]);

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === 'ios' ? 40 : 0 }]}>      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFavorited(!favorited)} style={styles.iconBtn}>
            <Ionicons name={favorited ? 'heart' : 'heart-outline'} size={20} color={favorited ? '#e11d48' : '#000'} />
          </TouchableOpacity>
        </View>

        {/* Image */}
        <Image source={{ uri: product.image }} style={styles.image} />

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.shop}>Shop: {product.shop}</Text>
          <Text style={styles.rating}>⭐ {product.rating}</Text>

          {/* Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <MaterialIcons name="eco" size={16} color="#4ade80" />
              <Text style={styles.badgeText}>Vegetarian</Text>
            </View>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="star-crescent" size={16} color="#facc15" />
              <Text style={styles.badgeText}>Halal Food</Text>
            </View>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="noodles" size={16} color="#38bdf8" />
              <Text style={styles.badgeText}>Gluten-Free</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.detailsTitle}>Details</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Price and CTA */}
          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.price}>{product.price}</Text>
              <Text style={styles.oldPrice}>{product.oldPrice}</Text>
            </View>
            <TouchableOpacity style={styles.buyButton} onPress={handleAddToCart}>
              <Text style={styles.buyButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export const options = {
  presentation: 'modal',
  headerShown: false,
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingBottom: 48 },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  iconBtn: {
    backgroundColor: '#f2f2f2',
    padding: 8,
    borderRadius: 12,
  },

  image: {
    width: '100%',
    height: 280,
    resizeMode: 'contain',
  },

  infoSection: {
    backgroundColor: '#fff',
    marginTop: -20,
    paddingHorizontal: 16,
    paddingTop: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  shop: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    fontSize: 14,
    color: '#444',
    marginVertical: 8,
  },

  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  badge: {
    backgroundColor: '#f4f4f4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#000',
  },

  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 20,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  oldPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  buyButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});