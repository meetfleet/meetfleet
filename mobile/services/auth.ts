import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const authService = {
  // Check if user exists by phone number
  checkUserExists: async (phone: string) => {
    return api.post('/api/auth/check', { phone });
  },

  // Register a new user
  register: async (userData: {
    phone: string;
    username: string;
    avatarUrl?: string;
    emoji?: string;
    gender?: string;
    age?: string;
    bio?: string;
    interests?: string;
  }) => {
    const response = await api.post('/api/auth/register', userData);

    if (response.token && response.user) {
      await AsyncStorage.setItem(TOKEN_KEY, response.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  },

  // Get current authenticated user
  getMe: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const user = await api.get('/api/auth/me', token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      throw error;
    }
  },

  updateProfile: async (data: { username?: string; bio?: string; avatarUrl?: string; age?: string; isPremium?: boolean; job?: string; company?: string; interests?: string[] }) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Not authenticated');

    const updatedUser = await api.put('/api/auth/me', data, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  // Logout
  logout: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },
};