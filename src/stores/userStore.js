import { create } from 'zustand';
import userApi from '../API/user-api';

const userStore = create((set) => ({
  user: [],
  loading: false,
  error: null,

  actionGetUser: async () => {
    set({ loading: true });
    try {
      const response = await userApi.getUser();
      const data = response;
      set({ user: data, loading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ user: { success: false, users: [] }, loading: false });
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
