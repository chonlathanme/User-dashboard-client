import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const userApi = {
  getUser: async () => {
    try {
      const response = await axios.get('/api/user/get-users');
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  createUser: async (selectedUsers) => {
    try {
      console.log('Sending to backend:', { selectedUsers });
      const response = await axios.post('/api/user/create-users', {
        selectedUsers
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response);
      return response;
    } catch (error) {
      console.error('Export Error:', error);
      throw error;
    }
  }
};

export default userApi;