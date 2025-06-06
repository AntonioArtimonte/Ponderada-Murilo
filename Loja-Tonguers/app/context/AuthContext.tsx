import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const MOCK_USERS_KEY = '@mock_users';
const MOCK_PASSWORDS_KEY = '@mock_passwords';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Get mock users and passwords
      const mockUsersStr = await AsyncStorage.getItem(MOCK_USERS_KEY);
      const mockPasswordsStr = await AsyncStorage.getItem(MOCK_PASSWORDS_KEY);
      
      const mockUsers: Record<string, User> = mockUsersStr ? JSON.parse(mockUsersStr) : {};
      const mockPasswords: Record<string, string> = mockPasswordsStr ? JSON.parse(mockPasswordsStr) : {};

      // Check if user exists and password matches
      if (!mockUsers[email] || mockPasswords[email] !== password) {
        throw new Error('Invalid credentials');
      }

      // Set user data
      const userData = mockUsers[email];
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.replace('/home');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Get existing mock data
      const mockUsersStr = await AsyncStorage.getItem(MOCK_USERS_KEY);
      const mockPasswordsStr = await AsyncStorage.getItem(MOCK_PASSWORDS_KEY);
      
      const mockUsers: Record<string, User> = mockUsersStr ? JSON.parse(mockUsersStr) : {};
      const mockPasswords: Record<string, string> = mockPasswordsStr ? JSON.parse(mockPasswordsStr) : {};

      // Check if user already exists
      if (mockUsers[email]) {
        throw new Error('User already exists');
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        verified: false,
      };

      // Save mock data
      mockUsers[email] = newUser;
      mockPasswords[email] = password;

      await AsyncStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));
      await AsyncStorage.setItem(MOCK_PASSWORDS_KEY, JSON.stringify(mockPasswords));

      // Directly log the user in
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      router.replace('/home');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('user');
      setUser(null);
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (email: string) => {
    try {
      setIsLoading(true);
      // Store the OTP in AsyncStorage for verification
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await AsyncStorage.setItem(`@otp_${email}`, otp);
      
      // In a real app, this would send the OTP to the user's email
      console.log('Mock OTP sent:', otp);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      // Get stored OTP
      const storedOTP = await AsyncStorage.getItem(`@otp_${email}`);
      
      if (!storedOTP || storedOTP !== otp) {
        throw new Error('Invalid OTP');
      }

      // Get user data
      const mockUsersStr = await AsyncStorage.getItem(MOCK_USERS_KEY);
      const mockUsers: Record<string, User> = mockUsersStr ? JSON.parse(mockUsersStr) : {};
      
      if (!mockUsers[email]) {
        throw new Error('User not found');
      }

      // Set user as verified and logged in
      const userData = mockUsers[email];
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Clear OTP
      await AsyncStorage.removeItem(`@otp_${email}`);
      
      router.replace('/home');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const mockUsersStr = await AsyncStorage.getItem(MOCK_USERS_KEY);
      if (!mockUsersStr) {
        throw new Error('User not found');
      }

      const mockUsers: Record<string, User> = JSON.parse(mockUsersStr);
      if (!mockUsers[user.email]) {
        throw new Error('User not found');
      }

      // Update mock users data
      mockUsers[user.email] = {
        ...mockUsers[user.email],
        name: userData.name || mockUsers[user.email].name,
        verified: userData.verified || mockUsers[user.email].verified,
      };

      // If email is being changed, we need to update the key
      if (userData.email && userData.email !== user.email) {
        mockUsers[userData.email] = mockUsers[user.email];
        delete mockUsers[user.email];
      }

      await AsyncStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));

      // Update current user data
      const updatedUser = {
        ...user,
        ...userData,
      };

      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        verifyOTP,
        sendOTP,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 