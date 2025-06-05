// app/notifications.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  // Image, // Não precisaremos mais de Image para o sino
} from 'react-native';
import { faker } from '@faker-js/faker';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// Importe o seu SVG do sino aqui
import SleepingBellSvg from '../assets/images/notifications.svg'; // <--- AJUSTE O CAMINHO SE NECESSÁRIO

faker.locale = 'en_US';

type NotificationItem = {
  id: string;
  type: 'reminder' | 'health_tip' | 'weight_entry' | 'moment';
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  actions?: { label: string; onPress: () => void }[];
};

const notificationTypes = ['reminder', 'health_tip', 'weight_entry', 'moment'] as const;

const generateNotifications = (count: number): NotificationItem[] => {
  return Array.from({ length: count }).map(() => {
    const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    let title = '';
    let actions: NotificationItem['actions'] = [];

    switch (type) {
      case 'reminder':
        title = 'Lembrete!';
        actions = [
          { label: 'Marcar como feito', onPress: () => console.log('Marcar como feito') },
          { label: 'Atualizar', onPress: () => console.log('Atualizar') },
        ];
        break;
      case 'health_tip':
        title = 'Sua dica de saúde semanal está pronta!';
        actions = [{ label: 'Abrir dicas semanais', onPress: () => console.log('Abrir dicas') }];
        break;
      case 'weight_entry':
        title = 'Hora de registrar seu peso';
        actions = [{ label: 'Adicionar registro de peso', onPress: () => console.log('Adicionar peso') }];
        break;
      case 'moment':
        title = 'Lembrete de momento';
        actions = [
          { label: 'Ver', onPress: () => console.log('Ver momento') },
          { label: 'Atualizar', onPress: () => console.log('Atualizar momento') },
        ];
        break;
    }

    return {
      id: faker.string.uuid(),
      type,
      title,
      message: faker.lorem.sentence(10, 15),
      timeAgo: faker.helpers.arrayElement(['23 min', '2 hr', '1 dy', '3 dy', '1 wk', '2 wk']),
      read: faker.datatype.boolean(),
      actions,
    };
  });
};

const notificationTypeDetails = {
  reminder: { icon: 'clock-alert-outline', color: '#EF4444' },
  health_tip: { icon: 'heart-pulse', color: '#EC4899' },
  weight_entry: { icon: 'scale-bathroom', color: '#3B82F6' },
  moment: { icon: 'calendar-clock', color: '#A855F7' },
};


export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showEmptyState, setShowEmptyState] = useState(false);

  useEffect(() => {
    const fetchedNotifications = generateNotifications(Math.random() > 0.5 ? 7 : 0);
    setNotifications(fetchedNotifications);
    setShowEmptyState(fetchedNotifications.length === 0);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
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
          {item.actions && item.actions.length > 0 && (
            <View style={styles.itemActions}>
              {item.actions.map((action, index) => (
                <TouchableOpacity key={index} onPress={action.onPress} style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconBackground}>
        {/* Use o seu componente SVG importado aqui */}
        <SleepingBellSvg width={80} height={80} />
        {/* Se o seu SVG precisar de cor via prop, você pode passar:
            <SleepingBellSvg width={80} height={80} fill="#A78BFA" />
            Ajuste conforme a necessidade do seu SVG. */}
      </View>
      <Text style={styles.emptyStateTitle}>Você está em dia!</Text>
      <Text style={styles.emptyStateSubtitle}>
        Volte mais tarde para Lembretes, dicas de saúde, momentos e notificações de peso.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.customHeader}>
         <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.customHeaderTitle}>Notificações</Text>
        <TouchableOpacity onPress={() => Alert.alert("Configurações", "Abrir configurações de notificação")} style={styles.headerButton}>
          <Ionicons name="settings-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {showEmptyState ? renderEmptyState() : (
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
    // A cor da borda pode ser definida dinamicamente ou usar o unreadDot.
    // Se for usar a borda, seria algo como:
    // borderColor: item.type === 'reminder' ? '#EF4444' : ...
    // Mas o unreadDot é mais simples aqui.
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
    flexShrink: 1,
  },
  itemTime: {
    fontSize: 12,
    color: '#777',
  },
  itemMessage: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  actionButton: {
    marginRight: 12,
    paddingVertical: 4,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#7C3AED', // Sua cor roxa principal
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#FFF',
  },
  emptyStateIconBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FCE7F3', // Rosa claro (pode ajustar para um tom de roxo claro se preferir, ex: #F3E8FF)
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});