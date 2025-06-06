// app/profile.tsx

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Circle, Path, Svg } from 'react-native-svg';
import { useAuth } from './context/AuthContext';

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
const ProgressBar = ({ progress = 0, color = "#7C3AED", height = 8 }) => (
  <View style={[styles.progressBarBackground, { height }]}>
    <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: color, height }]} />
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [identityVerification, setIdentityVerification] = useState(76);

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
    router.push('/edit-profile');
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIconContainer}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.customHeaderTitle}>Profile</Text>
        <TouchableOpacity onPress={handleNotificationPress} style={styles.headerIconContainer}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Avatar and Basic Info Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
            ) : (
              <DefaultAvatarSvg size={100} color="#E9D5FF" />
            )}
            <View style={styles.verifiedBadge}>
              <Svg height="24" width="24" viewBox="0 0 24 24">
                <Circle cx="12" cy="12" r="11" fill="#7C3AED" />
                <Path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#FFF"/>
              </Svg>
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.userRoleContainer}>
            <Text style={styles.userRole}>{user.email}</Text>
            <TouchableOpacity onPress={() => handleNavigateToEdit()}>
              <MaterialIcons name="edit" size={16} color="#7C3AED" style={{ marginLeft: 8 }}/>
            </TouchableOpacity>
          </View>
        </View>

        {/* Identity Verification Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Identity Verification</Text>
            <Text style={styles.verificationPercentage}>{identityVerification}%</Text>
          </View>
          <ProgressBar progress={identityVerification} />
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Complete Verification</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingsItem} onPress={handleNavigateToEdit}>
            <View style={styles.settingsItemIconContainer}>
              <Ionicons name="person-outline" size={22} color="#7C3AED" />
            </View>
            <Text style={styles.settingsItemText}>Personal Information</Text>
            <MaterialIcons name="chevron-right" size={24} color="#BBB" />
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/notifications')}>
            <View style={styles.settingsItemIconContainer}>
              <Ionicons name="notifications-outline" size={22} color="#7C3AED" />
            </View>
            <Text style={styles.settingsItemText}>Notifications</Text>
            <MaterialIcons name="chevron-right" size={24} color="#BBB" />
          </TouchableOpacity>
          <View style={styles.settingsDivider} />
          <TouchableOpacity style={styles.settingsItem} onPress={() => Alert.alert("Privacy", "Open privacy settings.")}>
            <View style={styles.settingsItemIconContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#7C3AED" />
            </View>
            <Text style={styles.settingsItemText}>Privacy</Text>
            <MaterialIcons name="chevron-right" size={24} color="#BBB" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
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
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
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
    backgroundColor: '#7C3AED',
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
    width: 104,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userRoleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRole: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  verificationPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
  },
  progressBarBackground: {
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    borderRadius: 4,
  },
  cardButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsItemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  settingsDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 4,
  },
  logoutButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});