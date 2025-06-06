// app/notifications.tsx

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    FlatList,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from './context/AuthContext';
import { useNotifications } from './context/NotificationsContext';

type NotificationType = 'order' | 'promotion' | 'system' | 'security';

const notificationTypeDetails: Record<NotificationType, { icon: string; color: string }> = {
  order: { icon: 'package-variant', color: '#3B82F6' },
  promotion: { icon: 'tag-multiple', color: '#EC4899' },
  system: { icon: 'cog', color: '#6B7280' },
  security: { icon: 'shield-check', color: '#10B981' },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const { user } = useAuth();

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearNotifications },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const renderItem = ({ item }: { item: { id: string; type: NotificationType; title: string; message: string; timeAgo: string; read: boolean } }) => {
    const details = notificationTypeDetails[item.type];
    return (
      <TouchableOpacity
        style={[styles.itemContainer, !item.read && styles.unreadItemBorder]}
        onPress={() => handleMarkAsRead(item.id)}
      >
        <View style={styles.itemIconContainer}>
          {!item.read && <View style={[styles.unreadDot, { backgroundColor: details.color }]} />}
          <MaterialCommunityIcons name={details.icon as any} size={24} color={details.color} />
        </View>
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemTime}>{item.timeAgo}</Text>
          </View>
          <Text style={styles.itemMessage}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconBackground}>
        <MaterialCommunityIcons name="bell-off-outline" size={80} color="#A78BFA" />
      </View>
      <Text style={styles.emptyStateTitle}>No Notifications</Text>
      <Text style={styles.emptyStateSubtitle}>
        You're all caught up! Check back later for updates about your orders, promotions, and account activity.
      </Text>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Please log in to view notifications</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.customHeaderTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          {notifications.length > 0 && (
            <>
              <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.headerButton}>
                <Ionicons name="checkmark-done-outline" size={22} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClearAll} style={styles.headerButton}>
                <Ionicons name="trash-outline" size={22} color="#333" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {notifications.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  headerButton: {
    padding: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderColor: 'transparent',
  },
  unreadItemBorder: {
    borderColor: '#7C3AED',
  },
  itemIconContainer: {
    marginRight: 12,
    alignItems: 'center',
    paddingTop: 2,
    position: 'relative',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    left: -8,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemTime: {
    fontSize: 12,
    color: '#666',
  },
  itemMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateIconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});