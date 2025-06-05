// app/profile.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Adicionado MaterialIcons
import { Svg, Path, Circle } from 'react-native-svg'; // Para o avatar SVG e badge

// Componente SVG simples para placeholder do avatar
const DefaultAvatarSvg = ({ size = 100, color = "#E0E0E0" }) => (
  <Svg height={size} width={size} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="48" fill={color} />
    <Path
      d="M50 42c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
      fill="#FFF"
    />
    <Path
      d="M50 68c-11.028 0-20 4.486-20 10v2h40v-2c0-5.514-8.972-10-20-10z"
      fill="#FFF"
    />
  </Svg>
);

// Componente para barra de progresso
const ProgressBar = ({ progress = 0 , color = "#7C3AED", height = 8 }) => (
  <View style={[styles.progressBarBackground, { height }]}>
    <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: color, height }]} />
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  // Para exemplo, vamos deixar fixo, mas idealmente viria do seu estado/contexto de usuário
  const [userName, setUserName] = useState('Joãozinho Silva');
  const [userRole, setUserRole] = useState('Convidado'); // Ex: Convidado, Verificado, Premium
  const [identityVerification, setIdentityVerification] = useState(76); // Percentual

  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handleNavigateToEdit = () => {
    // Navegar para uma tela de edição de perfil mais detalhada
    // router.push('/profile/edit'); // Exemplo de rota
    Alert.alert("Editar Perfil", "Navegar para tela de edição de informações pessoais.");
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIconContainer}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.customHeaderTitle}>Perfil</Text>
        <TouchableOpacity onPress={handleNotificationPress} style={styles.headerIconContainer}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          {/* Badge de notificação (opcional) */}
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Seção do Avatar e Info Básica */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
            ) : (
              <DefaultAvatarSvg size={100} color="#E9D5FF" /> // Cor roxa clara para o placeholder
            )}
            {/* Badge de Verificado (SVG) */}
            <View style={styles.verifiedBadge}>
              <Svg height="24" width="24" viewBox="0 0 24 24">
                <Circle cx="12" cy="12" r="11" fill="#7C3AED" />
                <Path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#FFF"/>
              </Svg>
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.userRoleContainer}>
            <Text style={styles.userRole}>{userRole}</Text>
            <TouchableOpacity onPress={() => Alert.alert("Editar", "Ação para editar nome/role")}>
              <MaterialIcons name="edit" size={16} color="#7C3AED" style={{ marginLeft: 8 }}/>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card de Verificação de Identidade */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Verificação de Identidade</Text>
            <Text style={styles.verificationPercentage}>{identityVerification}%</Text>
          </View>
          <ProgressBar progress={identityVerification} />
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Completar Verificação</Text>
          </TouchableOpacity>
        </View>

        {/* Seção de Cards Informativos */}
        <View style={styles.infoCardsContainer}>
          <TouchableOpacity style={[styles.infoCard, styles.infoCardLeft]}>
            <View style={styles.infoCardHeader}>
              <Text style={styles.infoCardTag}>Novo</Text>
              <MaterialIcons name="arrow-forward-ios" size={14} color="#555" />
            </View>
            <Text style={styles.infoCardTitle}>Recursos de Novembro</Text>
            <Text style={styles.infoCardSubtitle}>Veja as últimas novidades!</Text>
            {/* Aqui poderia ter um SVG "fofinho" de fundo ou um ícone maior */}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.infoCard, styles.infoCardRight]}>
            <View style={styles.infoCardHeader}>
              <MaterialIcons name="storefront" size={18} color="#7C3AED" />
              <MaterialIcons name="arrow-forward-ios" size={14} color="#555" />
            </View>
            <Text style={styles.infoCardTitle}>Anuncie seu Espaço</Text>
            <Text style={styles.infoCardSubtitle}>Simples de configurar e lucrar.</Text>
          </TouchableOpacity>
        </View>

        {/* Seção de Configurações */}
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingsItem} onPress={handleNavigateToEdit}>
            <View style={styles.settingsItemIconContainer}>
              <Ionicons name="person-outline" size={22} color="#7C3AED" />
            </View>
            <Text style={styles.settingsItemText}>Informações Pessoais</Text>
            <MaterialIcons name="chevron-right" size={24} color="#BBB" />
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/notifications')}>
            <View style={styles.settingsItemIconContainer}>
              <Ionicons name="notifications-outline" size={22} color="#7C3AED" />
            </View>
            <Text style={styles.settingsItemText}>Notificações</Text>
            <MaterialIcons name="chevron-right" size={24} color="#BBB" />
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity style={styles.settingsItem} onPress={() => Alert.alert("Privacidade", "Abrir configurações de privacidade.")}>
            <View style={styles.settingsItemIconContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#7C3AED" />
            </View>
            <Text style={styles.settingsItemText}>Privacidade</Text>
            <MaterialIcons name="chevron-right" size={24} color="#BBB" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/')}>
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Um cinza bem claro para o fundo
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF', // Fundo branco para o header
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerIconContainer: {
    padding: 6,
    position: 'relative',
  },
  customHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C3AED', // Cor do badge
    borderWidth: 1,
    borderColor: '#FFF',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
    width: 104, // Tamanho do avatar + borda do badge
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#E9D5FF', // Borda roxa clara
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFF', // Fundo branco para o badge se destacar
    borderRadius: 12,
    padding: 1, // Pequeno padding para a sombra do SVG funcionar melhor
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1, },
    shadowOpacity: 0.15,
    shadowRadius: 2.0,
    elevation: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userRoleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRole: {
    fontSize: 15,
    color: '#666',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  verificationPercentage: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  progressBarBackground: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 12,
  },
  progressBarFill: {
    borderRadius: 4,
  },
  cardButton: {
    backgroundColor: '#F0E6FF', // Roxo bem clarinho
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cardButtonText: {
    color: '#7C3AED',
    fontWeight: '600',
    fontSize: 14,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%', // Para duas colunas
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardLeft: {
    // pode ter estilos específicos se necessário
  },
  infoCardRight: {
    // pode ter estilos específicos se necessário
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCardTag: {
    backgroundColor: '#E9D5FF', // Roxo claro
    color: '#7C3AED',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden', // para borderRadius no iOS
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoCardSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8, // Menor margem pois vem depois de cards
    marginBottom: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingsItemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0E6FF', // Roxo bem claro
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  settingsDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 4, // Pequena margem para a linha
    marginLeft: 48, // Para alinhar com o texto, após o ícone
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: '#FFF', // Botão com fundo branco
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D5FF', // Borda roxa clara
  },
  logoutButtonText: {
    color: '#C026D3', // Um tom de roxo/pink para o texto de logout
    fontSize: 15,
    fontWeight: '600',
  },
});