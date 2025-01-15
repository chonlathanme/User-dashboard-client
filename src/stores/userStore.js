import { create } from 'zustand';
import userApi from '../API/user-api';

const userStore = create((set) => ({
  user: [],
  loading: false,
  error: null,

  actionGetUser: async () => {
    try {
      set({ loading: true, error: null });
      const response = await userApi.getUser();
      if (response?.data) {
        set({ 
          user: response.data,
          loading: false 
        });
      }
    } catch (error) {
      console.error('Get users error:', error);
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  actionCreateUsers: async (selectedUsers) => {
    try {
      set({ loading: true, error: null });
      const response = await userApi.createUser(selectedUsers);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.message,
        loading: false 
      });
      throw error;
    }
  }
}));

export default userStore;
