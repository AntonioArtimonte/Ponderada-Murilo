import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  Dimensions,
  Modal, // Importar Modal
  FlatList, // Importar FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const MAX_IMAGES = 5;
const IMAGE_GRID_PADDING = 20;
const IMAGE_ITEM_SPACING = 10;
const ITEMS_PER_ROW = 3;
const imageItemSize = (width - (IMAGE_GRID_PADDING * 2) - (IMAGE_ITEM_SPACING * (ITEMS_PER_ROW -1 ))) / ITEMS_PER_ROW;

const CATEGORIES = [
  { label: 'Electronics', icon: '💻', id: 'electronics' },
  { label: 'Clothing', icon: '👕', id: 'clothing' },
  { label: 'Home', icon: '🏠', id: 'home' },
  { label: 'Books', icon: '📚', id: 'books' },
  { label: 'Toys', icon: '🧸', id: 'toys' },
];


export default function AddProductScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<{ label: string; icon: string; id: string } | null>(null);
  const [condition, setCondition] = useState<'new' | 'used' | null>(null);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);


  const router = useRouter();

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted' && mediaStatus.status === 'granted');
    })();
  }, []);

  const handlePickImage = async (type: 'camera' | 'library') => {
    if (photoUris.length >= MAX_IMAGES) {
      Alert.alert('Limite atingido', `Você pode adicionar no máximo ${MAX_IMAGES} imagens.`);
      return;
    }
    let result;
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    };

    if (type === 'camera') {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUris(prevUris => [...prevUris, result.assets[0].uri]);
    }
  };

  const triggerImagePicker = () => {
     Alert.alert(
      "Selecionar Imagem",
      "Escolha a origem da imagem:",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Câmera", onPress: () => handlePickImage('camera') },
        { text: "Galeria", onPress: () => handlePickImage('library') },
      ]
    );
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setPhotoUris(prevUris => prevUris.filter((_, index) => index !== indexToRemove));
  };

  const handlePublish = () => {
    if (photoUris.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos uma imagem para o produto.');
      return;
    }
    if (!productName.trim() || !price.trim() || !description.trim() || !selectedCategory || !condition) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }
    console.log({
      photoUris,
      productName,
      description,
      price,
      category: selectedCategory.label, // Enviar o label da categoria
      categoryId: selectedCategory.id, // ou o ID
      condition
    });

    Alert.alert('Sucesso!', 'Produto publicado com sucesso!');
    router.back();
  };

  const openCategoryModal = () => setIsCategoryModalVisible(true);
  const closeCategoryModal = () => setIsCategoryModalVisible(false);

  const handleSelectCategory = (category: { label: string; icon: string; id: string }) => {
    setSelectedCategory(category);
    closeCategoryModal();
  };


  const renderCategoryItem = ({ item }: { item: { label: string; icon: string; id: string }}) => (
    <TouchableOpacity
      style={[
        styles.categoryModalItem,
        selectedCategory?.id === item.id && styles.categoryModalItemSelected
      ]}
      onPress={() => handleSelectCategory(item)}
    >
      <Text style={styles.categoryModalItemIcon}>{item.icon}</Text>
      <Text
        style={[
          styles.categoryModalItemLabel,
          selectedCategory?.id === item.id && styles.categoryModalItemLabelSelected
      ]}>{item.label}</Text>
       {selectedCategory?.id === item.id && <Ionicons name="checkmark-circle" size={22} color="#7C3AED" />}
    </TouchableOpacity>
  );


  if (hasPermission === null) {
    return <View style={styles.centerMessage}><Text>Solicitando permissões...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.centerMessage}><Text>Acesso à câmera ou galeria negado.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Novo Produto</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Imagens do Produto ({photoUris.length}/{MAX_IMAGES})</Text>
        <View style={styles.imageGridContainer}>
          {photoUris.map((uri, index) => (
            <View key={index.toString()} style={styles.imageThumbnailWrapper}>
              <Image source={{ uri }} style={styles.imageThumbnail} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => handleRemoveImage(index)}>
                <Ionicons name="close-circle" size={22} color="#FFF" style={styles.removeImageIcon} />
              </TouchableOpacity>
            </View>
          ))}
          {photoUris.length < MAX_IMAGES && (
            <TouchableOpacity style={styles.addImageButton} onPress={triggerImagePicker}>
              <MaterialIcons name="add-photo-alternate" size={30} color="#7C3AED" />
              <Text style={styles.addImageButtonText}>Adicionar</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>Detalhes do Produto</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Nome do Produto"
            value={productName}
            onChangeText={setProductName}
            placeholderTextColor="#888"
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Descrição detalhada do produto"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Preço (R$)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
        </View>

        <Text style={styles.sectionTitle}>Categoria</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.tappableRow} onPress={openCategoryModal}>
            <MaterialIcons name="category" size={20} color={selectedCategory ? "#7C3AED" : "#555"} />
            <Text style={[styles.tappableRowText, selectedCategory && styles.tappableRowTextSelected]}>
              {selectedCategory ? selectedCategory.label : 'Selecionar Categoria'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Condição</Text>
        <View style={[styles.card, styles.conditionContainer]}>
          <TouchableOpacity
            style={[styles.conditionButton, condition === 'new' && styles.conditionButtonSelected]}
            onPress={() => setCondition('new')}
          >
            <Text style={[styles.conditionButtonText, condition === 'new' && styles.conditionButtonTextSelected]}>Novo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.conditionButton, condition === 'used' && styles.conditionButtonSelected]}
            onPress={() => setCondition('used')}
          >
            <Text style={[styles.conditionButtonText, condition === 'used' && styles.conditionButtonTextSelected]}>Usado</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
          <Text style={styles.publishButtonText}>Publicar Produto</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCategoryModalVisible}
        onRequestClose={closeCategoryModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Categoria</Text>
              <TouchableOpacity onPress={closeCategoryModal} style={styles.modalCloseButton}>
                <Ionicons name="close" size={28} color="#555" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CATEGORIES}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.categoryModalList}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerButton: {
    padding: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  centerMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: IMAGE_GRID_PADDING,
  },
  imageGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: IMAGE_GRID_PADDING - (IMAGE_ITEM_SPACING / 2),
    marginBottom: 10,
  },
  imageThumbnailWrapper: {
    width: imageItemSize,
    height: imageItemSize,
    borderRadius: 8,
    margin: IMAGE_ITEM_SPACING / 2,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 11,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageIcon: {},
  addImageButton: {
    width: imageItemSize,
    height: imageItemSize,
    borderRadius: 8,
    margin: IMAGE_ITEM_SPACING / 2,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: '#7C3AED',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: IMAGE_GRID_PADDING,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.00,
    elevation: 2,
  },
  input: {
    backgroundColor: '#F4F6F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
    color: '#333',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  tappableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tappableRowText: {
    flex: 1,
    fontSize: 15,
    color: '#555', // Cinza para não selecionado
    marginLeft: 12,
  },
  tappableRowTextSelected: {
    color: '#7C3AED', // Roxo para selecionado
    fontWeight: '600',
  },
  conditionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  conditionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#F8F9FA' // Fundo levemente cinza
  },
  conditionButtonSelected: {
    backgroundColor: '#E9D5FF',
    borderColor: '#7C3AED',
  },
  conditionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  conditionButtonTextSelected: {
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  publishButton: {
    backgroundColor: '#7C3AED',
    marginHorizontal: IMAGE_GRID_PADDING,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Overlay escuro
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 0, // Padding será interno nos elementos
    paddingBottom: 10, // Espaço abaixo da lista
    width: width * 0.9, // 90% da largura da tela
    maxHeight: height * 0.7, // 70% da altura da tela
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4, // Área de toque
  },
  categoryModalList: {
    paddingHorizontal: 10, // Espaço nas laterais da lista
    paddingTop: 10, // Espaço acima do primeiro item
  },
  categoryModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8, // Espaço entre itens
    backgroundColor: '#F8F9FA', // Fundo de item levemente cinza
    borderWidth: 1,
    borderColor: 'transparent', // Para efeito de seleção
  },
  categoryModalItemSelected: {
    backgroundColor: '#E9D5FF', // Roxo claro para selecionado
    borderColor: '#C084FC', // Borda roxa mais forte
  },
  categoryModalItemIcon: {
    fontSize: 20, // Tamanho do emoji/icon
    marginRight: 12,
  },
  categoryModalItemLabel: {
    flex: 1, // Para o checkmark ficar no final
    fontSize: 16,
    color: '#333',
  },
  categoryModalItemLabelSelected: {
    fontWeight: '600',
    color: '#581C87', // Roxo escuro para texto selecionado
  },
});
// Adicionar height para o modalContainer
const { height } = Dimensions.get('window');